/**
 * 「ローグライクなMMOブラウザゲーム」ルートモジュール。
 * @module ./app/app.module
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, Injectable, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BsDropdownModule, CollapseModule, ModalModule, PaginationModule } from 'ngx-bootstrap';

import localeHelper from './core/locale-helper';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth.guard';
import { IfRoleDirective } from './shared/if-role.directive';
import { AppComponent } from './app.component';
import { TopComponent } from './top/top.component';
import { HeaderComponent } from './layout/header.component';
import { SidebarComponent } from './layout/sidebar.component';
import { AdminRoleComponent } from './shared/admin-role.component';
import { MasterStatusComponent } from './shared/master-status.component';
import { LoginComponent } from './auth/login.component';
import { LogoutComponent } from './auth/logout.component';
import { PasswordComponent } from './auth/password.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { MasterVersionComponent } from './master/master-version.component';
import { MasterViewerComponent } from './master/master-viewer.component';

/** ルート定義 */
const appRoutes: Routes = [
	{ path: '', pathMatch: 'full', component: TopComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'logout', component: LogoutComponent },
	{ path: 'password', component: PasswordComponent, canActivate: [AuthGuard] },
	{ path: 'admin', component: AdministratorComponent, canActivate: [AuthGuard] },
	{ path: 'masters', component: MasterVersionComponent, canActivate: [AuthGuard] },
	{ path: 'masters/latest', component: MasterViewerComponent, canActivate: [AuthGuard] },
	{ path: 'masters/latest/:name', component: MasterViewerComponent, canActivate: [AuthGuard] },
	{ path: '**', redirectTo: '/' }
];

/**
 * デフォルトのエラーハンドラー。
 */
@Injectable()
class DefaultErrorHandler implements ErrorHandler {
	/** HttpErrorとメッセージの対応表 */
	msgIdByStatus = {
		400: 'ERROR.BAD_REQUEST',
		401: 'ERROR.UNAUTHORIZED',
		403: 'ERROR.FORBIDDEN',
		404: 'ERROR.NOT_FOUND',
		409: 'ERROR.CONFLICT',
	};

	/**
	 * サービスをDIしてハンドラーを生成する。
	 * @param translate 国際化サービス。
	 */
	constructor(private translate?: TranslateService) { }

	/**
	 * エラーを受け取る。
	 * @param error エラー情報。
	 */
	handleError(error: Error | any): void {
		// ※ Promiseの中で発生したエラーの場合、ラップされてくるので、元の奴を取り出す
		if (error && error.rejection) {
			error = error.rejection;
		}
		// 404等のエラーの場合、専用のエラーメッセージを表示。それ以外はデフォルトのエラー
		let msgId;
		if (error instanceof HttpErrorResponse) {
			msgId = this.msgIdByStatus[error.status];
		}
		console.error(error);
		this.translate.get(msgId || 'ERROR.FATAL').subscribe((res: string) => {
			window.alert(res);
		});
	}
}

/**
 * 「ローグライクなMMOブラウザゲーム」ルートモジュールクラス。
 */
@NgModule({
	declarations: [
		AppComponent,
		IfRoleDirective,
		LoginComponent,
		LogoutComponent,
		PasswordComponent,
		HeaderComponent,
		SidebarComponent,
		AdminRoleComponent,
		MasterStatusComponent,
		TopComponent,
		AdministratorComponent,
		MasterVersionComponent,
		MasterViewerComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		RouterModule.forRoot(appRoutes),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/'),
				deps: [HttpClient]
			}
		}),
		BsDropdownModule.forRoot(),
		CollapseModule.forRoot(),
		PaginationModule.forRoot(),
		ModalModule.forRoot(),
	],
	providers: [
		{ provide: LOCALE_ID, useValue: localeHelper.getLocale() },
		{ provide: ErrorHandler, useClass: DefaultErrorHandler },
		AuthService,
		AuthGuard,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }