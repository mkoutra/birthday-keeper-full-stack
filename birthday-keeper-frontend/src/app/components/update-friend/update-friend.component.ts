import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { pastDateValidator } from '../../shared/validator/past-date.validator';
import { FriendService } from '../../shared/services/friend.service';
import { NgIf } from '@angular/common';
import { FriendUpdate } from '../../shared/interfaces/friend-update';
import { ErrorResponse } from '../../shared/interfaces/error-response';

@Component({
    selector: 'app-update-friend',
    standalone: true,
    providers: [provideNativeDateAdapter()],
    imports: [ReactiveFormsModule, 
              MatButtonModule,
              MatFormFieldModule,
              MatInputModule,
              MatTooltipModule,
              MatDatepickerModule,
              NgIf],
    templateUrl: './update-friend.component.html',
    styleUrl: './update-friend.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateFriendComponent {
    route = inject(ActivatedRoute);
    friendService = inject(FriendService);
    router = inject(Router);
    cdr = inject(ChangeDetectorRef);

    friendId: string | null | undefined;
    friendIdIsInvalid?: boolean;
    
    successfulUpdate: boolean = false;
    friendAlreadyExists: boolean = false;
    insertedFullname = 'John Doe';


    ngOnInit(): void {
        this.friendId = this.route.snapshot.paramMap.get('id');
        
        if (this.friendId) {
            this.friendIdIsInvalid = /^\d+$/.test(this.friendId);
        }
        
        if (!this.friendId || !this.friendIdIsInvalid) {
            this.router.navigate(['not-found'])
        }

        // Fetch data from API to fill the form
        if (this.friendId) {
            this.friendService.getFriendById(this.friendId).subscribe({
                next: (response) => {
                    console.log("Response for filling the form: ", response)
                    this.form.patchValue({
                        firstname: response.firstname,
                        lastname: response.lastname,
                        nickname: response.nickname,
                        dateOfBirth: response.dateOfBirth,
                    });
                },
                error: (error) => {
                    const errorResponse = error.error as ErrorResponse;
                    console.log("Error from backend: ", errorResponse);
                    this.router.navigate(['not-found'])
                }
            })
        }
    }

    form = new FormGroup({
            firstname: new FormControl('', Validators.required),
            lastname: new FormControl('', Validators.required),
            nickname: new FormControl(''),
            dateOfBirth: new FormControl('', [Validators.required, pastDateValidator()])
    })

    createValidDateFormat(date: Date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    onSubmit() {
        let date: Date = this.form.get('dateOfBirth')?.value as unknown as Date

        const friendToUpdate: FriendUpdate = {
            id: this.friendId || '',
            firstname: this.form.get('firstname')?.value?.trim() || '',
            lastname: this.form.get('lastname')?.value?.trim() || '',
            nickname: this.form.get('nickname')?.value?.trim(),
            // Check if the date is provided as a string (e.g., from an auto-filled value).
            // If the date is a string, pass it directly. Otherwise, format it using
            // createValidDateFormat(), which requires a Date object as its argument.
            dateOfBirth: typeof date === 'string' ? date : this.createValidDateFormat(date),
        };
        
        console.log(friendToUpdate);
        
        this.friendService.updateFriend(friendToUpdate, this.friendId || '').subscribe({
            next: (response) => {
                console.log("Response from backend: ", response)
                this.insertedFullname = `${response.firstname} ${response.lastname}`;
                this.successfulUpdate = true;
                this.friendAlreadyExists = false;

                this.cdr.detectChanges(); // notifying Angular of the changes
            },
            error: (error) => {
                const errorResponse = error.error as ErrorResponse;
                console.log('Error response', errorResponse);

                this.friendAlreadyExists = true;
                this.successfulUpdate = false;
                this.insertedFullname = `${friendToUpdate.firstname} ${friendToUpdate.lastname}`;

                this.cdr.detectChanges(); // notifying Angular of the changes
            }
        });
    }

    goBackToMain() {
        this.form.reset();
        this.router.navigate(['main']);
    }
}
