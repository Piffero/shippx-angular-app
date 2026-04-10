import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingHub } from './setting-hub';

describe('SettingHub', () => {
  let component: SettingHub;
  let fixture: ComponentFixture<SettingHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingHub]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingHub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
