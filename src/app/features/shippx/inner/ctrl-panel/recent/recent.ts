import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingService } from '../../../../../core/services/shipping.service';

@Component({
  selector: 'rd-ctrl-panel-recent',
  imports: [CommonModule],
  templateUrl: './recent.html',
  styleUrl: './recent.css',
})
export class Recent implements OnInit {
  private _shippingService = inject(ShippingService);

  shipments = signal<any[]>([]);
  loading = signal(true);

  // Signals computados para os Cards de Status
  totalActive = computed(() => 
    this.shipments().filter(s => s.status === 'PUBLISHED' || s.status === 'IN_TRANSIT').length
  );
  
  totalDelivered = computed(() => 
    this.shipments().filter(s => s.status === 'DELIVERED').length
  );

  totalDrafts = computed(() => 
    this.shipments().filter(s => s.status === 'AWAITING_AUTH' || s.status === 'DRAFT').length
  );

  async ngOnInit() {
    await this.loadShipments();
  }

  async loadShipments() {
    this.loading.set(true);
    const { data, error } = await this._shippingService.getMyShipments();
    
    if (!error && data) {
      this.shipments.set(data);
    }
    this.loading.set(false);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'PUBLISHED': 'bg-primary-subtle text-primary',
      'IN_TRANSIT': 'bg-info-subtle text-info',
      'DELIVERED': 'bg-success-subtle text-success',
      'AWAITING_AUTH': 'bg-warning-subtle text-warning',
      'DRAFT': 'bg-secondary-subtle text-secondary'
    };
    return map[status] || 'bg-light text-dark';
  }

  getStatusAction(status: string): string {
    const map: Record<string, string> = {
      'PUBLISHED': 'fa-eye',
      'IN_TRANSIT': 'fa-eye',
      'DELIVERED': 'fa-eye',
      'AWAITING_AUTH': 'fa-pencil-square-o',
      'DRAFT': 'fa-pencil-square-o'
    };
    return map[status] || 'disabled';
  }
}
