import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { OrdersService } from '../../../../../core/services/database/orders.service';
import { DeliveryService } from '../../../../../core/services/database/delivery.service';
import { Router } from '@angular/router';
import { Order } from '../../../../../core/models/shippx/order.model';

@Component({
  selector: 'rd-map-opportunities',
  imports: [CommonModule],
  templateUrl: './map-opportunities.html',
  styleUrl: './map-opportunities.css',
})
export class MapOpportunities implements OnInit {
  private _oService = inject(OrdersService);
  private _dService = inject(DeliveryService);
  private _router = inject(Router);

  // Signals para reatividade fluida
  availableOrders = signal<Order[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  isaccepting = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOpportunities();
  }

  async loadOpportunities() {
    this.loading.set(true);
    try {
      // Busca ordens com status 'aguardando_motorista'
      // O SupabaseService tratará a filtragem via query
      const data = await this._oService.listOrdersByStatus('aguardando_motorista');
      this.availableOrders.set(data);
    } catch (error) {
      console.error('Erro ao carregar oportunidades:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async acceptDelivery(orderId: string) {
    this.isaccepting.set(orderId);
    try {
      // Cria o registro em 'deliveries' e atualiza 'orders' para 'em_andamento'
      // Esta operação deve ser atômica ou via RPC no Supabase para evitar que dois motoristas aceitem o mesmo
      await this._dService.acceptOrder(orderId);
      
      // Redireciona para o tracking da entrega aceita
      this._router.navigate(['/delivery/tracking', orderId]);
    } catch (error) {
      this.errorMessage.set('Esta oportunidade não está mais disponível.');
      this.loadOpportunities();
    } finally {
      this.isaccepting.set(null);
    }
  }
}
