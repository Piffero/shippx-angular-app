import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIntercept } from './modal-intercept';

describe('ModalIntercept', () => {
  let component: ModalIntercept;
  let fixture: ComponentFixture<ModalIntercept>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalIntercept]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalIntercept);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
