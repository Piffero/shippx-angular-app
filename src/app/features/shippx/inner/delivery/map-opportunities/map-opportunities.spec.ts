import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapOpportunities } from './map-opportunities';

describe('MapOpportunities', () => {
  let component: MapOpportunities;
  let fixture: ComponentFixture<MapOpportunities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapOpportunities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapOpportunities);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
