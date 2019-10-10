/**
 * アプリのルートルーティングモジュール。
 * @module ./app/app-routing.module
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { TopComponent } from './top/top.component';
import { LoginComponent } from './auth/login.component';
import { LogoutComponent } from './auth/logout.component';
import { PasswordComponent } from './auth/password.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { MasterViewerComponent } from './master/master-viewer.component';
import { PlayerComponent } from './player/player.component';

/** ルート定義 */
const routes: Routes = [
	{ path: '', pathMatch: 'full', component: TopComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'logout', component: LogoutComponent },
	{ path: 'password', component: PasswordComponent, canActivate: [AuthGuard] },
	{ path: 'admin', component: AdministratorComponent, canActivate: [AuthGuard] },
	{ path: 'masters', component: MasterViewerComponent, canActivate: [AuthGuard] },
	{ path: 'masters/:name', component: MasterViewerComponent, canActivate: [AuthGuard] },
	{ path: 'players', component: PlayerComponent, canActivate: [AuthGuard] },
	{ path: '**', redirectTo: '/' }
];

/**
 * アプリのルートルーティングモジュールクラス。
 */
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
