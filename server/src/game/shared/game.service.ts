/**
 * ゲームロジック用サービスモジュール。
 * @module ./game/shared/game.service
 */
import { Injectable, Optional } from '@nestjs/common';
import { RedisRpcClient } from '../../core/redis/redis-rpc-client';
import Dungeon from './dungeon.model';
import Floor from './floor.model';
import PlayerCharacter from './player-character.model';

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
	 * 指定されたダンジョンにフロアを新規作成、PCを配置するよう要求する。
	 * @param playerId プレイヤーID。
	 * @param pcId PC ID。
	 * @param dungeonId ダンジョンID。
	 * @returns 生成したフロア。
	 */
	requestFloor(playerId: number, pcId: number, dungeonId: number): Promise<Floor> {
		// Redisのpub/subで、フロアサーバーにフロアの作成を依頼、その結果を返す
		return this.client.send<Floor>('create', { playerId, pcId, dungeonId }).toPromise();
	}

	/**
	 * 指定されたダンジョンにフロアを新規作成する。
	 * @param dungeonId ダンジョンID。
	 * @param no 階層。
	 * @returns 生成したフロア。
	 */
	async createFloor(dungeonId: number, no: number = 1): Promise<Floor> {
		const dungeon = await Dungeon.findOrFailWithIsActive(dungeonId);
		return await Floor.create({
			dungeonId,
			no,
			// TODO: レベルはダンジョンマスタと階数から計算する？
			level: 1,
			players: 0,
			// FIXME: 本当はこのサーバーの外部からアクセス可能なホスト名などを入れる
			server: 'localhost',
			port: 80,
			// TODO: マップはここで動的に生成する。とりあえず固定で返す
			// TODO: フォーマットも要検討。ちゃんとJSONの方がいいか。
			map: '----------\n|........|\n|........|\n|........|\n|.....%..|\n|........|\n----------',
		});
	}

	async joinFloor(floor: Floor, playerId: number, pcId: number): Promise<void> {
		const pc = await PlayerCharacter.findOrFail(playerId, pcId);
	}
}
