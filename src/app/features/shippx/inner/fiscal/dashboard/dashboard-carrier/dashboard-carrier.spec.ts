import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCarrier } from './dashboard-carrier';

describe('DashboardCarrier', () => {
  let component: DashboardCarrier;
  let fixture: ComponentFixture<DashboardCarrier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCarrier]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCarrier);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
