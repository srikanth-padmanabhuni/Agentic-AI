import { Injectable, signal } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface WebSocketMessage {
  type: string;
  data: unknown;
}

export enum WebSocketEvent {
  END_ITERATION = 'EndIteration',
  CHART_REFRESH = 'ChartRefresh',
  UPDATE_STATUS = 'UpdateStatus',
  UPDATE_SERVER_STATUS = 'UpdateServerStatus',
  STOP_SERVER = 'StopServer',
  LAST_SYNC_CHANGES = 'LastSyncChanges'
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket$: WebSocketSubject<WebSocketMessage> | null = null;
  private readonly messages$ = new Subject<WebSocketMessage>();
  private readonly connected = signal(false);
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 10;
  private readonly reconnectDelay = 3000;

  readonly isConnected = this.connected.asReadonly();

  constructor(private readonly authService: AuthService) {}

  connect(): void {
    if (this.socket$) return;

    const token = this.authService.token();
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/connectWebSocket?token=${token}`;

    this.socket$ = webSocket<WebSocketMessage>({
      url: wsUrl,
      openObserver: {
        next: () => {
          this.connected.set(true);
          this.reconnectAttempts = 0;
        }
      },
      closeObserver: {
        next: () => {
          this.connected.set(false);
          this.reconnect();
        }
      }
    });

    this.socket$.pipe(
      catchError(() => {
        this.connected.set(false);
        this.reconnect();
        return EMPTY;
      })
    ).subscribe(msg => this.messages$.next(msg));
  }

  disconnect(): void {
    this.socket$?.complete();
    this.socket$ = null;
    this.connected.set(false);
  }

  on(eventType: WebSocketEvent): Observable<WebSocketMessage> {
    return new Observable(subscriber => {
      const sub = this.messages$.subscribe(msg => {
        if (msg.type === eventType) {
          subscriber.next(msg);
        }
      });
      return () => sub.unsubscribe();
    });
  }

  onAny(): Observable<WebSocketMessage> {
    return this.messages$.asObservable();
  }

  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
    this.reconnectAttempts++;
    setTimeout(() => {
      this.socket$ = null;
      this.connect();
    }, this.reconnectDelay * this.reconnectAttempts);
  }
}
