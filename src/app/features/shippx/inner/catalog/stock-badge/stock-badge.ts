import { Component, computed, Input } from '@angular/core';

@Component({
  selector: 'rd-catalog-stock-badge',
  imports: [],
  templateUrl: './stock-badge.html',
  styleUrl: './stock-badge.css',
})
export class StockBadge {
  @Input({ required: true }) quantity: number = 0;

  text = computed(() => {
    if (this.quantity <= 0) return 'Esgotado';
    if (this.quantity < 10) return 'Estoque Baixo';
    return 'Em Estoque';
  });

  badgeClass = computed(() => {
    const base = 'px-2 py-1 shadow-sm ';
    if (this.quantity <= 0) return base + 'bg-danger';
    if (this.quantity < 10) return base + 'bg-warning text-dark';
    return base + 'bg-success';
  });
  
}
