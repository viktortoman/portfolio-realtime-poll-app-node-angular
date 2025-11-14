import {Injectable} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {Observable} from 'rxjs';
import {Poll} from './poll.service';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    private socket: Socket;
    private backendUrl = environment.apiBaseUrl;

    constructor() {
        this.socket = io(this.backendUrl);

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });
    }

    listen<T>(eventName: string): Observable<T> {
        return new Observable((subscriber) => {
            this.socket.on(eventName, (data: T) => {
                subscriber.next(data);
            });

            this.socket.on('error', (err) => {
                subscriber.error(err);
            });

            return () => {
                this.socket.off(eventName);
            };
        });
    }

    onPollUpdated(): Observable<Poll> {
        return this.listen<Poll>('pollUpdated');
    }

    onNewPoll(): Observable<Poll> {
        return this.listen<Poll>('newPoll');
    }

    onPollDeleted(): Observable<{ id: string }> {
        return this.listen<{ id: string }>('pollDeleted');
    }
}
