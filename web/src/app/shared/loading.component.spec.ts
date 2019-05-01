/**
 * 読み込み中部品コンポーネントのテスト。
 * @module ./app/shared/loading.component.spec
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
	let component: LoadingComponent;
	let fixture: ComponentFixture<LoadingComponent>;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [LoadingComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoadingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
