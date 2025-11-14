import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PollService, Poll} from '../../services/poll.service';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


export interface EditPollData {
    poll: Poll;
}

@Component({
    selector: 'app-edit-poll-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './edit-poll-modal.component.html',
    styleUrls: ['./edit-poll-modal.component.css']
})
export class EditPollModalComponent {

    newQuestion: string;
    isLoading = false;
    error: string | null = null;

    constructor(
        public dialogRef: MatDialogRef<EditPollModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: EditPollData,
        private pollService: PollService
    ) {
        this.newQuestion = data.poll.question;
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (!this.newQuestion || this.newQuestion.trim().length < 5) {
            this.error = 'The question must be at least 5 characters long.';
            return;
        }

        this.isLoading = true;
        this.error = null;

        this.pollService.updatePoll(this.data.poll._id!, this.newQuestion.trim())
            .subscribe({
                next: (updatedPoll) => {
                    this.isLoading = false;
                    this.dialogRef.close(updatedPoll);
                },
                error: (err) => {
                    console.error('Update failed:', err);
                    this.error = 'Update failed. Please check your input.';
                    this.isLoading = false;
                }
            });
    }
}