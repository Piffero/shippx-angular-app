import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShippingService } from '../../../../../../core/services/shipping.service';
import { ShipmentSubcategory } from '../../../../../../core/models/shippx/shipment.model'

@Component({
  selector: 'rd-shipping-step-one',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-one.html',
  styleUrl: './step-one.css',
})
export class StepOne implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);
  private _shippingService = inject(ShippingService);

  // IDs capturados da rota
  catId = signal<string | null>(null);
  subId = signal<string | null>(null);

  shipmentForm = this._fb.group({
    items_count: [1, [Validators.required, Validators.min(1)]],
    // O grupo shippx_details será populado/validado pelo componente filho
    shippx_details: this._fb.group({
      name: ['', Validators.required],
      dimensions: this._fb.group({
        length: [null, Validators.required],
        width: [null, Validators.required],
        height: [null, Validators.required],
        weight: [null, Validators.required]
      }),
      value: [null],
      is_palletized: [false],
      is_stackable: [false],
      is_crated: [false]
    }),
    sender: this._fb.group({
      name: ['', Validators.required],
      contact_number: ['', Validators.required]
    }),
    receiver: this._fb.group({
      name: ['', Validators.required],
      contact_number: ['', Validators.required]
    }),
    pickup_location: this._fb.group({
      city: ['', Validators.required],
      addressType: ['RESIDENTIAL']
    }),
    delivery_location: this._fb.group({
      city: ['', Validators.required],
      addressType: ['RESIDENTIAL']
    })
  });

  ngOnInit(): void {
    this.catId.set(this._route.snapshot.paramMap.get('catId'));
    this.subId.set(this._route.snapshot.paramMap.get('subId'));
  }

  async onContinue() {
    if (this.shipmentForm.invalid) { this.shipmentForm.markAllAsTouched(); return; }

    const formData = this.shipmentForm.value;
    this._shippingService.saveDraftShipment({
      ...formData,
      category_id: this.catId(),
      subcategory_id: this.subId(),
      status: 'DRAFT'
    });

    this._router.navigate(['/shippx/shipping/confirm']);
  }
}
