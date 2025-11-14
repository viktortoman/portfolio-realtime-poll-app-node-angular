import {Component, OnInit, OnDestroy} from '@angular/core';
import {PollService, Poll} from '../../services/poll.service';
import {WebsocketService} from '../../services/websocket.service';
import {filter, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {EditPollModalComponent} from "../edit-poll-modal/edit-poll-modal.component";

@Component({
    selector: 'app-poll-list',
    standalone: true,
    templateUrl: './poll-list.component.html',
    imports: [
        CommonModule,
        NgIf,
        NgFor,
        MatCardModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule,
        RouterLink
    ],
    styleUrls: ['./poll-list.component.css']
})
export class PollListComponent implements OnInit, OnDestroy {

    polls: Poll[] = [];
    isLoading = true;
    error: string | null = null;

    private destroy$ = new Subject<void>();

    constructor(
        private pollService: PollService,
        private websocketService: WebsocketService,
        public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.pollService.getPolls()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (initialPolls) => {
                    this.polls = initialPolls;
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Failed to fetch polls', err);
                    this.error = 'Could not load polls. Please try again later.';
                    this.isLoading = false;
                }
            });

        this.websocketService.onNewPoll()
            .pipe(takeUntil(this.destroy$))
            .subscribe((newPoll: Poll) => {
                this.polls.unshift(newPoll);
            });

        this.websocketService.onPollUpdated()
            .pipe(takeUntil(this.destroy$))
            .subscribe((updatedPoll: Poll) => {
                const index = this.polls.findIndex(p => p._id === updatedPoll._id);
                if (index !== -1) {
                    this.polls[index] = updatedPoll;
                }
            });

        this.websocketService.onPollDeleted()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: { id: string }) => {
                this.polls = this.polls.filter(p => p._id !== data.id);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    castVote(pollId: string | undefined, optionId: string | undefined) {
        if (!pollId || !optionId) {
            console.error('Invalid Poll or Option ID');
            return;
        }

        this.pollService.vote(pollId, optionId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {},
                error: (err) => {
                    console.error('Failed to cast vote', err);
                    alert('Your vote could not be cast. Please try again.');
                }
            });
    }

    openEditDialog(poll: Poll): void {
        const dialogRef = this.dialog.open(EditPollModalComponent, {
            width: '500px',
            data: {poll: poll}
        });

        dialogRef.afterClosed()
            .pipe(filter(result => !!result))
            .subscribe((updatedPoll: Poll) => {
                const index = this.polls.findIndex(p => p._id === updatedPoll._id);
                if (index !== -1) {
                    this.polls[index] = updatedPoll;
                }
            });
    }

    openDeleteDialog(pollId: string | undefined, pollQuestion: string): void {
        if (!pollId) return;

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: {
                title: 'Delete Poll',
                message: `Are you sure you want to delete the poll: "${pollQuestion}"?`
            }
        });

        dialogRef.afterClosed()
            .pipe(
                filter(result => result === true)
            )
            .subscribe(() => {
                this.pollService.deletePoll(pollId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {},
                        error: (err) => {
                            console.error('Failed to delete poll', err);
                            alert('Failed to delete poll.');
                        }
                    });
            });
    }
}