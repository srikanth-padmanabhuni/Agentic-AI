import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URLS } from '../constants/api-urls';
import { StatusResponse } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class StatusService {
  private readonly status = signal<StatusResponse | null>(null);

  readonly uptime = computed(() => this.status()?.uptime ?? '');
  readonly version = computed(() => this.status()?.version ?? '');
  readonly licenseStatus = computed(() => this.status()?.licenseStatus ?? '');

  constructor(private readonly http: HttpClient) {}

  fetchStatus(): Observable<StatusResponse | null> {
    return this.http.get<StatusResponse>(API_URLS.STATUS).pipe(
      tap(s => this.status.set(s)),
      catchError(() => of(null))
    );
  }

  getStatus(): StatusResponse | null {
    return this.status();
  }
}
