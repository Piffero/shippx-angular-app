import { Component, signal } from '@angular/core';
import { Marketplace } from '../../../../../core/models/shered/marketplace.model';

@Component({
  selector: 'rd-setting-int',
  imports: [],
  templateUrl: './setting-int.html',
  styleUrl: './setting-int.css',
})
export class SettingInt {
  marketplaces = signal<Marketplace[]>([
    { id: 'shopee', name: 'Shopee', logo: 'assets/logos/shopee.png', connected: false, status: 'none' },
    { id: 'mercadolivre', name: 'Mercado Livre', logo: 'assets/logos/ml.png', connected: true, status: 'active' },
    { id: 'shein', name: 'Shein', logo: 'assets/logos/shein.png', connected: false, status: 'none' }
  ]);

  connect(marketplaceId: string) {
    console.log(`Iniciando OAuth ou abertura de modal para: ${marketplaceId}`);
    // Aqui chamaremos o serviço que abre o popup do marketplace
  }

  disconnect(marketplaceId: string) {
    // alterar isso por um modal mais amigavel
    if(confirm('Tem certeza que deseja remover esta integração? Os novos pedidos não serão mais sincronizados.')) {
      // Lógica para deletar as chaves no Supabase
    }
  }
}
