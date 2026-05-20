import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { ProfileService } from "../../../../core/services/database/profile.service";

@Component({
    selector: 'rd-fiscal-main',
    imports: [CommonModule, RouterOutlet],
    template: `<router-outlet></router-outlet>`,
})
export class FiscalComponent {
    private _profile = inject(ProfileService);
    private _router = inject(Router);

    ngOnInit() {
    this._profile.getProfile().subscribe(profile => {
      if (profile.type_account === 'supplier') this._router.navigate(['/fiscal/dashboard-supplier']);
      else if (profile.type_account === 'trade') this._router.navigate(['/fiscal/dashboard-trade']);
      else if (profile.type_account === 'carrier') this._router.navigate(['/fiscal/dashboard-carrier']);
    });
  }
}