import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'rd-modal-intercept',
  imports: [CommonModule],
  templateUrl: './modal-intercept.html',
  styleUrl: './modal-intercept.css',
})
export class ModalIntercept {
  dialogRef = inject(DialogRef);
  private _router = inject(Router);

  navTo(path: string) {
    this.dialogRef.close();
    this._router.navigate([path]);
  }

  close() {
    this.dialogRef.close();
  }
}
