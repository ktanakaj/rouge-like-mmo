/**
 * ゲームロジック用サービスモジュール。
 * @module ./game/shared/game.service
 */
import { Injectable, Optional } from '@nestjs/common';
import { RedisRpcClient } from '../../core/redis/redis-rpc-client';
import Dungeon from './dungeon.model';
import Floor from './floor.model';
import PlayerCharacter from './player-character.model';
import { floorManager } from './floor-manager';

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
		await Dungeon.findOrFailWithIsActive(dungeonId);
		const floor = await Floor.create({
			dungeonId,
			no,
			// TODO: レベルはダンジョンマスタと階数から計算する？
			level: 1,
			players: 0,
			// FIXME: 本当はこのサーバーの外部からアクセス可能なホスト名などを入れる
			server: 'localhost',
			port: 80,
			// TODO: マップはここで動的に生成する。とりあえず固定で返す
			// TODO: フォーマットも要検討。今は『ローグ』のフォーマットを使っている。
			map: `
                  ------------
                  |..........|
                  |..........|
##################+..........|
#                 |..........|
#                 ------------
#
---+---
|.....|
|.....|
|.....+######        --------------
-------     #        |............|
            #        |............|
            #########+............|
                     |............|
                     --------------`,
		});

		// 生成したフロアは、このサーバーインスタンスの管理下に置く
		floorManager.floors.set(floor.id, floor);
		return floor;
	}

	/**
	 * フロアにPCを配置する。
	 * @param floor フロア。
	 * @param playerId プレイヤーID。
	 * @param pcId PC ID。
	 * @returns 処理状態。
	 */
	async joinFloor(floor: Floor, playerId: number, pcId: number): Promise<void> {
		// フロア管理に、プレイヤーとフロアの紐づけを登録する
		// FIXME: PCもフロアに配置する
		await PlayerCharacter.findOrFail(playerId, pcId);
		floorManager.floorIdByPlayerId.set(playerId, floor.id);
	}
}
