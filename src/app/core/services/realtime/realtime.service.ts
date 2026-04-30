import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealtimeService {
  private _client = inject(SupabaseService).client;
  
  /**
   * Helper para Realtime
   * Escuta mudanças em uma tabela específica
   * Transforma o canal do Supabase em um Observable do Angular
   */
  getTableStream(table: string, event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*', orderId?: string): Observable<any> {
    return new Observable((observer) => {
      const channel = this._client
        .channel(`realtime:${table}`)
        .on(
          'postgres_changes',
          { event, schema: 'public', table: table, filter: orderId ? `id=eq.${orderId}` : undefined },
          (payload) => {
            observer.next(payload);
          }
        )
        .subscribe();

      // Cleanup: Quando o componente Angular for destruído, o canal fecha
      return () => {
        this._client.removeChannel(channel);
      };
    });
  }

}
