/**
 * @file game.controller.tsのテスト。
 */
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../../test-helper';
import { BadRequestError } from '../../../core/errors';
import Floor from '../../shared/floor.model';
import { floorManager } from '../../shared/floor-manager';
import { GameService } from '../../shared/game.service';
import { GameController } from './game.controller';

describe('ws/GameController', () => {
	let module: TestingModule;
	let controller: GameController;

	beforeAll(async () => {
		module = await testHelper.createTestingModule({
			controllers: [GameController],
			providers: [GameService],
		}).compile();
		controller = module.get<GameController>(GameController);
	});

	describe('#activate()', () => {
		it('成功', async () => {
			await controller.activate({}, {} as any);
		});
	});

	describe('#deactivate()', () => {
		it('成功', async () => {
			await controller.deactivate({}, {} as any);
		});
	});

	describe('#getStatus()', () => {
		it('成功', async () => {
			await controller.getStatus({}, {} as any);
		});
	});

	describe('#getFloor()', () => {
		it('成功', async () => {
			const floor = new Floor();
			floor.id = 100;
			floorManager.floors.set(floor.id, floor);
			floorManager.floorIdByPlayerId.set(10, floor.id);
			const result = await controller.getFloor({}, { session: { id: 10 } } as any);
			expect(result['id']).toBe(floor.id);
		});
	});
});
