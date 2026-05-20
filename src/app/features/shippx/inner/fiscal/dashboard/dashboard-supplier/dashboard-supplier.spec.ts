import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSupplier } from './dashboard-supplier';

describe('DashboardSupplier', () => {
  let component: DashboardSupplier;
  let fixture: ComponentFixture<DashboardSupplier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSupplier]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSupplier);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
