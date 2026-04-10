import { Component, signal, inject, OnInit } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../../../environments/environment';
import { SupabaseAuthService } from '../../../../../core/services/supabase-auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'rd-user-profile-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  private _supabase: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);
  private _auth = inject(SupabaseAuthService);

  messageEvent = signal('');
  messageCss = signal('');

  saving = signal(false);
  details: any = {
    compay_description: '',
    dot_number: '',
    mc_number: '',
    fleet_info: { total_vehicles: 0, types: [] },
    operationg_areas: []
  };

  async ngOnInit() {
    await this.loadExistingDetails();
  }

  async loadExistingDetails() {
    const user = this._auth.currentProfileValue;
    if (!user) return;

    const { data, error } = await this._supabase
      .from('user_profile_details')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (data) this.details = data;
  }

  async saveDetails() {
    this.saving.set(true);
    const user = this._auth.currentProfileValue;
    const { error } = await this._supabase
      .from('user_profile_details')
      .upsert({
        user_id: user?.id,
        ...this.details,
        updated_at: new Date()
      });
    
    if (error) {
      console.error('Erro ao salvar:', error);
      this.messageCss.set('alert-danger');
      this.messageEvent.set('Erro ao atualizar dados profissionais.');
    } else {
      this.messageCss.set('alert-success');
      this.messageEvent.set('Perfil atualizado com sucesso!');
    }
    this.saving.set(false);
  }
}
