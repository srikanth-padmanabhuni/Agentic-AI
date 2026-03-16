import { Injectable, signal, computed } from '@angular/core';

export interface SnackbarMessage {
  id: number;
  messageKey: string;
  params?: Record<string, string>;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class UiSnackbarService {
  private _messages = signal<SnackbarMessage[]>([]);
  readonly messages = computed(() => this._messages());

  private _counter = 0;

  open(messageKey: string, type: SnackbarMessage['type'] = 'info', duration = 5000, params?: Record<string, string>): number {
    const id = ++this._counter;
    const msg: SnackbarMessage = { id, messageKey, type, duration, params };
    this._messages.update(m => [...m, msg]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
    return id;
  }

  success(messageKey: string, duration = 4000, params?: Record<string, string>): number {
    return this.open(messageKey, 'success', duration, params);
  }

  error(messageKey: string, duration = 6000, params?: Record<string, string>): number {
    return this.open(messageKey, 'error', duration, params);
  }

  warning(messageKey: string, duration = 5000, params?: Record<string, string>): number {
    return this.open(messageKey, 'warning', duration, params);
  }

  info(messageKey: string, duration = 4000, params?: Record<string, string>): number {
    return this.open(messageKey, 'info', duration, params);
  }

  dismiss(id: number): void {
    this._messages.update(m => m.filter(msg => msg.id !== id));
  }

  dismissAll(): void {
    this._messages.set([]);
  }
}
