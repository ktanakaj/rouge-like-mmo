/**
 * ユニットテスト補助用の共通処理。
 * @module ./test-helper
 */
import { Observable, of } from 'rxjs';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AlertModule, BsDropdownModule, CollapseModule, ModalModule, PaginationModule } from 'ngx-bootstrap';
import { AuthInfo } from './app/shared/common.model';
import { IfRoleDirective } from './app/shared/if-role.directive';
import { LoadingComponent } from './app/shared/loading.component';
import { ValidationErrorComponent } from './app/shared/validation-error.component';
import { AdminRoleComponent } from './app/shared/admin-role.component';
import { MasterStatusComponent } from './app/shared/master-status.component';

/** JSONファイルを使用するローカライズファイルローダー */
class JsonTranslationLoader implements TranslateLoader {
	getTranslation(code: string = ''): Observable<object> {
		const c = code.toLowerCase();
		return of(require(__dirname + '/assets/i18n/' + c + '.json'));
	}
}

/** アプリ共通のモジュール群 */
const commonModuleDef = {
	imports: [
		HttpClientTestingModule,
		RouterTestingModule,
		FormsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useClass: JsonTranslationLoader,
			}
		}),
		AlertModule.forRoot(),
		BsDropdownModule.forRoot(),
		CollapseModule.forRoot(),
		ModalModule.forRoot(),
		PaginationModule.forRoot(),
	],
	providers: [
		{ provide: AuthInfo, useValue: new AuthInfo() },
	],
	declarations: [
		IfRoleDirective,
		LoadingComponent,
		ValidationErrorComponent,
		AdminRoleComponent,
		MasterStatusComponent,
	],
};

/**
 * アプリ共通のモジュールロード等を追加したTestBed.configureTestingModule。
 * @param moduleDef configureTestingModuleに渡すパラメータ。
 * @returns configureTestingModuleの戻り値。
 */
function configureTestingModule(moduleDef: TestModuleMetadata): typeof TestBed {
	// 渡されたパラメータに上述の共通モジュール群をマージする
	for (const key of ['imports', 'providers', 'declarations']) {
		moduleDef[key] = moduleDef[key] || [];
		for (const o of commonModuleDef[key]) {
			// 同じ値が渡されたときは設定しない。
			// ただし、provideなどの場合同じか判断できないので、配列の先に追加する。
			// （Angularは後の方を優先する模様。）
			if (!moduleDef[key].includes(o)) {
				moduleDef[key].unshift(o);
			}
		}
	}
	return TestBed.configureTestingModule(moduleDef);
}

export default {
	configureTestingModule,
};
