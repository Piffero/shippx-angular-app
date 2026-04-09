import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'rd-admin-main',
  imports: [RouterOutlet],
  templateUrl: './main.html',
  styleUrls: ['./../../../../styles/adm/styles.css', './main.css'],
  encapsulation: ViewEncapsulation.None
})
export class Main {}
