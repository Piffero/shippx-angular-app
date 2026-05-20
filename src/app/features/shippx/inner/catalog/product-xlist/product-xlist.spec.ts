import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductXlist } from './product-xlist';

describe('ProductXlist', () => {
  let component: ProductXlist;
  let fixture: ComponentFixture<ProductXlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductXlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductXlist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
