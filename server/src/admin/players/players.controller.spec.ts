/**
 * @file players.controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import Player from '../../game/shared/player.model';
import { PlayersController } from './players.controller';

describe('PlayersController', () => {
	let module: TestingModule;
	let controller: PlayersController;

	before(async () => {
		await Player.create({ id: 140, token: 'UNITTEST_TOKEN140', lastLogin: new Date() });

		module = await testHelper.createTestingModule({
			controllers: [PlayersController],
		}).compile();
		controller = module.get<PlayersController>(PlayersController);
	});

	describe('#findAndCountAdministrators()', () => {
		it('成功', async () => {
			const result = await controller.findAndCountPlayers({ page: 1, max: 1000 });
			assert(result.count > 0);
			assert(result.rows.length > 0);

			const player = result.rows[0];
			assert(player.id > 0);
			assert.strictEqual(player.token, undefined);
		});
	});
});
