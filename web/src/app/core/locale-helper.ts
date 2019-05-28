/**
 * ロケール関連のヘルパーモジュール。
 * @module ./app/core/locale-helper
 */
import browserHelper from './browser-helper';
import { environment } from '../../environments/environment';

// ※ 以下Angular内でやっていないのは、Angular初期化のタイミングなどでも使いたかったため。
// ※ 一部のライブラリは、想定していない言語が来るとエラーを投げるので、ここで対応する言語のみに絞り込む。

/**
 * アプリの言語設定を取得する。
 * @returns 2文字の言語コード。
 */
function getLanguage(): string {
	// クエリー→Cookie→ブラウザ設定の順に言語設定を取得する
	// （クエリーは特定言語版のページにリンクできるように、またユーザーが設定を変更できるように）
	let lang = getLanguageFromQuery();
	if (!lang) {
		lang = getLanguageFromCookie();
	}
	if (lang) {
		// Cookieに言語設定を保存or延長する
		setLanguageToCookie(lang);
	} else {
		lang = browserHelper.getLocale().substr(0, 2);
	}
	// 取得した言語がアプリで対応しているかをチェックして返す
	// （許可されていない場合は、許可リストの先頭をデフォルトとして返す）
	if (environment.languages.includes(lang)) {
		return lang;
	}
	return environment.languages[0] || 'en';
}

/**
 * クエリーパラメータの lang=en 等から言語設定を取得する。
 * @returns 言語設定、存在しない場合はnull。
 */
function getLanguageFromQuery(): string {
	const m = /[?$]lang=([^?$]+)/.exec(window.location.search);
	return m ? m[1] : null;
}

/**
 * Cookieの lang=en 等から言語設定を取得する。
 * @returns 言語設定、存在しない場合はnull。
 */
function getLanguageFromCookie(): string {
	const m = /(^|[\s;])lang=([^\s;]+)/.exec(document.cookie);
	return m ? m[2] : null;
}

/**
 * Cookieに lang=en のように言語設定を保存する。
 * @param lang 言語設定。
 */
function setLanguageToCookie(lang: string): void {
	document.cookie = `lang=${lang}; path=/; max-age=604800`;
}

/**
 * アプリのロケールを取得する。
 * @returns ロケールコード。
 */
function getLocale(): string {
	// ブラウザのロケールを元に、アプリで許可されているロケールを返す
	// （許可されていない場合は、許可リストの先頭をデフォルトとして返す）
	const locale = browserHelper.getLocale();
	if (environment.locales.includes(locale)) {
		return locale;
	}
	return environment.locales[0] || 'en-US';
}

export default {
	getLanguage,
	getLocale,
};
