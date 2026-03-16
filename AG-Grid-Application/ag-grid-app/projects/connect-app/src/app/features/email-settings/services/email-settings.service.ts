import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URLS } from '../../../core/constants/api-urls';
import { EmailSettingsConnection } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class EmailSettingsService {
  private readonly settingsSubject = new BehaviorSubject<EmailSettingsConnection[]>([]);
  readonly settings$ = this.settingsSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadConnections(): Observable<EmailSettingsConnection[]> {
    return this.http.get<EmailSettingsConnection[]>(API_URLS.EMAIL_SETTINGS_CONNECTIONS).pipe(
      tap(settings => this.settingsSubject.next(settings))
    );
  }

  loadConfigurations(): Observable<unknown[]> {
    return this.http.get<unknown[]>(API_URLS.EMAIL_SETTINGS_CONFIGS);
  }

  saveConfigurations(configs: unknown[]): Observable<unknown[]> {
    return this.http.put<unknown[]>(API_URLS.EMAIL_SETTINGS_CONFIGS, configs);
  }
}
