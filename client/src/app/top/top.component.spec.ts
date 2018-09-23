/**
 * トップページコンポーネントのテスト。
 * @module ./app/top/top.component.spec
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { TopComponent } from './top.component';

describe('TopComponent', () => {
	let component: TopComponent;
	let fixture: ComponentFixture<TopComponent>;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [TopComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TopComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
