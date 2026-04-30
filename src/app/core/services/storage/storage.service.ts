import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _client = inject(SupabaseService).client;

  /**
   * Helper para upload de arquivos (Útil para fotos de comprovantes no Hub)
   */
  async uploadFile(bucket: string, path: string, file: File) {
    return await this._client.storage.from(bucket).upload(path, file);
  }

  /**
   * Recupera a URL pública do arquivo para exibir no Dashboard
   * Se o bucket for privado, você usaria createSignedUrl
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = this._client.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
