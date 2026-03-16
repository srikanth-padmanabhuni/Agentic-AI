import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  const skipUrls = ['/loggedIn/', '/clearSessionCache'];
  const shouldSkip = skipUrls.some(url => req.url.includes(url));

  if (!shouldSkip) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!shouldSkip) {
        loadingService.hide();
      }
    })
  );
};
