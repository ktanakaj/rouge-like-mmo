/**
 * ロールデコレーターモジュール。
 * @module ./admin/shared/roles.decorator
 */
import { SetMetadata } from '@nestjs/common';

/**
 * ロールを設定するデコレーター。
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);