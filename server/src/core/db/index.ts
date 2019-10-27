/**
 * DBモジュール。
 *
 * DB関連の共通的な機能を集めたモジュール。
 * @module ./core/db
 */
export * from './shardable-sequelize';
import ShardableModel from './shardable-model';
export { ShardableModel };
export * from './distribution-key.decorator';
export * from './table.decorator';
import DataModel from './data-model';
export { DataModel };
import MasterModel from './master-model';
export { MasterModel };
