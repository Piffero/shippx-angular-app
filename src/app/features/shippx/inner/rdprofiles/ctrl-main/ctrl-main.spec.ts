import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtrlMain } from './ctrl-main';

describe('CtrlMain', () => {
  let component: CtrlMain;
  let fixture: ComponentFixture<CtrlMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtrlMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtrlMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
