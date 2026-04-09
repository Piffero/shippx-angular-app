import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'rd-shippx-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
})
export class Landing {
  // Categorias baseadas na Página 1 e 2 do PDF
  categories = [
    { id: 1, name: 'Artigos Domésticos', sub: 'Móveis, Eletros', icon: '/images/web/web_1670583556096.jpg', url: '/shippx/shipping/subcategory/cat_lar_02' },
    { id: 2, name: 'Equipamentos Pesados', sub: 'Fazenda, Construção', icon: '/images/web/web_1670584063536.jpg', url: '/shippx/shipping/subcategory/cat_fretes_04'},
    { id: 3, name: 'Veículos e Barcos', sub: 'Carros, Motos, Lanchas', icon: '/images/web/web_1670583498601.jpg', url: '/shippx/shipping/subcategory/cat_veiculos_01' },
    { id: 4, name: 'Mudanças', sub: 'Casas, Apartamentos', icon: '/images/web/web_1670583972555.jpg', url: '/shippx/shipping/subcategory/cat_mudancas_03' },
    { id: 5, name: 'Animais', sub: 'Cavalos, Pets', icon: '/images/web/web_1670584273336.jpg', url: '/shippx/shipping/subcategory/cat_animais_06' },
    { id: 6, name: 'Outras', sub: 'Cargas Diversas', icon: '/images/web/web_1670583476669.jpg', url: '/shippx/shipping/subcategory/cat_outros_07' }
  ];
}
