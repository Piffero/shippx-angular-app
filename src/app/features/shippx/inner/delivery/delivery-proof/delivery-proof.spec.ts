import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryProof } from './delivery-proof';

describe('DeliveryProof', () => {
  let component: DeliveryProof;
  let fixture: ComponentFixture<DeliveryProof>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryProof]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryProof);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
