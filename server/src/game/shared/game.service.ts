/**
 * ゲームロジック用サービスモジュール。
 * @module ./game/shared/game.service
 */
import { Injectable, Optional } from '@nestjs/common';
import { RedisRpcClient } from '../../core/redis/redis-rpc-client';
import Floor from './floor.model';

/**
 * ゲームロジック用サービスクラス。
 */
@Injectable()
export class GameService {
	/**
	 * 引数をDIしてサービスインスタンスを生成する。
	 * @param client Redis pub/sub用クライアント。
	 */
	constructor(@Optional() private readonly client: RedisRpcClient) { }

	/**
	 * 指定されたダンジョンにフロアを新規作成、PCを配置する。
	 * @param playerId プレイヤーID。
	 * @param pcId PC ID。
	 * @param dungeonId ダンジョンID。
	 * @returns 生成したフロア。
	 */
	create(playerId: number, pcId: number, dungeonId: number): Promise<Floor> {
		// Redisのpub/subで、フロアサーバーにフロアの作成を依頼、その結果を返す
		return this.client.send<Floor>('create', { playerId, pcId, dungeonId }).toPromise();
	}
}