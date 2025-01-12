import { ChangeDetectorRef, Component, inject } from '@angular/core';

import { Sort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../../shared/services/user.service';
import { UserResponse } from '../../../shared/interfaces/user-response';

import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [MatSortModule,
            MatIconModule,
            MatPaginatorModule,
            MatTooltipModule,
            RouterLink,
            NgFor,
            NgIf
        ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css'
})
export class UsersTableComponent{
    router = inject(Router);
    userService = inject(UserService);
    dialog = inject(MatDialog);
    cdr = inject(ChangeDetectorRef);

    users: UserResponse[] = [];
    sortedData: UserResponse[] = [];

    // Pagination parameters
    totalElements: number = 0;
    pageSize: number = 5; // Default page size
    pageNo: number = 0;

    ngOnInit(): void {
        this.fetchPaginatedUsers();
    }

    fetchAllUsers() {
        this.userService.getAllUsers().subscribe({
            next: (response) => {
                console.log("Response from backend: ", response);
                this.users = response;
                this.sortedData = this.users.slice();
            },
            error: (error) => {
                console.log("Error from backend", error);
            }
        })
    }

    fetchPaginatedUsers(): void {
        this.userService.getPaginatedUsers(this.pageNo, this.pageSize).subscribe({
            next: (response) => {
                this.users = response.content as UserResponse[];
                this.totalElements = response.totalElements;
                this.sortedData = this.users.slice();
            },
            error: (error) => {
                console.log("Error fetching paginated users ", error);
            }
        });
    }

    sortData(sort: Sort) {
        const data = this.users.slice();

        if (!sort.active || sort.direction === '') {
            this.sortedData = data;
            return;
        }

        this.sortedData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'id':
                    return compare(Number(a.id), Number(b.id), isAsc)
                case 'username':
                    return compare(a.username, b.username, isAsc);
                case 'role':
                    return compare(a.role, b.role, isAsc);  
                default:
                    return 0;
            }
        });
    }

    onDeleteClicked(id: string):void {
        console.log("Delete clicked for id: ", id);
        
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {entityName: 'user'}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'confirm') {
              this.deleteUser(id); // Call the API to delete the user
            }
        });
    }

    deleteUser(userId: string): void {
        // Call the backend API to delete the user
        this.userService.deleteUser(userId).subscribe({
            next: (response) => {
                console.log("Deleted user: ", response);
                // Update the frontend list by removing the deleted user
                this.fetchPaginatedUsers();
            },
            error: (error) => {
                console.log("Error trying to delete a user.", error)
            }
        })
    }

    // returns true if the username belongs to the logged in user.
    isLoggedInUser(username: string):boolean {
        return username == this.userService.user()?.username;
    }

    onPageChange(event: PageEvent): void {
        this.pageNo = event.pageIndex;
        this.pageSize = event.pageSize;
        this.fetchPaginatedUsers();
    }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
