import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ShippingService } from '../../../../../core/services/shipping.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-opportunity-grid',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './grid.html',
  styleUrl: './grid.css',
})
export class Grid implements OnInit {
  private _shippingService = inject(ShippingService);

  opportunities = signal<any[]>([]);
  loading = signal(true);
  expandedId = signal<string | null>(null); // Para o efeito de sanfona (accordion)

  categories = signal<any[]>([]); // Lista vinda do banco
  expandedFilters = signal<Record<string, boolean>>({ categories: true, weight: false });

  // Estado dos filtros selecionados
  selectedFilters = {
    categories: new Set<string>(),
    minWeight: null,
    maxWeight: null,
    location: '',
    startDate: null
  };

  async ngOnInit() {
    const [catRes, shipRes] = await Promise.all([
      this._shippingService.fetchShipmentCategories(), // Método simples: select('*').from('shipment_categories')
      this._shippingService.getAvailableOpportunities()
    ]);

    if (catRes.data) this.categories.set(catRes.data);
    if (shipRes.data) this.opportunities.set(shipRes.data);
    this.loading.set(false);
  }

  toggleExpand(key: string) {
    this.expandedFilters.update(prev => ({ ...prev, [key]: !prev[key] }));
  }

  async applyFilters() {
    this.loading.set(true);
    const { data } = await this._shippingService.getAvailableOpportunities({
      categories: Array.from(this.selectedFilters.categories),
      minWeight: this.selectedFilters.minWeight,
      maxWeight: this.selectedFilters.maxWeight,
      location: this.selectedFilters.location,
      startDate: this.selectedFilters.startDate
    });

    if (data) this.opportunities.set(data);
    this.loading.set(false);
  }

  onCategoryChange(categoryId: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedFilters.categories.add(categoryId);
    } else {
      this.selectedFilters.categories.delete(categoryId);
    }

    // Opcional: Aplicar o filtro automaticamente ao clicar no checkbox
    this.applyFilters(); 
  }

  // Método para limpar todos os filtros e resetar a lista
  async clearFilters() {
    // 1. Reseta o objeto de filtros para o estado inicial
    this.selectedFilters = {
      categories: new Set<string>(),
      minWeight: null,
      maxWeight: null,
      location: '',
      startDate: null // se você adicionou o filtro de data
    };

    // 2. Limpa visualmente os inputs (se não estiver usando [(ngModel)])
    // Se estiver usando ngModel, os campos já limparão sozinhos.

    // 3. Busca a lista completa novamente sem filtros
    this.loading.set(true);
    const { data, error } = await this._shippingService.getAvailableOpportunities();
    
    if (!error && data) {
      this.opportunities.set(data);
    }
    this.loading.set(false);

    // 4. (Opcional) Desmarca todos os checkboxes manualmente se necessário
    // ou use uma variável de controle no template para os checkboxes.
  }
}
