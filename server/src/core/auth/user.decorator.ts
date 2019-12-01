/**
 * ユーザーデコレーターモジュール。
 * @module ./core/auth/user.decorator
 */
import { createParamDecorator } from '@nestjs/common';

/**
 * 認証情報を取得するデコレーター。
 */
export const User = createParamDecorator((data, req) => {
	return req.user;
});
