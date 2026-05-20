import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingVeh } from './setting-veh';

describe('SettingVeh', () => {
  let component: SettingVeh;
  let fixture: ComponentFixture<SettingVeh>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingVeh]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingVeh);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
