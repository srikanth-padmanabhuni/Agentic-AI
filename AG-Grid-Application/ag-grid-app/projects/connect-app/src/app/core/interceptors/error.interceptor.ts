import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { UiSnackbarService } from 'ui-lib';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbar = inject(UiSnackbarService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let messageKey = 'ERRORS.GENERIC';

      if (error.status === 0) {
        messageKey = 'ERRORS.NETWORK';
      } else if (error.status === 400) {
        messageKey = 'ERRORS.VALIDATION';
      } else if (error.status === 404) {
        messageKey = 'ERRORS.NOT_FOUND';
      } else if (error.status === 500 || error.status === 503) {
        messageKey = 'ERRORS.SERVER';
      }

      // Don't show snackbar for auth errors (handled by auth interceptor)
      if (error.status !== 401 && error.status !== 403) {
        snackbar.error(messageKey);
      }

      return throwError(() => error);
    })
  );
};
