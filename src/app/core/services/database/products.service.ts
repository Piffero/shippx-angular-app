import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { Product } from '../../models/shippx/product.model';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly TABLE = 'products';
  private _client = inject(SupabaseService).client;
  
  // LISTAR: Para o Bar ver todos os produtos ativos de todas as cervejarias
  // (A RLS pode restringir isso por cidade/região se você desejar no futuro)
  listActiveProducts(): Observable<Product[]> {
    return from(
      this._client
          .from(this.TABLE)
          .select('*')
          .eq('is_active', true)
          .order('nome', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) { throw error; }
        return data as Product[];
      })
    );
  }

  // LISTAR POR CERVEJARIA: Para a cervejaria gerenciar seu próprio estoque
  listProductsByBrewery(breweryId: string): Observable<Product[]> {
    return from(
      this._client
          .from(this.TABLE)
          .select('*')
          .eq('cervejaria_id', breweryId)
          .order('nome', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) { throw error; }
        return data as Product[];
      })
    );
  }

  // CRIAR: Adiciona um novo produto
  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const { data, error } = await this._client
      .from(this.TABLE)
      .insert(product)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar produto:', error);
      throw new Error('Não foi possível criar o produto.');
    }

    return data as Product;
  }

  // ATUALIZAR: Modifica dados do produto ou estoque
  async updateProduct(productId: string, updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<Product> {
    const { data, error } = await this._client
      .from(this.TABLE)
      .update(updates)
      .eq('id', productId)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar produto:', error);
      throw new Error('Não foi possível atualizar o produto.');
    }

    return data as Product;
  }

  // DELETAR: Remove o produto (ou você pode apenas setar ativo = false)
  async deleteProduct(productId: string): Promise<void> {
    const { error } = await this._client
      .from(this.TABLE)
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Erro ao deletar produto:', error);
      throw new Error('Não foi possível deletar o produto.');
    }
  }
}
