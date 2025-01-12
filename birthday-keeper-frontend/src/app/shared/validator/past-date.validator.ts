// A validator that checks if the given date belongs to the past.

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function pastDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentDate = new Date();
    const inputDate = new Date(control.value);

    // Check if the input date is in the future
    return inputDate > currentDate ? { pastDate: true } : null;
  };
}