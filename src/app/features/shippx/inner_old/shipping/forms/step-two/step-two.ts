import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShippingService } from '../../../../../../core/services/shipping.service'
import { SupabaseAuthService } from '../../../../../../core/services/supabase-auth.service';
import { ModalIntercept } from '../../../../../../shered/shippx/builds/modal-intercept/modal-intercept';

@Component({
  selector: 'rd-shipping-step-two',
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  templateUrl: './step-two.html',
  styleUrl: './step-two.css',
})
export class StepTwo implements OnInit {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _dialog = inject(Dialog);
  private _shippingService = inject(ShippingService);
  private _supabaseAuthService = inject(SupabaseAuthService);

  // Recupera o rascunho salvo no passo 1
  draftData = this._shippingService.currentShipment();
  loading = signal(false);

  confirmForm = this._fb.group({
    shipment_title: ['', Validators.required],
    pickup_date: ['', Validators.required],
    delivery_date: ['', Validators.required],
    transport_type: ['OPEN', Validators.required],
    special_instructions: [''],
    reference_type: ['OTHER'],
    reference_code: ['']
  });

  ngOnInit() {
    if (!this.draftData) {
      this._router.navigate(['/shippx/shipping']);
      return;
    }
  }

  async onCreateShipment() {
    if (this.confirmForm.invalid) return;
     this.loading.set(true);

    // Mescla o rascunho com os detalhes finais
    const shippxDetails = {
      items_count: this.draftData.items_count,
      dimensions: this.draftData.shippx_details.dimensions,
      is_palletized: this.draftData.shippx_details.is_palletized,
      is_stackable: this.draftData.shippx_details.is_stackable,
      is_crated: this.draftData.shippx_details.is_crated,
      // Movemos as localizações para dentro do detalhamento técnico (JSONB)
      pickup_location: this.draftData.pickup_location,
      delivery_location: this.draftData.delivery_location
    };

    const senderDetails = {
      pickup_date: this.confirmForm.value.pickup_date,
      delivery_date: this.confirmForm.value.delivery_date,
      transport_type: this.confirmForm.value.transport_type,
      special_instructions: this.confirmForm.value.special_instructions,
      reference_type: this.confirmForm.value.reference_type,
      reference_code: this.confirmForm.value.reference_code,
    };

    if (!this._supabaseAuthService.isLoggedInValue) {
      // USUÁRIO DESLOGADO: Salva como rascunho com Token
      const tempToken = crypto.randomUUID(); // Gera um ID único.
      
      const guestPayload = {
        title: this.confirmForm.value.shipment_title,
        category_id: this.draftData.category_id,
        subcategory_id: this.draftData.subcategory_id,
        status: 'AWAITING_AUTH',
        temp_token: tempToken,
        shippx_details: shippxDetails,
        sender_details: senderDetails,
        sender: this.draftData.sender,
        receiver: this.draftData.receiver
      };

      const { data, error } = await this._shippingService.saveShipment(guestPayload);
      this.loading.set(false);

      if (!error) {
        localStorage.setItem('shippx_temp_token', tempToken);
        this._dialog.open(ModalIntercept, {
          minWidth: '320px',
          maxWidth: '500px',
          // Estilização do backdrop (fundo escuro)
          backdropClass: 'cdk-overlay-dark-backdrop',
          disableClose: true // Obriga a interagir com o modal
        }); // abre o modal
      }

      return;
    }
    
    const finalPayload = {
      title: this.confirmForm.value.shipment_title,
      category_id: this.draftData.category_id,
      subcategory_id: this.draftData.subcategory_id,
      status: 'PUBLISHED',
      temp_token: null, // Logado não usa token
      shippx_details: shippxDetails,
      sender_details: senderDetails,
      sender: this.draftData.sender,
      receiver: this.draftData.receiver,
      user_id: this._supabaseAuthService.currentUserValue?.id // Garante o vínculo imediato
    };
    
    const { data, error } = await this._shippingService.saveShipment(finalPayload);
    this.loading.set(false);

    if (!error) {
      this._shippingService.clearDraftShipment();
      this._router.navigate(['/shippx/shipping/success']);
    }
    
  }
}
