import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.token();

  let authReq = req;
  if (token && !req.url.includes('/noauth/')) {
    authReq = req.clone({
      setHeaders: {
        'X-CSRF-TOKEN': token,
        'Content-Type': req.headers.get('Content-Type') || 'application/json',
        Accept: req.headers.get('Accept') || 'application/json'
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if ((error.status === 401 || error.status === 403) && !req.url.includes('/logout')) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
