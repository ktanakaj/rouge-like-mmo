/**
 * バッチ終了コード定数値モジュール。
 * @module ./batch/core/exit-code
 */

/**
 * バッチ終了コード定数値。
 */
export enum ExitCode {
	// https://www.freebsd.org/cgi/man.cgi?query=sysexits&apropos=0&sektion=0&manpath=FreeBSD+4.3-RELEASE&format=html
	// ↑この辺もとに定義

	/** 戻り値: 成功 */
	Success = 0,
	/** 戻り値: 失敗 */
	Failure = 1,
	/** 戻り値: 引き数誤り */
	Usage = 64,
	/** 戻り値: 入力データ誤り */
	DataErr = 65,
	/** 戻り値: 入力データ無し */
	NoInput = 66,
	/** 戻り値: 指定されたユーザーが無い */
	NoUser = 67,
	/** 戻り値: 指定されたホストが無い */
	NoHost = 68,
	/** 戻り値: 利用不可 */
	Unavailable = 69,
	/** 戻り値: ソフトウェアの内部的エラー */
	Software = 70,
	/** 戻り値: osのエラー */
	OSErr = 71,
	/** 戻り値: システムファイルが無い等 */
	OSFile = 72,
	/** 戻り値: ファイルが出力できない */
	CantCreat = 73,
	/** 戻り値: i/oエラー */
	IOErr = 74,
	/** 戻り値: 一時的エラー */
	TempFail = 75,
	/** 戻り値: リモートシステムのプロトコルエラー */
	Protocol = 76,
	/** 戻り値: アプリ内の権限エラー */
	NoPerm = 77,
	/** 戻り値: 設定ミスなど */
	Config = 78,
}
