import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { API_URLS } from '../constants/api-urls';
import { UserInfo } from '../../shared/models';
import { AuthMode } from '../../shared/enums';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private static readonly TOKEN_KEY = 'sessionToken';
  private static readonly USER_KEY = 'userInfo';
  private readonly userInfo = signal<UserInfo | null>(AuthService.restoreUser());
  private readonly sessionToken = signal<string | null>(sessionStorage.getItem(AuthService.TOKEN_KEY));
  private readonly authMode = signal<AuthMode>(AuthMode.LEGACY);
  private readonly validationInterval = 60_000;
  private validationSubscription: ReturnType<typeof setInterval> | null = null;

  readonly currentUser = computed(() => this.userInfo());
  readonly isAuthenticated = computed(() => this.userInfo() !== null);
  readonly currentAuthMode = computed(() => this.authMode());
  readonly token = computed(() => this.sessionToken());

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  private static restoreUser(): UserInfo | null {
    try {
      const raw = sessionStorage.getItem(AuthService.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  fetchAuthMode(): Observable<AuthMode> {
    return this.http.get<{ authMode: string }>(API_URLS.AUTH_MODE).pipe(
      map(response => {
        const mode = (response.authMode as AuthMode) || AuthMode.LEGACY;
        this.authMode.set(mode);
        return mode;
      }),
      catchError(() => {
        this.authMode.set(AuthMode.LEGACY);
        return of(AuthMode.LEGACY);
      })
    );
  }

  login(username: string, password: string, tenant: string): Observable<UserInfo> {
    const credentials = btoa(`${username}:${password}:${tenant}`);
    return this.http.get<UserInfo>(API_URLS.LOGIN, {
      headers: {
        credentials,
        'x-csrf-token': 'null',
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }).pipe(
      tap(userData => this.onLoginSuccess(userData)),
      catchError(error => {
        throw error.error?.message || 'Login failed';
      })
    );
  }

  isLoggedIn(): Observable<UserInfo | null> {
    const user = this.currentUser();
    const url = user?.id ? API_URLS.LOGGED_IN(user.id) : API_URLS.LOGIN;
    return this.http.get<UserInfo>(url, {
      headers: { Accept: 'application/json' }
    }).pipe(
      tap(userData => this.onLoginSuccess(userData)),
      catchError(() => of(null))
    );
  }

  logout(): void {
    this.stopValidation();
    sessionStorage.removeItem(AuthService.TOKEN_KEY);
    sessionStorage.removeItem(AuthService.USER_KEY);
    this.http.get(API_URLS.LOGOUT).subscribe({
      complete: () => {
        this.userInfo.set(null);
        this.sessionToken.set(null);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.userInfo.set(null);
        this.sessionToken.set(null);
        this.router.navigate(['/login']);
      }
    });
  }

  clearSessionCache(): Observable<void> {
    return this.http.get<void>(API_URLS.CLEAR_SESSION_CACHE);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<unknown> {
    return this.http.post(API_URLS.CHANGE_PASSWORD, { oldPassword, newPassword });
  }

  startValidation(): void {
    if (this.validationSubscription) return;
    this.validationSubscription = setInterval(() => {
      const user = this.userInfo();
      if (!user) return;
      this.http.get(API_URLS.LOGGED_IN(user.id)).pipe(
        catchError(() => {
          this.logout();
          return of(null);
        })
      ).subscribe();
    }, this.validationInterval);
  }

  stopValidation(): void {
    if (this.validationSubscription) {
      clearInterval(this.validationSubscription);
      this.validationSubscription = null;
    }
  }

  private onLoginSuccess(userData: UserInfo): void {
    const frozenUser = { ...userData };
    Object.defineProperty(frozenUser, 'role', {
      value: userData.role,
      writable: false,
      enumerable: true,
      configurable: false
    });
    this.userInfo.set(frozenUser);
    this.sessionToken.set(userData.sessionToken);
    sessionStorage.setItem(AuthService.TOKEN_KEY, userData.sessionToken);
    sessionStorage.setItem(AuthService.USER_KEY, JSON.stringify(frozenUser));
    this.startValidation();
  }
}
