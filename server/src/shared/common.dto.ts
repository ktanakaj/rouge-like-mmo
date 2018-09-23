/**
 * アプリ内で共通的なDTO定義。
 * @module ./shared/common.dto
 */
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
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
	@ApiModelProperty({ description: 'ID', type: 'integer' })
	id: number;
}

/** ページング系API用のクエリー。 */
export class PagingQuery {
	@Transform(toNumberIfIsNumber)
	@IsInt()
	@Min(1)
	@ApiModelPropertyOptional({ description: 'ページ番号（先頭ページが1）', type: 'integer', format: 'int32' })
	page?: number = 1;

	@Transform(toNumberIfIsNumber)
	@IsInt()
	@Min(1)
	@Max(1000)
	@ApiModelPropertyOptional({ description: '1ページ辺りの最大件数', type: 'integer', format: 'int32' })
	max?: number = 100;
}
