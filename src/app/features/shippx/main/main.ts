import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../../shered/shippx/builds/header/header';

@Component({
  selector: 'rd-shippx-main',
  imports: [RouterOutlet, Header],
  templateUrl: './main.html',
  styleUrls: ['./../../../../styles/ship/styles.css', './main.css'],
  encapsulation: ViewEncapsulation.None
})
export class Main {}
