import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'rd-delivery-main',
    imports: [CommonModule, RouterOutlet],
    template: `<router-outlet></router-outlet>`,
})
export class DeliveryComponent {}