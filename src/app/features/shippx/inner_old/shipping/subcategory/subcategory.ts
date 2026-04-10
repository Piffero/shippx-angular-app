import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ShippingService } from '../../../../../core/services/shipping.service';
import { SHIPMENT_SUBCATEGORIES_MOCK } from '../../../../../core/models/shippx/shipment.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-subcategory',
  imports: [CommonModule],
  templateUrl: './subcategory.html',
  styleUrl: './subcategory.css',
})
export class Subcategory implements OnInit {
  private _shippingService = inject(ShippingService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  // Signal para a lista de subcategorias
  categoryId = signal<string>('');
  subCategories = signal<any[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const catId = this._route.snapshot.paramMap.get('catId') || '';
    this.categoryId.set(catId);
    this.loadSubCategories(catId);
  }

  async loadSubCategories(categoryId: string) {
    this.loading.set(true);
    const { data, error } = await this._shippingService.fetchShipmentSubCategories(categoryId);
    
    if (error) { this.errorMessage.set('Erro ao carregar categorias. Tente novamente mais tarde.'); }
    
    this.subCategories.set(data || SHIPMENT_SUBCATEGORIES_MOCK.filter(s => s.category_id === categoryId));
    this.loading.set(false);  
  }

  selectSubCategory(subCategoryId: string) {
    this._router.navigate(['/shippx/shipping/create', this.categoryId(), subCategoryId]);
  }

  goBack() {
    this._router.navigate(['/shippx/shipping']);
  }
}
