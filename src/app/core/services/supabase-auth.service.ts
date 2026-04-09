import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { UserProfile } from '../models/shered/user-profile.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthService {
  
  private supabase!: SupabaseClient;

  // Estado reativo do usuário
  private _currentUser = new BehaviorSubject<User | null>(null);
  private _userProfile = new BehaviorSubject<UserProfile | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.supabase.auth.onAuthStateChange((event, session) => {
      if(session?.user) {
        this._currentUser.next(session.user);
        this.fetchUserProfile(session.user.id);
      } else {
        this._currentUser.next(null);
        this._userProfile.next(null);
      }
    });
  }

  // Getters para os Observables
  get user$(): Observable<User | null> {
    return this._currentUser.asObservable();
  }

  get userProfile$(): Observable<UserProfile | null> {
    return this._userProfile.asObservable();
  }

  get isLoggedIn(): Observable<boolean> {
    return this._currentUser.pipe(map(user => !!user));
  }

  get isLoggedInValue(): boolean {
    return !!this._currentUser.value;
  }

  get currentUserValue(): User | null {
    return this._currentUser.value;
  }

  get currentProfileValue(): UserProfile | null {
    return this._userProfile.value;
  }

  // Métodos de Autenticação
  async signUp(email: string, password: string, metadata: any): Promise<{ data: any; error: any }> {
    const { data, error } = await this.supabase.auth.signUp({
      email, password, options: { data: metadata }
    });
    if (error) throw error;
    return { data, error };
  }

  async signIn(email: string, password: string): Promise<{ data: any; error: any }> {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  async resetPasswordForEmail(email: string): Promise<{ data: any; error: any }> {
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/shippx/forgot`
    });

    return { data, error };
  }

  async verifyOtp(email: string, token: string, type: 'recovery' | 'signup' | 'invite') {
    const { data, error } = await this.supabase.auth.verifyOtp({
      email,
      token,
      type
    });
    return { data, error };
  }

  async updateUserPassword(newPassword: string): Promise<{ data: any; error: any }> {
    const { data, error } = await this.supabase.auth.updateUser({ password: newPassword });
    return { data, error };
  }

  // Buscar dados estendidos do perfil no banco de dados (Tabela 'profiles')
  private async fetchUserProfile(userId: string): Promise<void> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

      if (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        this._userProfile.next(null);
      }

      this._userProfile.next(data as UserProfile);
  }

 
}
