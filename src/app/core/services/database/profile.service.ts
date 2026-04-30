import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { Profile } from '../../models/shippx/profile.model';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _supabase = inject(SupabaseService);
  private readonly TABLE = 'profiles';

  /**
   * Obtém o perfil do usuário logado.
   * A RLS garante que o SELECT retorne apenas o registro do próprio usuário.
   */
  getProfile(): Observable<Profile> {
    const userId = this._supabase.userUID;
    if (!userId) { throw new Error('Usuário não autenticado'); }
    
    return from(
      this._supabase.client
          .from(this.TABLE)
          .select('*')
          .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return data as Profile;
      })
    );
  }

  async updateProfile(profile: Partial<Profile>) {
    const userId = this._supabase.userUID;
    if (!userId) { throw new Error('Usuário não autenticado'); }

    return await this._supabase.client
      .from(this.TABLE)
      .update({ ...profile, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .single();
  }

  async getProfileByDocument(document: string) {
    return await this._supabase.client
      .from(this.TABLE)
      .select('full_name, type_account, city')
      .eq('document', document)
      .single();
  }

  getOrganizationMembers(orgId: string): Observable<Profile[]> {
    return from(
      this._supabase.client
        .from(this.TABLE)
        .select('*')
        .eq('organization_id', orgId)
    ).pipe(
      map(({ data, error }) => {
        if (error) return [];
        return data as Profile[];
      })
    );
  }
}
