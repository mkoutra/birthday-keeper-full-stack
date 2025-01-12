import { Component, inject } from '@angular/core';

import { FormGroup, FormControl, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { NgIf } from '@angular/common';
import { InsertUser } from '../../shared/interfaces/insert-user';
import { UserService } from '../../shared/services/user.service';
import { Router, RouterLink } from '@angular/router';
import { ErrorResponse } from '../../shared/interfaces/error-response';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [ReactiveFormsModule,
            MatButtonModule,
            MatFormFieldModule,
            MatInputModule,
            MatTooltipModule,
            NgIf,
            MatCheckboxModule,
            RouterLink],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css'
})
export class UserRegisterComponent {
    userService = inject(UserService);
    router = inject(Router);

    successfulInsertion: boolean = false;
    userAlreadyExists: boolean = false;
    passwordRequirementsVisible: boolean = false;
    insertedUsername = '';

    passwordRegex: RegExp = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%&.+*]).{8,}$/;

    form = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]),
            confirmPassword: new FormControl('', [Validators.required, Validators.minLength(5)]),
            isAdmin: new FormControl(false)
        },
        this.passwordConfirmPasswordValidator
    )
    
    passwordConfirmPasswordValidator(control: AbstractControl):{ [key:string]: boolean} | null {
        const form = control as FormGroup;
        const password = form.get('password')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;

        if (password && confirmPassword && (password != confirmPassword)) {
            form.get('confirmPassword')?.setErrors({passwordMismatch: true});
            return {passwordMismatch: true}
        }

        return null
    }

    showPassRequirements(visible: boolean) {
        this.passwordRequirementsVisible = visible;
    }

    onSubmit() {
        console.log("Information obtained directly from the form: ", this.form.value);
        const isAdmin: boolean = this.form.get('isAdmin')?.value || false;
        
        const userToInsert: InsertUser = {
            username: this.form.get('username')?.value?.trim() || '',
            password: this.form.get('password')?.value?.trim() || '',
            role: isAdmin ? "ADMIN" : "USER"
        };
        
        console.log(userToInsert);
        
        this.userService.registerUser(userToInsert).subscribe({
            next: (response) => {
                console.log("Response from backend: ", response)
                this.successfulInsertion = true;
                this.insertedUsername = userToInsert.username;
            },
            error: (error) => {
                console.log('Error from Backend', error)
                const errorResponse = error.error as ErrorResponse;
                console.log('Error response', errorResponse);

                this.userAlreadyExists = true;
                this.insertedUsername = userToInsert.username;
            }
        });
    }

    goBackToMain() {
        this.form.reset();
        this.router.navigate(['login'])
    }
}
