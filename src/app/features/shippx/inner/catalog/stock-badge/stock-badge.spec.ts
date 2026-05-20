import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBadge } from './stock-badge';

describe('StockBadge', () => {
  let component: StockBadge;
  let fixture: ComponentFixture<StockBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
