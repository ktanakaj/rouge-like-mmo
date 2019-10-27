/**
 * @file game.controller.tsのテスト。
 */
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../../test-helper';
import { BadRequestError } from '../../../core/errors';
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
			await controller.getFloor({}, {} as any);
		});
	});
});
