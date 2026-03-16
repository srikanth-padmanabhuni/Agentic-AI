import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../constants/api-urls';
import {
  ActivityChartData,
  DurationChartData,
  ProjectChangesChartData,
  ConnectActivityChartData,
  AuditActivityData
} from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ChartService {
  constructor(private readonly http: HttpClient) {}

  getConnectActivityChart(): Observable<ConnectActivityChartData[]> {
    return this.http.get<ConnectActivityChartData[]>(API_URLS.ACTIVITY_CHART);
  }

  getConnectionDurationData(syncGuid: string): Observable<DurationChartData> {
    return this.http.get<DurationChartData>(API_URLS.DURATION_CHART, {
      params: new HttpParams().set('synchronizationGuid', syncGuid)
    });
  }

  getConnectionProjectChangesData(
    syncGuid: string,
    project?: string,
    isSource?: boolean
  ): Observable<ProjectChangesChartData[]> {
    let params = new HttpParams().set('synchronizationGuid', syncGuid);
    if (project) {
      params = params.set('project', project);
    }
    if (isSource !== undefined) {
      params = params.set('isSource', String(isSource));
    }
    return this.http.get<ProjectChangesChartData[]>(API_URLS.PROJECT_CHANGES_CHART, { params });
  }

  getActivityAuditData(syncGuid: string): Observable<AuditActivityData[]> {
    return this.http.get<AuditActivityData[]>(API_URLS.ACTIVITY_AUDIT_TREE(syncGuid));
  }

  getIterationMessages(syncGuid: string): Observable<unknown[]> {
    return this.http.get<unknown[]>(API_URLS.ITERATION_MESSAGES(syncGuid));
  }

  exportActivityAudit(syncGuid: string): Observable<Blob> {
    return this.http.get(API_URLS.EXPORT_ACTIVITY_AUDIT, {
      params: new HttpParams().set('syncGuid', syncGuid),
      responseType: 'blob'
    });
  }
}
