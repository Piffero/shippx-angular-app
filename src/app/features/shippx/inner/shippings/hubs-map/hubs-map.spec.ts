import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubsMap } from './hubs-map';

describe('HubsMap', () => {
  let component: HubsMap;
  let fixture: ComponentFixture<HubsMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubsMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HubsMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
