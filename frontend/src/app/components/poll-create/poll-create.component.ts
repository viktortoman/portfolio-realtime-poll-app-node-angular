import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {PollService} from '../../services/poll.service';
import {CommonModule, NgFor} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
    selector: 'app-poll-create',
    imports: [
        CommonModule,
        NgFor,
        FormsModule,
        RouterLink,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './poll-create.component.html',
    styleUrl: './poll-create.component.css'
})
export class PollCreateComponent {
    question: string = '';
    options: string[] = ['', ''];

    error: string | null = null;
    isLoading = false;

    constructor(
        private pollService: PollService,
        private router: Router
    ) {
    }

    addOption() {
        this.options.push('');
    }

    removeOption(index: number) {
        if (this.options.length > 2) {
            this.options.splice(index, 1);
        }
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }

    async submitPoll() {
        this.isLoading = true;
        this.error = null;

        const validOptions = this.options.filter(opt => opt.trim() !== '');

        if (!this.question.trim() || validOptions.length < 2) {
            this.error = 'Please fill out the question and at least two options.';
            this.isLoading = false;
            return;
        }

        this.pollService.createPoll({question: this.question, options: validOptions})
            .subscribe({
                next: (newPoll) => {
                    this.isLoading = false;
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    console.error('Failed to create poll', err);
                    this.error = 'Failed to create the poll. Please try again.';
                    this.isLoading = false;
                }
            });
    }
}
