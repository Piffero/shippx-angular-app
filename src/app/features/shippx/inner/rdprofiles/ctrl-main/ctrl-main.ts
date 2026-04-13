import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../../../core/services/authflow/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SettingInt } from "../setting-int/setting-int";
import { SettingHub } from '../setting-hub/setting-hub';
import { SettingVeh } from '../setting-veh/setting-veh';
import { StatusSummary } from '../status-summary/status-summary';
import { Invoices } from "../invoices/invoices";
import { Packages } from "../packages/packages";

@Component({
  selector: 'rd-profile-ctrl-main',
  imports: [SettingInt, SettingHub, SettingVeh, StatusSummary, Invoices, Packages],
  templateUrl: './ctrl-main.html',
  styleUrl: './ctrl-main.css',
})
export class CtrlMain {
  private _auth = inject(AuthService);

  selectedRole = signal<'status' | 'packages' | 'invoices' | 'settings'>('status');

  private _rawProfile = toSignal(this._auth.userProfile$, { initialValue: null });
  profile = computed(() => {
    const p = this._rawProfile();
    if (!p) return null;

    return {
      ...p,
      role: p.role as 'CLIENT' | 'BROKER' | 'CARRIER' | 'ADMIN'
    };
  });

  setRole(role: 'status' | 'packages' | 'invoices' | 'settings') {
    this.selectedRole.set(role);
  }
}
