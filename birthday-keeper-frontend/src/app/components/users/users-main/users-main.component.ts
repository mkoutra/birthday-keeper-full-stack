import { Component, inject } from '@angular/core';
import { SimpleTableComponent } from "../../simple-table/simple-table.component";
import { ListGroupMenuComponent } from '../../list-group-menu/list-group-menu.component';
import { UserService } from '../../../shared/services/user.service';
import { NgIf } from '@angular/common';
import { UsersTableComponent } from '../users-table/users-table.component';

@Component({
  selector: 'app-users-main',
  standalone: true,
  imports: [UsersTableComponent, ListGroupMenuComponent, NgIf],
  templateUrl: './users-main.component.html',
  styleUrl: './users-main.component.css'
})
export class UsersMainComponent {
    userService = inject(UserService)
    user = this.userService.user
}
