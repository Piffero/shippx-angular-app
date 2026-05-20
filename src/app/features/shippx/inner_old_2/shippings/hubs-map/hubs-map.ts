import { Component, OnInit, inject } from '@angular/core';
import * as L from 'leaflet';
import { HubService } from '../../../../../core/services/shippings/hub.service';

@Component({
  selector: 'rd-shippings-hubs-map',
  imports: [],
  templateUrl: './hubs-map.html',
  styleUrl: './hubs-map.css',
})
export class HubsMap implements OnInit {
  private _hub = inject(HubService);
  private _map!: L.Map;

  async ngOnInit() {
    this.initMap();
    await this.loadHubsMarkers();
  }

  private initMap() {
    // Inicializa o mapa centralizado no Brasil (ou pegando a MY_LOCATION se disponível)
    this._map = L.map('map', {
      center: [-23.5505, -46.6333], // Exemplo: São Paulo
      zoom: 12
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this._map);

    this.setupLocationSync();
  }

  private async loadHubsMarkers() {
    try {
      const hubs = await this._hub.getAllHubs();
      
      hubs.forEach(hub => {
        if (hub.latitude && hub.longitude) {
          const marker = L.marker([hub.latitude, hub.longitude]).addTo(this._map);
          
          // Popup com informações do posto e botão de ação
          marker.bindPopup(`
            <div style="font-family: sans-serif;">
              <h6 style="margin:0 0 5px 0;">${hub.name}</h6>
              <p style="font-size: 12px; color: #666; margin-bottom: 8px;">${hub.address}</p>
              <button onclick="window.dispatchEvent(new CustomEvent('selectHub', {detail: '${hub.id}'}))" 
                      style="background: #0d6efd; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; width: 100%;">
                Postar aqui
              </button>
            </div>
          `);
        }
      });
    } catch (err) {
      console.error('Erro ao carregar marcadores no mapa', err);
    }
  }

  private setupLocationSync(): void {
    // Configura o Leaflet para buscar a posição
    this._map.locate({ 
      setView: true,      // Faz o mapa "pular" para onde o usuário está
      maxZoom: 15, 
      enableHighAccuracy: true 
    });

    // Evento disparado quando a localização é encontrada
    this._map.on('locationfound', (e) => {
      const radius = e.accuracy;

      // Marcador do Usuário
      L.marker(e.latlng)
        .addTo(this._map)
        .bindPopup("Você está aqui!")
        .openPopup();

      // Círculo de precisão (Usando o padrão novo sem deprecation)
      L.circle(e.latlng, { 
        radius: radius,
        color: '#0d6efd',
        fillColor: '#0d6efd',
        fillOpacity: 0.15 
      }).addTo(this._map);
    });

    // Caso o usuário negue ou dê erro
    this._map.on('locationerror', (e) => {
      console.warn("Localização negada ou indisponível. Usando centro padrão.");
      this._map.setView([-23.5505, -46.6333], 12); // Fallback para SP ou sua cidade base
    });
  }

}
