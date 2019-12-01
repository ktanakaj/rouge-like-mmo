/**
 * sequelize-typescriptのシャーディング拡張。
 * @module ./core/db/shardable
 */
export * from './shardable-sequelize';
import ShardableModel from './shardable-model';
export { ShardableModel };
export * from './distribution-key.decorator';
export * from './table.decorator';
