import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef } from '@angular/core';

import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { pastDateValidator } from '../../shared/validator/past-date.validator';
import { FriendService } from '../../shared/services/friend.service';
import { FriendInsert } from '../../shared/interfaces/friend-insert';
import { ErrorResponse } from '../../shared/interfaces/error-response';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-friend',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, 
            MatButtonModule,
            MatFormFieldModule,
            MatInputModule,
            MatTooltipModule,
            MatDatepickerModule,
            NgIf],
  templateUrl: './add-friend.component.html',
  styleUrl: './add-friend.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddFriendComponent {
    friendService = inject(FriendService)
    router = inject(Router);
    cdr = inject(ChangeDetectorRef);  // Used to notify Angular of the changes in the variables

    successfulInsertion: boolean = false;
    friendAlreadyExists: boolean = false;

    insertedFullname = 'John Doe';

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

        const friendToInsert: FriendInsert = {
            firstname: this.form.get('firstname')?.value?.trim() || '',
            lastname: this.form.get('lastname')?.value?.trim() || '',
            nickname: this.form.get('nickname')?.value?.trim(),
            dateOfBirth: this.createValidDateFormat(date)
        };
        
        console.log("Friend sent to backend: ", friendToInsert);
        
        this.friendService.insertFriend(friendToInsert).subscribe({
            next: (response) => {
                console.log("Response from backend: ", response)
                this.successfulInsertion = true;
                this.insertedFullname = `${response.firstname} ${response.lastname}`;
                this.friendAlreadyExists = false;

                this.cdr.detectChanges(); // notifying Angular of the changes
            },
            error: (error) => {
                console.log('Error from Backend', error)
                const errorResponse = error.error as ErrorResponse;
                console.log('Error response', errorResponse);

                this.friendAlreadyExists = true;
                this.successfulInsertion = false;
                this.insertedFullname = `${friendToInsert.firstname} ${friendToInsert.lastname}`;

                this.cdr.detectChanges(); // notifying Angular of the changes
            }
        });
    }

    goBackToMain() {
        this.form.reset();
        this.router.navigate(['main']);
    }
}
