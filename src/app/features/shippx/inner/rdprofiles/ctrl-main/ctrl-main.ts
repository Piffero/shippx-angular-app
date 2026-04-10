import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../../core/services/authflow/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SettingInt } from "../setting-int/setting-int";
import { SettingHub } from '../setting-hub/setting-hub';
import { SettingVeh } from '../setting-veh/setting-veh';

@Component({
  selector: 'rd-profile-ctrl-main',
  imports: [SettingInt, SettingHub, SettingVeh],
  templateUrl: './ctrl-main.html',
  styleUrl: './ctrl-main.css',
})
export class CtrlMain {
  private _auth = inject(AuthService);

  activeTab = signal<string>('');
  profile = toSignal(this._auth.userProfile$);
  selectedRole = signal<'status' | 'packages' | 'invoices' | 'settings'>('status');

  setRole(role: 'status' | 'packages' | 'invoices' | 'settings') {
    this.activeTab.set(role);
  }
}
