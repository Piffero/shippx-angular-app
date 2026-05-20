import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StockBadge } from '../stock-badge/stock-badge';
import { CurrencyBrlPipe } from '../../../../../shered/shippx/pipes/currency-brl.pipe';
import { Product } from '../../../../../core/models/shippx/product.model';


@Component({
  selector: 'rd-catalog-product-card',
  imports: [CommonModule, StockBadge, CurrencyBrlPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({ required: true }) product!: Product;
  @Input() viewOnly = false;
  @Output() addToCart = new EventEmitter<Product>();
}
