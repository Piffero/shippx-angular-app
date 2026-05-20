import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { OrdersService } from '../../../../../../core/services/database/orders.service';
import { Order } from '../../../../../../core/models/shippx/order.model';

@Component({
  selector: 'rd-fiscal-dashboard-trade',
  imports: [CommonModule],
  templateUrl: './dashboard-trade.html',
  styleUrl: './dashboard-trade.css',
})
export class DashboardTrade implements OnInit {
  private _oService = inject(OrdersService);

  // Signals de estado
  incomingInvoices = signal<Order[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  // KPIs de fechamento mensal
  totalPurchasedMonth = signal(0);
  pendingTaxManifests = signal(0);

  ngOnInit() {
    this.loadTradeFiscalData();
  }

  async loadTradeFiscalData() {
    this.loading.set(true);
    try {
      // Filtra os status onde a nota já existe no fluxo
      const fiscalStatuses: Order['status'][] = ['nf_emitida', 'aguardando_motorista', 'em_andamento', 'entregue'];

      // Busca ordens de compra vinculadas ao perfil do Bar logado
      const data = await this._oService.listMyPurchasesByStatus(fiscalStatuses);
      this.incomingInvoices.set(data);

      // Calcula KPIs locais
      this.totalPurchasedMonth.set(data.reduce((acc, o) => acc + (o.valor_total || 0), 0));
      this.pendingTaxManifests.set(data.filter((o: Order) => o.status === 'entregue' && !o.nf_e_chave).length); // Exemplo de pendência fiscal interna

    }  catch (error: any) {
      console.error('Erro ao carregar dados fiscais do comprador:', error);
      this.errorMessage.set('Erro ao carregar dados fiscais. Tente novamente mais tarde.' + error.message);
    } finally {
      this.loading.set(false);
    }
  }

  viewDanfe(chave: string) {
    if (!chave) return;
    // Abre o validador/visualizador da SEFAZ ou serviço parceiro
    window.open(`https://www.danfeonline.com.br/?chave=${chave}`, '_blank');
  }

}
