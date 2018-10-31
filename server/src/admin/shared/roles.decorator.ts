/**
 * ロールデコレーターモジュール。
 * @module ./admin/shared/roles.decorator
 */
import { ReflectMetadata } from '@nestjs/common';

/**
 * ロールを設定するデコレーター。
 */
export const Roles = (...roles: string[]) => ReflectMetadata('roles', roles);