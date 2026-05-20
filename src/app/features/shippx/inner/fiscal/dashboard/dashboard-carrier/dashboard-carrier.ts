import { Component, inject, OnInit, signal } from '@angular/core';
import { DeliveryService } from '../../../../../../core/services/database/delivery.service';
import { Order } from '../../../../../../core/models/shippx/order.model';
import { CommonModule } from '@angular/common';
import { CteGenerator } from "../../cte-generator/cte-generator";

@Component({
  selector: 'rd-fiscal-dashboard-carrier',
  imports: [CommonModule, CteGenerator],
  templateUrl: './dashboard-carrier.html',
  styleUrl: './dashboard-carrier.css',
})
export class DashboardCarrier implements OnInit {

  private _dService = inject(DeliveryService);

  // Carga ativa rodando na rua
  activeDelivery = signal<Order | null>(null);

  // Histórico de fretes fechados para prestação de contas
  pastDeliveries = signal<Order[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  showCteGenerator = signal<boolean>(false);

  ngOnInit() {
    this.loadCarrierFiscalData();
  }

  showFiscalBarcode(chave: string) {
    if (!chave) return;
    // Abre visualização focada no código de barras da chave para leitura rápida pelo fiscal de trânsito
    window.open(`https://www.danfeonline.com.br/?chave=${chave}`, '_blank');
  }

  openCteGeneratorForOrder() {
    this.showCteGenerator.set(true);
  }

  async loadCarrierFiscalData() {
    this.loading.set(true);
    try {
      // Busca a entrega atual em trânsito executada por este motorista
      const active: any = await this._dService.getMyActiveDelivery();
      this.activeDelivery.set(active);

      // Busca histórico recente de entregas concluídas
      const past: any = await this._dService.getMyPastDeliveries();
      this.pastDeliveries.set(past.slice(0, 10));
    } catch (error) {
      this.errorMessage.set('Erro ao carregar dados fiscais: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      this.loading.set(false);
    }
  }

  async handleCteGenerated(cteKey: string) {
    const currentOrder = this.activeDelivery();
    if (!currentOrder) return;

    try {
      // Salva a chave do CT-e gerado na tabela de controle de fretes (deliveries)
      // vinculando-o à viagem atual do motorista
      await this._dService.updateDeliveryCte(currentOrder.id!, cteKey);
      
      // Fecha o gerador após o sucesso
      setTimeout(() => {
        this.showCteGenerator.set(false);
        this.loadCarrierFiscalData(); // Atualiza a tela de bordo
      }, 1500);

    } catch (error) {
      console.error('Erro ao vincular CT-e:', error);
    }
  }
}
