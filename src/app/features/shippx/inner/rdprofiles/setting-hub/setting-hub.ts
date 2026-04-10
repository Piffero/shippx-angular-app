import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { HubService } from '../../../../../core/services/shippings/hub.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rd-setting-hub',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './setting-hub.html',
  styleUrl: './setting-hub.css',
})
export class SettingHub implements OnInit {
  private fb = inject(FormBuilder);
  private hub = inject(HubService);

  hubForm!: FormGroup;
  private map!: L.Map;
  private marker!: L.Marker;

  constructor() {
    this.hubForm = this.fb.group({
      name: ['', Validators.required, Validators.minLength(3)],
      address: ['', Validators.required],
      open_time: ['08:00', Validators.required],
      close_time: ['18:00', Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.initMiniMap();
  }

  private initMiniMap() {
    // Inicia o mapa num ponto neutro
    this.map = L.map('hub-mini-map').setView([-23.5505, -46.6333], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    // Marcador arrastável para capturar coordenadas
    this.marker = L.marker([-23.5505, -46.6333], { draggable: true }).addTo(this.map);

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
    if (this.hubForm.valid) {
      try {
        await this.hub.updateHubProfile(this.hubForm.value);
        alert('Configurações do Ponto ShippX atualizadas!');
      } catch (err) {
        alert('Erro ao salvar configurações.');
      }
    }
  }
}
