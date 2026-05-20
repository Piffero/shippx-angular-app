import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CteGenerator } from './cte-generator';

describe('CteGenerator', () => {
  let component: CteGenerator;
  let fixture: ComponentFixture<CteGenerator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CteGenerator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CteGenerator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
