import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MatIconModule, NgIf, MatTooltipModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
    userService = inject(UserService);
    router = inject(Router);

    user = this.userService.user;
  
    logout() {
      this.userService.logoutUser().subscribe({
        next: (response) => {
            console.log(response.code);
            this.router.navigate(['login']);
        },
        error: (error) => {
            console.log("Error in logout")
        }
      });
    }
}
