import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'rd-authflow-main',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./../../../../../styles/ship/styles.css'],
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent {}