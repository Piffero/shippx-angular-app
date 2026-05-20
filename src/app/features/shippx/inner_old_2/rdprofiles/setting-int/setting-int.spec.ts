import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingInt } from './setting-int';

describe('SettingInt', () => {
  let component: SettingInt;
  let fixture: ComponentFixture<SettingInt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingInt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingInt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
