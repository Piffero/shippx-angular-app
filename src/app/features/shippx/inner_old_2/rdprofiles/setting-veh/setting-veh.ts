import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CarrierService } from '../../../../../core/services/shippings/carrier.service';

@Component({
  selector: 'rd-setting-veh',
  imports: [ReactiveFormsModule],
  templateUrl: './setting-veh.html',
  styleUrl: './setting-veh.css',
})
export class SettingVeh {
  private fb = inject(FormBuilder);
  private carrierService = inject(CarrierService);

  vehicleForm!: FormGroup;

  vehicleTypes = [
    { id: 'motorcycle', label: 'Moto', icon: 'bi-bicycle', cap: 15 },
    { id: 'car', label: 'Carro / Sedan', icon: 'bi-car-front', cap: 40 },
    { id: 'van', label: 'Van / Fiorino', icon: 'bi-truck-flatbed', cap: 120 },
    { id: 'truck', label: 'Caminhão', icon: 'bi-truck', cap: 500 }
  ];

  constructor() {
    this.vehicleForm = this.fb.group({
      type: ['car', Validators.required],
      model: ['', [Validators.required, Validators.minLength(2)]],
      license_plate: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/)]], // Padrão Mercosul
      capacity_volume: [40, [Validators.required, Validators.min(1)]]
    });
  }

  // Ajusta a capacidade sugerida ao trocar o tipo de veículo
  onTypeChange(typeId: string) {
    const suggestion = this.vehicleTypes.find(t => t.id === typeId)?.cap;
    this.vehicleForm.patchValue({ capacity_volume: suggestion });
  }

  async saveVehicle() {
    if (this.vehicleForm.valid) {
      try {
        await this.carrierService.updateVehicleProfile(this.vehicleForm.value);
        alert('Veículo cadastrado com sucesso! Você já pode visualizar rotas compatíveis.');
      } catch (err) {
        alert('Erro ao salvar dados do veículo.');
      }
    }
  }
}
