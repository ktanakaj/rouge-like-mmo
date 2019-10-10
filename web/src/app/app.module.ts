/**
 * アプリのルートモジュール。
 * @module ./app/app.module
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler, Injectable, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AlertModule, BsDropdownModule, CollapseModule, ModalModule, PaginationModule } from 'ngx-bootstrap';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AppError } from './core/app-error';
import localeHelper from './core/locale-helper';
import { RequestInterceptor } from './core/request-interceptor';
import { AuthGuard } from './auth.guard';
import { AppComponent } from './app.component';
import { TopComponent } from './top/top.component';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';
import { SidebarComponent } from './layout/sidebar.component';
import { LoginComponent } from './auth/login.component';
import { LogoutComponent } from './auth/logout.component';
import { PasswordComponent } from './auth/password.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { AdministratorEditBodyComponent } from './administrator/administrator-edit-body.component';
import { MasterViewerComponent } from './master/master-viewer.component';
import { PlayerComponent } from './player/player.component';

/**
 * デフォルトのエラーハンドラー。
 */
@Injectable()
export class DefaultErrorHandler implements ErrorHandler {
	/** HttpErrorとメッセージの対応表 */
	msgIdByStatus = {
		400: 'ERROR.BAD_REQUEST',
		401: 'ERROR.UNAUTHORIZED',
		403: 'ERROR.FORBIDDEN',
		404: 'ERROR.NOT_FOUND',
		408: 'ERROR.REQUEST_TIMEOUT',
		409: 'ERROR.CONFLICT',
		429: 'ERROR.TOO_MANY_REQUESTS',
		503: 'ERROR.SERVICE_UNAVAILABLE',
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
		if (error instanceof AppError || error instanceof HttpErrorResponse) {
			msgId = this.msgIdByStatus[error.status];
		}
		console.error(error);
		this.translate.get(msgId || 'ERROR.FATAL').subscribe((msg: string) => {
			if (!environment.production && !msgId && error.message) {
				msg += `\n\n(${error.message})`;
			}
			window.alert(msg);
		});
	}
}

/**
 * アプリのルートモジュールクラス。
 */
@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		LogoutComponent,
		PasswordComponent,
		HeaderComponent,
		FooterComponent,
		SidebarComponent,
		TopComponent,
		AdministratorComponent,
		AdministratorEditBodyComponent,
		MasterViewerComponent,
		PlayerComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpClientModule,
		AlertModule.forRoot(),
		BsDropdownModule.forRoot(),
		CollapseModule.forRoot(),
		PaginationModule.forRoot(),
		ModalModule.forRoot(),
		AppRoutingModule,
		SharedModule,
	],
	providers: [
		{ provide: LOCALE_ID, useValue: localeHelper.getLocale() },
		{ provide: ErrorHandler, useClass: DefaultErrorHandler },
		{ provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
		AuthGuard,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
