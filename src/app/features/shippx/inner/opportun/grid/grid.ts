import { Component, inject, signal } from '@angular/core';
import { CarrierService } from '../../../../../core/services/shippings/carrier.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rd-opportun-grid',
  imports: [CommonModule],
  templateUrl: './grid.html',
  styleUrl: './grid.css',
})
export class Grid {
  private carrier = inject(CarrierService);
  
  opportunities = signal<any[]>([]);
  myVehicle = signal<any>(null);
  isLoading = signal<boolean>(true);

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      // Busca simultânea: Veículo do motorista e oportunidades no mapa
      const [vehicle, ops] = await Promise.all([
        this.carrier.getMyVehicle(),
        this.carrier.getAvailableOpportunities()
      ]);

      this.myVehicle.set(vehicle);
      this.opportunities.set(ops);
    } catch (err) {
      console.error('Erro ao carregar oportunidades', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  acceptRoute(opportunity: any) {
    // Lógica para reservar a coleta e navegar para o modo viagem
    console.log('Rota aceita para o Hub:', opportunity.hub.name);
  }
}
