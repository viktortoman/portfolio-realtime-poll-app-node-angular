import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs'
import {environment} from '../../environments/environment';
import {isPlatformBrowser} from '@angular/common';

export interface PollOption {
    _id?: string;
    name: string;
    votes: number;
}

export interface Poll {
    _id?: string;
    question: string;
    options: PollOption[];
    createdAt?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class PollService {
    private readonly baseUrl;

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.baseUrl = `${environment.apiBaseUrl}/api/polls`;
        } else {
            this.baseUrl = `${environment.serverBaseUrl}/api/polls`;
        }
    }

    getPolls(): Observable<Poll[]> {
        return this.http.get<Poll[]>(this.baseUrl);
    }

    getPoll(id: string): Observable<Poll> {
        return this.http.get<Poll>(`${this.baseUrl}/${id}`);
    }

    createPoll(data: { question: string, options: string[] }): Observable<Poll> {
        return this.http.post<Poll>(this.baseUrl, data);
    }

    updatePoll(pollId: string, question: string): Observable<Poll> {
        return this.http.put<Poll>(`${this.baseUrl}/${pollId}`, { question });
    }

    deletePoll(pollId: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${pollId}`);
    }

    vote(pollId: string, optionId: string): Observable<Poll> {
        return this.http.post<Poll>(`${this.baseUrl}/${pollId}/vote`, {optionId});
    }
}
