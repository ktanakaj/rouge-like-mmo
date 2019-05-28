/**
 * フッターコンポーネントのテスト。
 * @module ./app/layout/footer.component.spec
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
	let component: FooterComponent;
	let fixture: ComponentFixture<FooterComponent>;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [FooterComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FooterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
