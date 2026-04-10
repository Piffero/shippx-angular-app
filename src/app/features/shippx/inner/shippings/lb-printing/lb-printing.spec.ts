import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LbPrinting } from './lb-printing';

describe('LbPrinting', () => {
  let component: LbPrinting;
  let fixture: ComponentFixture<LbPrinting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LbPrinting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LbPrinting);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
