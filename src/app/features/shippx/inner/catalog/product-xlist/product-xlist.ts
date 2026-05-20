import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../../core/models/shippx/product.model';

@Component({
  selector: 'rd-catalog-product-xlist',
  imports: [],
  templateUrl: './product-xlist.html',
  styleUrl: './product-xlist.css',
})
export class ProductXList {
  @Input({ required: true }) products!: Product[];
  @Input() viewOnly = false;
  @Output() addToCart = new EventEmitter<Product>();
}
