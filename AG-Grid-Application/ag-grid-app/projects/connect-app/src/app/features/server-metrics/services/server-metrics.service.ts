import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URLS } from '../../../core/constants/api-urls';
import { ServerMetrics } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class ServerMetricsService {
  private readonly metricsSubject = new BehaviorSubject<ServerMetrics[]>([]);
  readonly metrics$ = this.metricsSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadMetrics(): Observable<ServerMetrics[]> {
    return this.http.get<ServerMetrics[]>(API_URLS.SERVER_METRICS).pipe(
      tap(metrics => this.metricsSubject.next(metrics))
    );
  }
}
