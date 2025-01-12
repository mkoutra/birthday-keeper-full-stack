import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef } from '@angular/core';

import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

import { ErrorResponse } from '../../../shared/interfaces/error-response';
import { NgIf } from '@angular/common';
import { UserService } from '../../../shared/services/user.service';
import { InsertUser } from '../../../shared/interfaces/insert-user';

@Component({
  selector: 'app-add-user',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule,
            MatButtonModule,
            MatFormFieldModule,
            MatInputModule,
            MatTooltipModule,
            MatDatepickerModule,
            MatSelectModule,
            NgIf],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserComponent {
  userService = inject(UserService)
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);  // Used to notify Angular of the changes in the variables

  successfulInsertion: boolean = false;
  userAlreadyExists: boolean = false;
  insertedUsername: string = 'John Doe';

  roles: string[] = ['USER', 'ADMIN'];
  passwordRegex: RegExp = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%&.+*]).{8,}$/;

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]),
    role: new FormControl('USER', Validators.required)
  })

  onSubmit() {
    const userToInsert: InsertUser = {
      username: this.form.get('username')?.value?.trim() || '',
      password: this.form.get('password')?.value?.trim() || '',
      role: this.form.get('role')?.value?.trim() || 'USER',
    };
    
    console.log("User sent to backend: ", userToInsert);
    
    this.userService.registerUser(userToInsert).subscribe({
      next: (response) => {
        console.log("Response from backend: ", response)
        this.successfulInsertion = true;
        this.insertedUsername = response.username;
        this.userAlreadyExists = false;

        this.cdr.detectChanges(); // notifying Angular of the changes
      },
      error: (error) => {
        console.log('Error from Backend', error)
        const errorResponse = error.error as ErrorResponse;
        console.log('Error response', errorResponse);

        this.userAlreadyExists = true;
        this.successfulInsertion = false;
        this.insertedUsername = userToInsert.username;

        this.cdr.detectChanges(); // notifying Angular of the changes
      }
    });
  }

  goBackToMain() {
      this.form.reset();
      this.router.navigate(['users']);
  }
}
