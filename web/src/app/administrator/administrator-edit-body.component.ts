/**
 * 管理者編集本体部コンポーネント。
 * @module app/administrator/administrator-edit-body.component
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppError } from '../core/app-error';
import { Administrator } from './administrator.model';
import { AdministratorService } from './administrator.service';

/**
 * 管理者入力フォーム。
 */
export class AdministratorForm implements Administrator {
	/** 管理者ID */
	id?: number;
	/** 管理者名 */
	name: string;
	/** 権限 */
	role = 'readonly';
	/** 備考 */
	note?: string;
	/** 登録日時 */
	createdAt?: string;
	/** 更新日時 */
	updatedAt?: string;
	/** 削除日時 */
	deletedAt?: string;

	constructor(admin?: Administrator) {
		if (admin) {
			Object.assign(this, admin);
		}
	}
}

/**
 * 管理者編集本体部コンポーネントクラス。
 */
@Component({
	selector: 'app-administrator-edit-body',
	templateUrl: './administrator-edit-body.component.html',
	styleUrls: ['./administrator-edit-body.component.css'],
	providers: [
		AdministratorService,
	],
})
export class AdministratorEditBodyComponent {
	/** 編集する管理者 */
	@Input('admin')
	set adminInput(admin: Administrator) {
		this.admin = new AdministratorForm(admin);
	}
	/** 編集終了通知用のイベント */
	@Output() completed = new EventEmitter<boolean>();

	/** 画面ロック中か？ */
	isLocked = false;
	/** エラーメッセージ */
	error = '';
	/** 編集中の管理者情報 */
	admin = new AdministratorForm();

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param translate 言語リソース関連サービス。
	 * @param administratorService 管理者関連サービス。
	 */
	constructor(
		private translate: TranslateService,
		private administratorService: AdministratorService) {
	}

	/**
	 * 管理者を保存する。
	 * @returns 処理状態。
	 */
	async submit(): Promise<void> {
		this.isLocked = true;
		this.error = '';
		const form = this.admin;
		try {
			const admin = await this.administratorService.save(form);
			// 新規アカウントの場合、パスワードを通知
			// TODO: できればメール送信などにしたい
			if (!form.id) {
				const msg = await this.translate.get('ADMINISTRATOR_PAGE.REGISTERED', admin).toPromise();
				window.alert(msg);
			}
			this.completed.emit(true);
		} catch (e) {
			if (!(e instanceof AppError) || e.status !== 409) {
				throw e;
			}
			this.error = 'VALIDATE.DUPLICATED';
		} finally {
			this.isLocked = false;
		}
	}

	/**
	 * 管理者を削除する。
	 * @returns 処理状態。
	 */
	async delete(): Promise<void> {
		this.isLocked = true;
		const id = this.admin.id;
		try {
			const confirm = await this.translate.get('DELETE_CONFIRMING.BODY').toPromise();
			if (window.confirm(confirm)) {
				await this.administratorService.delete(id);
				this.completed.emit(true);
			}
		} finally {
			this.isLocked = false;
		}
	}

	/**
	 * 管理者のパスワードをリセットする。
	 * @returns 処理状態。
	 */
	async resetPassword(): Promise<void> {
		this.isLocked = true;
		const id = this.admin.id;
		try {
			// TODO: できれば自分でリセットしてメール送信するようにしたい
			const confirm = await this.translate.get('ADMINISTRATOR_PAGE.PASSWORD_RESET_BODY').toPromise();
			if (window.confirm(confirm)) {
				const admin = await this.administratorService.resetPassword(id);
				const msg = await this.translate.get('ADMINISTRATOR_PAGE.PASSWORD_RESETED', admin).toPromise();
				window.alert(msg);
			}
		} finally {
			this.isLocked = false;
		}
	}

	/**
	 * 管理者編集をキャンセルする。
	 */
	cancel(): void {
		this.completed.emit(false);
	}
}
