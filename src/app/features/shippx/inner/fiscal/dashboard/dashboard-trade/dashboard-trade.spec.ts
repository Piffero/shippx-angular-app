import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTrade } from './dashboard-trade';

describe('DashboardTrade', () => {
  let component: DashboardTrade;
  let fixture: ComponentFixture<DashboardTrade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTrade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTrade);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
