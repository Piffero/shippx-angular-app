import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusStepper } from './status-stepper';

describe('StatusStepper', () => {
  let component: StatusStepper;
  let fixture: ComponentFixture<StatusStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusStepper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusStepper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
