import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { HubService } from '../../../../../core/services/shippings/hub.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/authflow/auth.service';

@Component({
  selector: 'rd-setting-hub',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './setting-hub.html',
  styleUrl: './setting-hub.css',
})
export class SettingHub implements OnInit {
  private fb = inject(FormBuilder);
  private hub = inject(HubService);
  private _auth = inject(AuthService);

  hubForm!: FormGroup;
  private map!: L.Map;
  private marker!: L.Marker;

  constructor() {
    this.hubForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      open_time: ['08:00', Validators.required],
      close_time: ['18:00', Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required]
    });
  }

  async ngOnInit() {    
    await this.loadHubData();
  }

  async loadHubData() {
    const user = await this._auth.getUser();
    if (!user) return;

    const data = await this.hub.getHubByOwnerId(user.id);
    if (data) {
      // Preenche o formulário com os dados do banco
      this.hubForm.patchValue({
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        open_time: data.open_time,
        close_time: data.close_time,
        latitude: data.latitude,
        longitude: data.longitude
        // O status e updated_at não precisam ir no formulário, são automáticos
      });

      this.updateCoords(data.latitude, data.longitude);
      this.initMiniMap(data.latitude, data.longitude);
    }
    
  }

  private initMiniMap(lat: number = -23.5505, lng: number = -46.6333) {
    // Inicia o mapa num ponto neutro
    this.map = L.map('hub-mini-map').setView([lat, lng], 20);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    // Marcador arrastável para capturar coordenadas
    this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.updateCoords(position.lat, position.lng);
    });

    // Clique no mapa também move o marcador
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.marker.setLatLng(e.latlng);
      this.updateCoords(e.latlng.lat, e.latlng.lng);
    });
  }

  private updateCoords(lat: number, lng: number) {
    this.hubForm.patchValue({ latitude: lat, longitude: lng });
  }

  async saveHubSettings() {
    if (!this.hubForm.valid) {
      try {
        await this.hub.updateHubProfile(this.hubForm.value);
        alert('Configurações do Ponto ShippX atualizadas!');
      } catch (err: any) {
        alert('Erro ao salvar configurações.' + err.message);
      }
    }
  }
}
