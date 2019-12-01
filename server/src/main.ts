/**
 * @file ゲームサーバー起動スクリプト。
 *
 * ゲームサーバー起動時はこのファイルを実行する。
 */
import * as os from 'os';
import * as config from 'config';
import * as log4js from 'log4js';

// log4jsの初期化。I/Oが遅い環境でインポートに時間がかかる事があったので、先に開始ログを出力
log4js.configure(config['log4js']);
const hostName = process.env.HOSTNAME || os.hostname() || '';
log4js.getLogger('debug').info(`${hostName}: Worker: pid=${process.pid} initializing...`);

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { AllExceptionsFilter } from './shared/all-exceptions.filter';
import { DebugLoggerService } from './shared/debug-logger.service';
import { RedisRpcServer, createClient, startMonitoring } from './core/redis';
import { WebSocketRpcServer } from './core/ws';
import { AppModule } from './app.module';
const RedisStore = connectRedis(session);
const errorLogger = log4js.getLogger('error');
const wsLogger = log4js.getLogger('ws');
const redisLogger = log4js.getLogger('redis');

/**
 * サーバーの起動。
 * @returns 処理状態。
 */
async function bootstrap(): Promise<void> {
	// Redisコマンドログ出力の設定
	if (config['debug']['redisLog']) {
		await startMonitoring(config['redis']['redis']);
	}

	// アプリケーションの生成
	const app = await NestFactory.create(AppModule, {
		logger: new DebugLoggerService(),
	});

	// グローバルミドルウェアの登録
	app.use(session(Object.assign({ store: new RedisStore({ client: createClient(config['redis']['session']) as any }) }, config['session'])));

	// 本番環境等以外では、Swagger-UIも出力
	if (config['debug']['apidocs']) {
		SwaggerModule.setup('swagger', app, SwaggerModule.createDocument(app, config['swagger']));
	}

	// 全REST APIで共通の例外処理を有効化
	app.useGlobalFilters(new AllExceptionsFilter());

	// 全REST APIでバリデーションを有効化、DTOがあるものは未定義のパラメータを受け付けない
	// （forbidNonWhitelistedは要らない気もするが、付けないと原因不明になりがちなので）
	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));

	// フロアサーバーとして機能する場合、WebSocketとRedis pub/subのマイクロサービスも起動する
	if (config['floorserver']) {
		// WebSocketサーバーの初期化
		const wsrpc = new WebSocketRpcServer(
			{ server: app.getHttpServer(), path: '/ws/' },
			{ prefix: '/ws/', logger: (level, message) => wsLogger[level](message) });
		wsrpc.on('error', (err) => errorLogger.error(err));
		// ※ コネクションのエラーは、wsLoggerの方でもログが出るのでここは無視
		wsrpc.on('connection', (conn) => conn.on('error', () => { return; }));
		app.connectMicroservice({ strategy: wsrpc });

		// Redisによるpub/sub待ち受けの初期化
		const redisrpc = new RedisRpcServer(config['redis']['pubsub'], {
			prefix: '/redis/', logger: (level, message) => redisLogger[level](message),
		});
		app.connectMicroservice({ strategy: redisrpc });

		await app.startAllMicroservicesAsync();
	}

	// サーバー待ち受け開始
	await app.listen(process.env.PORT || 3000);
	log4js.getLogger('debug').info(`${hostName}: Worker: pid=${process.pid} up`);
}
bootstrap().catch((e) => errorLogger.fatal(e));
