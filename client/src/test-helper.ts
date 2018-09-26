/**
 * ユニットテスト補助用の共通処理。
 * @module ./test-helper
 */
import { Observable, of } from 'rxjs';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BsDropdownModule, CollapseModule, ModalModule, PaginationModule } from 'ngx-bootstrap';
import { AuthService } from './app/auth/auth.service';

/** JSONファイルを使用するローカライズファイルローダー */
class JsonTranslationLoader implements TranslateLoader {
	getTranslation(code: string = ''): Observable<object> {
		const c = code.toLowerCase();
		return of(require(__dirname + '/assets/i18n/' + c + '.json'));
	}
}

/** アプリ共通のモジュール群 */
const modules = [
	HttpClientTestingModule,
	RouterTestingModule,
	FormsModule,
	TranslateModule.forRoot({
		loader: {
			provide: TranslateLoader,
			useClass: JsonTranslationLoader,
		}
	}),
	BsDropdownModule.forRoot(),
	CollapseModule.forRoot(),
	ModalModule.forRoot(),
	PaginationModule.forRoot(),
];

/** アプリ共通のプロバイダー群 */
const providers = [
	TranslateService,
	AuthService,
];

/**
 * アプリ共通のモジュールロード等を追加したTestBed.configureTestingModule。
 * @param moduleDef configureTestingModuleに渡すパラメータ。
 * @returns configureTestingModuleの戻り値。
 */
function configureTestingModule(moduleDef: TestModuleMetadata): typeof TestBed {
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

	return TestBed.configureTestingModule(moduleDef);
}

export default {
	configureTestingModule,
};
