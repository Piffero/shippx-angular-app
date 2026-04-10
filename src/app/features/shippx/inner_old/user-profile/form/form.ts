import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseAuthService } from '../../../../../core/services/supabase-auth.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'rd-user-profile-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form implements OnInit {
  private _route = inject(ActivatedRoute);
  private _auth = inject(SupabaseAuthService);
  private _supabase: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);

  // Estados
  profile = signal<any>(null);
  reviews = signal<any[]>([]);
  isEditing = signal(false);
  loading = signal(true);

  // Contexto
  loggedUser = this._auth.currentProfileValue;
  isMyProfile = computed(() => this.profile()?.id === this.loggedUser?.id);

  // Agrupamento de avaliações
  reviewStats = computed(() => {
    const revs = this.reviews();
    return {
      positive: revs.filter(r => r.sentiment === 'POSITIVE').length,
      neutral: revs.filter(r => r.sentiment === 'NEUTRAL').length,
      negative: revs.filter(r => r.sentiment === 'NEGATIVE').length,
      avg: revs.length > 0 ? (revs.reduce((acc, r) => acc + r.rating, 0) / revs.length).toFixed(1) : 5.0
    };
  });

  async ngOnInit() {
    const userId = this._route.snapshot.paramMap.get('id') || this.loggedUser?.id;
    if (userId) {
      await this.loadProfileData(userId);
    }
  }

  async loadProfileData(userId: string) {
    this.loading.set(true);

    const [pRes, rRes] = await Promise.all([
      this._supabase.from('user_profiles').select('*').eq('id', userId).single(),
      this._supabase.from('user_reviews').select('*, author: user_profiles(full_name, avatar_url)').eq('target_user_id', userId)
    ]);

    this.profile.set(pRes.data);
    this.reviews.set(rRes.data || []);
    this.loading.set(false);
  }

  async saveProfile() {
    const { error } = await this._supabase
      .from('user_profiles')
      .update(this.profile())
      .eq('id', this.profile().id);

    if (!error) this.isEditing.set(false);
  }
}
