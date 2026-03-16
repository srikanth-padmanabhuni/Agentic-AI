import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URLS } from '../../../core/constants/api-urls';
import { AccessToken } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class AccessTokenService {
  private readonly tokensSubject = new BehaviorSubject<AccessToken[]>([]);
  readonly tokens$ = this.tokensSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadTokens(): Observable<AccessToken[]> {
    return this.http.get<AccessToken[]>(API_URLS.ACCESS_TOKENS).pipe(
      tap(tokens => this.tokensSubject.next(tokens))
    );
  }

  createToken(token: Partial<AccessToken>): Observable<AccessToken> {
    return this.http.post<AccessToken>(API_URLS.ACCESS_TOKENS, token).pipe(
      tap(() => this.loadTokens().subscribe())
    );
  }

  deleteToken(id: string): Observable<void> {
    return this.http.delete<void>(API_URLS.ACCESS_TOKEN_DELETE(id)).pipe(
      tap(() => this.loadTokens().subscribe())
    );
  }
}
