/**
 * アプリの共有モジュール。
 * @module ./app/shared/shared.module
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AuthInfo } from './common.model';
import { IfRoleDirective } from './if-role.directive';
import { LoadingComponent } from './loading.component';
import { ValidationErrorComponent } from './validation-error.component';
import { AdminRoleComponent } from './admin-role.component';
import { MasterStatusComponent } from './master-status.component';

/**
 * アプリの共有モジュールクラス。
 */
@NgModule({
	declarations: [
		IfRoleDirective,
		LoadingComponent,
		ValidationErrorComponent,
		AdminRoleComponent,
		MasterStatusComponent,
	],
	providers: [
		{ provide: AuthInfo, useValue: new AuthInfo() },
	],
	imports: [
		CommonModule,
		HttpClientModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/'),
				deps: [HttpClient]
			}
		}),
	],
	exports: [
		CommonModule,
		TranslateModule,
		IfRoleDirective,
		LoadingComponent,
		ValidationErrorComponent,
		AdminRoleComponent,
		MasterStatusComponent,
	]
})
export class SharedModule { }
