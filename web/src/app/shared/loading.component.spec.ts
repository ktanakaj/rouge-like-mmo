/**
 * 読み込み中部品コンポーネントのテスト。
 * @module ./app/shared/loading.component.spec
 */
import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import testHelper from '../../test-helper';

import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
	let fixture: ComponentFixture<LoadingComponent>;
	let element: DebugElement;

	beforeEach(fakeAsync(() => {
		testHelper.configureTestingModule({
			declarations: [LoadingComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(LoadingComponent);
		element = fixture.debugElement;
		fixture.detectChanges();
	}));

	it('should render loading', () => {
		expect(element.nativeElement.textContent).toEqual('LOADING');
	});
});
