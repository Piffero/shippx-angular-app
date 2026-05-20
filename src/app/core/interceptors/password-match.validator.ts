import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // Se os campos ainda não foram tocados ou se são iguais, retorna null (sem erro)
  if (!password || !confirmPassword || password.value === confirmPassword.value) {
    return null;
  }

  // Caso contrário, define o erro no campo confirmPassword
  confirmPassword.setErrors({ passwordMismatch: true });
  return { passwordMismatch: true };
};