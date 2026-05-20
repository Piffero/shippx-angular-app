import { CommonModule } from '@angular/common';
import { switchMap, tap } from 'rxjs';
import { Component, DestroyRef, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { ProductsService } from '../../../../core/services/database/products.service';
import { ProfileService } from '../../../../core/services/database/profile.service';
import { Product } from '../../../../core/models/shippx/product.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductXList } from './product-xlist/product-xlist';
import { ProductCard } from './product-card/product-card';

@Component({
  selector: 'rd-catalog-main',
  imports: [CommonModule, ProductCard, ProductXList],
  template: `
  <div class="catalog-container p-4">
    
    <!-- Header Dinâmico -->
    <header class="mb-4 d-flex justify-content-between align-items-center">
        <div>
        <h2 class="fw-bold">
            @if (userType() === 'trade') { Explore o Mercado }
            @else if (userType() === 'carrier') { Oportunidades de Carga }
            @else { Gestão de Catálogo }
        </h2>
        <p class="text-muted">Produtos e lotes disponíveis em Florianópolis e região.</p>
        </div>
        
        @if (userType() === 'supplier') {
        <button class="btn btn-primary">+ Novo Produto</button>
        }
    </header>

    @if (loading()) {
        <div class="text-center p-5 text-primary">
            <div class="spinner-border" role="status"></div>
        </div>
    } @else {
        
        <!-- GRID PARA LOGISTA (TRADE) -->
        @if (userType() === 'trade' || userType() === 'supplier') {
        <div class="row g-4">
            @for (item of products(); track item.id) {
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <rd-catalog-product-card [product]="item" [viewOnly]="userType() === 'supplier'"></rd-catalog-product-card>
            </div>
            }
        </div>
        }

        <!-- LISTA PARA TRANSPORTADOR (CARRIER) -->
        @if (userType() === 'carrier') {
        <div class="row g-4">
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <rd-catalog-product-xlist [products]="products()" [viewOnly]="userType() === 'supplier'"></rd-catalog-product-xlist>
            </div>
        </div>

        <div class="card shadow-sm border-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                    <tr>
                        <th>Produto/Lote</th>
                        <th>Cervejaria</th>
                        <th>Volume Est.</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    @for (item of products(); track item.id) {
                        <tr>
                        <td><strong>{{ item.nome }}</strong></td>
                        <td>Cervejaria X (Distância 5km)</td>
                        <td>{{ item.estoque_aproximado }} {{ item.unidade }}</td>
                        <td><button class="btn btn-outline-primary btn-sm">Ver Rota</button></td>
                        </tr>
                    }
                    </tbody>
                </table>
            </div>
        </div>
        }
    }
  </div>
  `,
  styleUrls: ['./../../../../../styles/ship/styles.css'],
  encapsulation: ViewEncapsulation.None
})
export class CatalogComponent implements OnInit{
    private _profileService = inject(ProfileService);
    private _productsService = inject(ProductsService);
    private _destroyRef = inject(DestroyRef); // Para limpar a assinatura automaticamente

    // Estados Reativos
    userType = signal<'supplier' | 'trade' | 'carrier' | null>(null);
    products = signal<Product[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.loadInitialData();
    }

    private loadInitialData() {
        const $this = this;
        // Identifica o tipo de conta
        this._profileService.getProfile().pipe(
            // takeUntilDestroyed garante que se o usuário sair do catálogo, a requisição pare
            takeUntilDestroyed($this._destroyRef),
            tap(profile => $this.userType.set(profile.type_account as 'supplier' | 'trade' | 'carrier' | null)),
            switchMap(profile => {
                if (profile.type_account === 'supplier') {
                    return $this._productsService.listProductsByBrewery(profile.id);
                } else {
                    return $this._productsService.listActiveProducts();
                }
            })
        ).subscribe({
            next: (prods) => {
                $this.products.set(prods);
                $this.loading.set(false);
            },
            error: (err) => {
                console.error('Erro no fluxo do catálogo:', err);
                $this.loading.set(false);
            }
        });
    }
}