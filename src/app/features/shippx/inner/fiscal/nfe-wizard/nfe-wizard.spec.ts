import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NfeWizard } from './nfe-wizard';

describe('NfeWizard', () => {
  let component: NfeWizard;
  let fixture: ComponentFixture<NfeWizard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NfeWizard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NfeWizard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
