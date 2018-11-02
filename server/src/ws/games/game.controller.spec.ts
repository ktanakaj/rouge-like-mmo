/**
 * @file game.controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import { BadRequestError } from '../../core/errors';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameController', () => {
	let module: TestingModule;
	let controller: GameController;

	before(async () => {
		module = await testHelper.createTestingModule({
			controllers: [GameController],
			providers: [GameService],
		}).compile();
		controller = module.get<GameController>(GameController);
	});

	describe('#activate()', () => {
		it('成功', async () => {
		});
	});

	describe('#deactivate()', () => {
		it('成功', async () => {
		});
	});

	describe('#getStatus()', () => {
		it('成功', async () => {
		});
	});

	describe('#getFloor()', () => {
		it('成功', async () => {
		});
	});
});
