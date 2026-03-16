import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URLS } from '../../../core/constants/api-urls';
import { AuthenticatorDataSource, AuthenticatorProduct, Authenticator } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthenticatorService {
  private readonly authenticatorsSubject = new BehaviorSubject<AuthenticatorDataSource[]>([]);
  readonly authenticators$ = this.authenticatorsSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadAuthenticators(): Observable<AuthenticatorDataSource[]> {
    return this.http.get<AuthenticatorDataSource[]>(API_URLS.AUTHENTICATOR_DATA_SOURCES).pipe(
      tap(auths => this.authenticatorsSubject.next(auths))
    );
  }

  getProducts(): Observable<AuthenticatorProduct[]> {
    return this.http.get<AuthenticatorProduct[]>(API_URLS.AUTHENTICATOR_PRODUCTS);
  }

  createAuthenticator(authenticator: Partial<Authenticator>): Observable<Authenticator> {
    return this.http.post<Authenticator>(API_URLS.AUTHENTICATOR_DATA_SOURCES, authenticator).pipe(
      tap(() => this.loadAuthenticators().subscribe())
    );
  }

  updateAuthenticator(authenticator: Partial<Authenticator>): Observable<Authenticator> {
    return this.http.put<Authenticator>(API_URLS.AUTHENTICATOR_DATA_SOURCES, authenticator).pipe(
      tap(() => this.loadAuthenticators().subscribe())
    );
  }

  deleteAuthenticator(authDataSourceGuid: string): Observable<void> {
    return this.http.delete<void>(`${API_URLS.AUTHENTICATOR_DATA_SOURCES}/${encodeURIComponent(authDataSourceGuid)}`).pipe(
      tap(() => this.loadAuthenticators().subscribe())
    );
  }
}
