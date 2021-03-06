/**
 * アプリ内で共通的なDTO定義。
 * @module ./shared/common.dto
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Min, Max } from 'class-validator';

/**
 * 数値に変換可能なパラメータの場合変換する。
 * @param n 変換する値。
 * @returns 変換後の値。数値以外は何もしない。
 */
export function toNumberIfIsNumber(n: any): any {
	const num = Number(n);
	return isNaN(num) ? n : num;
}

/** ID系API用のパラメータ。 */
export class IdParam {
	@Transform(toNumberIfIsNumber)
	@IsInt()
	@ApiProperty({ description: 'ID', type: 'integer' })
	id: number;
}

/** ページング系API用のクエリー。 */
export class PagingQuery {
	@Transform(toNumberIfIsNumber)
	@IsInt()
	@Min(1)
	@ApiPropertyOptional({ description: 'ページ番号（先頭ページが1）', type: 'integer', format: 'int32' })
	page?: number = 1;

	@Transform(toNumberIfIsNumber)
	@IsInt()
	@Min(1)
	@Max(1000)
	@ApiPropertyOptional({ description: '1ページ辺りの最大件数', type: 'integer', format: 'int32' })
	max?: number = 100;
}

/** エラー時の戻り値のエラー情報。 */
export class ErrorResultError {
	@ApiProperty({ description: 'エラーID', type: 'integer' })
	code: number;
	@ApiProperty({ description: 'エラーメッセージ' })
	message: string;
	@ApiPropertyOptional({ description: '追加情報' })
	data?: any;
}

/** エラー時の戻り値フォーマット。 */
export class ErrorResult {
	@ApiProperty({ description: 'エラー情報', type: ErrorResultError })
	error: ErrorResultError;
}
