import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Order } from '../../../../../core/models/shippx/order.model';
import { OrdersService } from '../../../../../core/services/database/orders.service';

@Component({
  selector: 'rd-delivery-tracking',
  imports: [CommonModule, RouterModule],
  templateUrl: './tracking.html',
  styleUrl: './tracking.css',
})
export class Tracking implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _oService = inject(OrdersService);

  orderId = signal<string | null>(null);
  order = signal<Order | null>(null);
  errorMessage = signal<string | null>(null);
  loading = signal(true);

  async ngOnInit() {
    this.orderId.set(this._route.snapshot.paramMap.get('orderId'));
    if (this.orderId()) {
      await this.loadDeliveryDetails();
    }
  }

  private async loadDeliveryDetails() {
    this.loading.set(true);
    try {
      // Busca os detalhes do pedido e da cervejaria (origem)
      const data = await this._oService.getOrderById(this.orderId()!);
      this.order.set(data);
    } catch (error) {
      this.errorMessage.set('Erro ao carregar detalhes: ' + (error instanceof Error ? error.message : 'Desconecido'));
      this._router.navigate(['/delivery/opportunities']);
    } finally {
      this.loading.set(false);
    }
  }

  // Atalho para abrir o GPS externo com o endereço de destino
  openInMaps(address: string) {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  }
}
