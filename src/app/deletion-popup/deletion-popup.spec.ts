import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletionPopup } from './deletion-popup';

describe('DeletionPopup', () => {
  let component: DeletionPopup;
  let fixture: ComponentFixture<DeletionPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletionPopup],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletionPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
