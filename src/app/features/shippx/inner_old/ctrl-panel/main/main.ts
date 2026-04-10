import { Component, inject, OnInit, signal } from '@angular/core';
import { SupabaseAuthService } from '../../../../../core/services/supabase-auth.service';
import { ShippingService } from '../../../../../core/services/shipping.service';
import { Recent } from '../recent/recent';

@Component({
  selector: 'rd-ctrl-panel-main',
  imports: [Recent],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main implements OnInit {
  private _auth = inject(SupabaseAuthService);
  private _shipping = inject(ShippingService);

  activeTab = signal<string>('');
  user = this._auth.currentUserValue;
  profile = this._auth.currentProfileValue;

  selectedRole: 'status' | 'shipments' | 'opportunities' | 'management' = 'status';

  async ngOnInit() {
    if (this.user && this.profile) {
      await this._shipping.reconcileMyShipments(this.user.id, this.profile.organization_id);
      this.loadPanelData();
    }
  }

  setTab(tabName: string) {
    this.activeTab.set(tabName);
  }

  loadPanelData() {
    
  }
}
