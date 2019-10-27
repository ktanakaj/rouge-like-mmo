/**
 * ユニットテスト補助用の共通処理。
 * @module ./test-helper
 */
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { Observable } from 'rxjs';
import { databaseProviders, modelProviders } from './shared/database.providers';
import { RedisRpcClient } from './core/redis';

/** アプリ共通のモジュール群 */
const modules = [];

/** アプリ共通のプロバイダー群 */
const providers = [
	...databaseProviders,
	...modelProviders,
	{
		// 通信されないよう空のモッククライアントに差し替え
		provide: RedisRpcClient,
		useValue: {
			send: () => Observable.create((observer) => {
				observer.next(null);
				observer.complete();
			}),
		},
	},
];

/**
 * アプリ共通のモジュールロード等を追加したTest.createTestingModule。
 * @param moduleDef createTestingModuleに渡すパラメータ。
 * @returns createTestingModuleの戻り値。
 */
function createTestingModule(moduleDef: ModuleMetadata): TestingModuleBuilder {
	moduleDef.imports = moduleDef.imports || [];
	for (const m of modules) {
		if (!moduleDef.imports.includes(m)) {
			moduleDef.imports.push(m);
		}
	}

	moduleDef.providers = moduleDef.providers || [];
	for (const p of providers) {
		if (!moduleDef.providers.includes(p)) {
			moduleDef.providers.push(p);
		}
	}

	return Test.createTestingModule(moduleDef);
}

export default {
	createTestingModule,
};

// 全テストの前に一度だけ実行される前処理
// ※ 本当は test.js がそのつもりなのだが、test.jsでの初期化はbeforeAllとは扱いが違うようなので暫定的にここに定義
beforeAll(async () => {
	await Promise.all(databaseProviders.map(p => p.useFactory()));
});
