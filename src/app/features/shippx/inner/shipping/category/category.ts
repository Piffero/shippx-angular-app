import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ShippingService } from '../../../../../core/services/shipping.service';
import { SHIPMENT_CATEGORIES_MOCK, ShipmentCategory } from '../../../../../core/models/shippx/shipment.model';
import { Router } from '@angular/router';

@Component({
  selector: 'rd-shipping-category',
  imports: [CommonModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {
  private _shippingService = inject(ShippingService);
  private _router = inject(Router);

  // Signal para a lista de categorias
  categories = signal<any[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCategories();
  }

  async loadCategories() {
    this.loading.set(true);
    const { data, error } = await this._shippingService.fetchShipmentCategories();

    if (error) { this.errorMessage.set('Erro ao carregar categorias. Tente novamente mais tarde.'); }
    
    this.categories.set(data || SHIPMENT_CATEGORIES_MOCK);
    this.loading.set(false);
  }

  selectCategory(id: number) {
    this._router.navigate(['/shippx/shipping/subcategory', id]);
  }
}
