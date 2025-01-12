import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FriendResponse, friendsDemo } from '../../shared/interfaces/friend-response';

import { Sort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { FriendService } from '../../shared/services/friend.service';
import { MatTooltipModule } from '@angular/material/tooltip';

import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-simple-table',
  standalone: true,
  imports: [MatSortModule,
            MatIconModule,
            MatPaginatorModule,
            MatTooltipModule,
            RouterLink,
            NgFor,
            NgIf
        ],
  templateUrl: './simple-table.component.html',
  styleUrl: './simple-table.component.css'
})
export class SimpleTableComponent {
    router = inject(Router);
    friendService = inject(FriendService);
    dialog = inject(MatDialog);
    cdr = inject(ChangeDetectorRef);

    friends: FriendResponse[] = [];
    sortedData: FriendResponse[] = [];

    // Pagination parameters
    totalElements: number = 0;
    pageSize: number = 5; // Default page size
    pageNo: number = 0;

    ngOnInit(): void {
        this.fetchPaginatedFriends();
    }

    fetchAllFriends(): void {
        this.friendService.getAllFriends().subscribe({
            next: (response) => {
                console.log("Response from backend: ", response);
                this.friends = response;
                this.sortedData = this.friends.slice();
            },
            error: (error) => {
                console.log("Error from backend", error);
            }
        })
    }

    fetchPaginatedFriends(): void {
        this.friendService.getPaginatedFriends(this.pageNo, this.pageSize).subscribe({
            next: (response) => {
                this.friends = response.content as FriendResponse[];
                this.totalElements = response.totalElements;
                this.sortedData = this.friends.slice();
            },
            error: (error) => {
                console.log("Error fetching paginated friends ", error);
            }
        });
    }

    sortData(sort: Sort) {
        const data = this.friends.slice();

        if (!sort.active || sort.direction === '') {
            this.sortedData = data;
            return;
        }

        this.sortedData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'id':
                    return compare(a.id, b.id, isAsc);
                case 'firstname':
                    return compare(a.firstname, b.firstname, isAsc);
                case 'lastname':
                    return compare(a.lastname, b.lastname, isAsc);
                case 'dateOfBirth':
                    // Convert to Date for proper comparison
                    return compare(new Date(a.dateOfBirth), new Date(b.dateOfBirth), isAsc);
                case 'daysUntilNextBirthday':
                    // Convert to number for proper comparison
                    return compare(Number(a.daysUntilNextBirthday), Number(b.daysUntilNextBirthday), isAsc);        
                default:
                    return 0;
            }
        });
    }

    onEditClicked(id:string) {
        this.router.navigate(['/friends/edit', id]);
    }

    onDeleteClicked(id: string):void {
        console.log("Delete clicked for id: ", id);

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {entityName: 'friend'}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'confirm') {
              this.deleteFriend(id); // Call the API to delete the friend
            }
        });
    }

    deleteFriend(friendId: string): void {
        // Call the backend API to delete the friend
        this.friendService.deleteFriend(friendId).subscribe({
            next: (response) => {
                console.log("Deleted friend: ", response);
                this.fetchPaginatedFriends()
            },
            error: (error) => {
                console.log("Error trying to delete a friend.", error)
            }
        })
    }

    onPageChange(event: PageEvent): void {
        this.pageNo = event.pageIndex;
        this.pageSize = event.pageSize;
        this.fetchPaginatedFriends();
    }
}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
