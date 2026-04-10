import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public client!: SupabaseClient;

  // Observable para expor o estado do usuário para o restante do app
  private _currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this._currentUser.asObservable();

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey);

    // Configura o listener de mudanças de autenticação automaticamente
    this.client.auth.onAuthStateChange((event, session) => {
      this._currentUser.next(session?.user ?? null);
    });
  }

  // Getter para facilitar o acesso rápido ao UID em qualquer serviço
  get userUID(): string | undefined {
    return this._currentUser.value?.id;
  }

  /**
   * Helper para upload de arquivos (Útil para fotos de comprovantes no Hub)
   */
  async uploadFile(bucket: string, path: string, file: File) {
    return await this.client.storage.from(bucket).upload(path, file);
  }

  /**
   * Helper para Realtime (Crucial para o PackageStatusComponent)
   * Escuta mudanças em uma tabela específica
   */
  subscribeToTable(table: string, callback: (payload: any) => void) {
    return this.client
      .channel(`public:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: table }, callback)
      .subscribe();
  }
}
