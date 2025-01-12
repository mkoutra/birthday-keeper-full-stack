import { Component, inject } from '@angular/core';

import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Credentials } from '../../shared/interfaces/credentials';
import { UserService } from '../../shared/services/user.service';

import { TokenClaims } from '../../shared/interfaces/token-claims';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, RouterLink],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
    router = inject(Router);
    userService = inject(UserService);
    authService = inject(AuthService);

    invalidLogin: boolean = false;

    form = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
    });

    onSubmit() {
        const userCredentials = this.form.value as Credentials
        console.log("Credentials directly from the form: ", userCredentials)

        this.userService.loginUser(userCredentials).subscribe({
            next: (response) => {
                // Get token from the backend response.
                const token = response.jwtToken;
                
                // Save the token to browser's local storage.
                this.authService.saveTokenToStorage(token);

                // Get the decoded information from the saved token.
                const decodedToken = this.authService.getDecodedToken() as TokenClaims;

                // Assign information from the token to user's signal variable
                this.userService.user.set({
                    username: decodedToken.sub,
                    role: decodedToken.role
                })

                this.router.navigate(['main'])
            },
            error: (error) => {
                console.log('Error from Backend', error)
                this.invalidLogin = true;
            }
        })
    }
}
