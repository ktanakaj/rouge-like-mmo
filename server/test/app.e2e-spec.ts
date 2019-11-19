/**
 * @file 結合テスト。
 */
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import './../src/test-helper';
import * as config from 'config';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
const RedisStore = connectRedis(session);
import { createClient } from './../src/core/redis';
import { AllExceptionsFilter } from './../src/shared/all-exceptions.filter';
import { AppModule } from './../src/app.module';

// ※ 個別APIの結果の確認はユニットテストで実施。ここでは全体的な動きを確認

describe('AppModule (e2e)', () => {
	let app;
	let agent: request.SuperTest<request.Test>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		// TODO: mainで行っている初期化処理やミドルウェアが含まれないので手動で登録。整理したい
		app.use(session(Object.assign({ store: new RedisStore({ client: createClient(config['redis']['session']) as any }) }, config['session'])));
		app.useGlobalFilters(new AllExceptionsFilter());
		app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
		await app.init();
		agent = request.agent(app.getHttpServer());
	});

	it('new user scenario', async () => {
		await agent
			.get('/api/env')
			.expect(200)
			.then(res => {
				expect(res.body.minimumAppVersion).toMatch(/\d\.\d\.\d/);
			});

		await agent
			.get('/api/masters')
			.expect(200)
			.then(res => {
				expect(res.body.length).toBeGreaterThan(0);
			});

		await agent
			.post('/api/players')
			.send({ token: 'E2ETEST_NEW_TOKEN' })
			.expect(201)
			.then(res => {
				expect(res.body.id).not.toBeNull();
			});

		await agent
			.post('/api/pc')
			.send({ name: 'E2ETEST_NEW_PC' })
			.expect(201)
			.then(res => {
				expect(res.body.id).not.toBeNull();
			});
	});
});
