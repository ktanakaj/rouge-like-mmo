/**
 * @file 「ローグライクなMMOブラウザゲーム」サーバー起動スクリプト。
 *
 * ゲームサーバー起動時はこのファイルを実行する。
 */
import * as os from 'os';
import * as config from 'config';
import * as log4js from 'log4js';

// log4jsの初期化。Nest.js周りなどインポートにも時間がかかるようなので、先に開始ログを出力
log4js.configure(config['log4js']);
const hostName = process.env.HOSTNAME || os.hostname() || '';
log4js.getLogger('debug').info(`${hostName}: Worker: pid=${process.pid} initializing...`);

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, SwaggerDocument } from '@nestjs/swagger';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { startMonitoring } from './core/models/redis-helper';
import { AllExceptionsFilter } from './shared/all-exceptions.filter';
import { DebugLoggerService } from './shared/debug-logger.service';
import { AppModule } from './app.module';
const RedisStore = connectRedis(session);

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
	app.use(session(Object.assign({ store: new RedisStore(config['redis']['session']) }, config['session'])));

	// 本番環境等以外では、Swagger-UIも出力
	if (config['debug']['apidocs']) {
		const swaggerdoc = SwaggerModule.createDocument(app, config['swagger']);
		addSwaggerSecurityDoc(swaggerdoc);
		SwaggerModule.setup('swagger', app, swaggerdoc);
	}

	// 全APIで共通の例外処理を有効化
	app.useGlobalFilters(new AllExceptionsFilter());

	// 全APIでバリデーションを有効化、DTOがあるものは未定義のパラメータを受け付けない
	// （forbidNonWhitelistedは要らない気もするが、付けないと原因不明になりがちなので）
	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));

	// サーバー待ち受け開始
	await app.listen(process.env.PORT || 3000);
	log4js.getLogger('debug').info(`${hostName}: Worker: pid=${process.pid} up`);
}
bootstrap().catch((e) => log4js.getLogger('error').fatal(e));

/**
 * Swaggerドキュメントにセキュリティ情報を付加する。
 * @param doc 付加するSwaggerドキュメント。
 */
function addSwaggerSecurityDoc(doc: SwaggerDocument): void {
	// ※ 現状の @nestjs/swagger には独自のセキュリティを指定するデコレーターがないので、生成されたJSONを直接追記する
	// TODO: 邪道なやり方なので、本家が対応してくれるならそれに直す（issue送信済み）
	for (const p in doc.paths) {
		if (p.startsWith('/api/admin/')) {
			if (p === '/api/admin/administrators/login') {
				continue;
			}
			for (const m in doc.paths[p]) {
				doc.paths[p][m]['security'] = [{ SessionId: [] }];
			}
		} else {
			for (const m in doc.paths[p]) {
				doc.paths[p][m]['security'] = [{ PlayerToken: [] }];
			}
		}
	}
}