import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { UserProfile } from '../../models/shered/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase = inject(SupabaseService).client;

  private _userProfile = new BehaviorSubject<UserProfile | null>(null);
  userProfile$ = this._userProfile.asObservable();

  constructor() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        this.fetchProfile(session.user.id);
      } else {
        this._userProfile.next(null);
      }
    });
  }

  async getUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  get isLoggedIn(): Observable<boolean> {
    return this.userProfile$.pipe(
      map(profile => !!profile)
    );
  }

  async signIn(email: string, password: string): Promise<{ data: any; error: any }> {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string, metadata: any): Promise<{ data: any; error: any }> {
    const { data, error } = await this.supabase.auth.signUp({
      email, password, options: { data: metadata }
    });
    if (error) throw error;
    return { data, error };
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

  private async fetchProfile(id: string) {
    const { data } = await this.supabase.from('user_profiles').select('*').eq('id', id).single();
    this._userProfile.next(data);
  }
}
