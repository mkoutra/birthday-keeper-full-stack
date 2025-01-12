import { Component, inject } from '@angular/core';
import { SimpleTableComponent } from "../simple-table/simple-table.component";
import { ListGroupMenuComponent } from '../list-group-menu/list-group-menu.component';
import { UserService } from '../../shared/services/user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [SimpleTableComponent, ListGroupMenuComponent, NgIf],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent {
    userService = inject(UserService)
    user = this.userService.user
}
