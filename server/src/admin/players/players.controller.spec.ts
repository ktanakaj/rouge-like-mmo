/**
 * @file players.controller.tsのテスト。
 */
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import Player from '../../game/shared/player.model';
import { PlayersController } from './players.controller';

describe('admin/PlayersController', () => {
	let module: TestingModule;
	let controller: PlayersController;

	beforeAll(async () => {
		await Player.create({ id: 140, token: 'UNITTEST_TOKEN140', lastLogin: new Date() });

		module = await testHelper.createTestingModule({
			controllers: [PlayersController],
		}).compile();
		controller = module.get<PlayersController>(PlayersController);
	});

	describe('#findAndCountAdministrators()', () => {
		it('成功', async () => {
			const result = await controller.findAndCountPlayers({ page: 1, max: 1000 });
			expect(result.count).toBeGreaterThan(0);
			expect(result.rows.length).toBeGreaterThan(0);

			const player = result.rows[0];
			expect(player.id).toBeGreaterThan(0);
			expect(player.token).toBeUndefined();
		});
	});
});
