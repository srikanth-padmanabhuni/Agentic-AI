import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URLS } from '../../../core/constants/api-urls';
import { Connection, ConnectionListResponse } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  constructor(private readonly http: HttpClient) {}

  getConnections(): Observable<Connection[]> {
    return this.http.get<ConnectionListResponse>(API_URLS.CONNECTIONS)
      .pipe(map(res => res.Synchronization || []));
  }

  getConnection(guid: string): Observable<Connection> {
    return this.http.get<Connection>(API_URLS.CONNECTION(guid));
  }

  createConnection(connection: Partial<Connection>): Observable<Connection> {
    return this.http.post<Connection>(API_URLS.CONNECTIONS, connection);
  }

  updateConnection(guid: string, connection: Partial<Connection>): Observable<Connection> {
    return this.http.put<Connection>(API_URLS.CONNECTION(guid), connection);
  }

  deleteConnection(guid: string): Observable<void> {
    return this.http.delete<void>(API_URLS.CONNECTION(guid));
  }

  runConnection(guid: string): Observable<void> {
    return this.http.post<void>(API_URLS.RUN_CONNECTION(guid), {});
  }

  runFullConnection(guid: string): Observable<void> {
    return this.http.post<void>(API_URLS.RUN_FULL_CONNECTION(guid), {});
  }

  stopConnection(guid: string): Observable<void> {
    return this.http.post<void>(API_URLS.STOP_CONNECTION(guid), {});
  }

  enableConnection(guid: string): Observable<void> {
    return this.http.put<void>(API_URLS.ENABLE_CONNECTION(guid), {});
  }

  disableConnection(guid: string): Observable<void> {
    return this.http.put<void>(API_URLS.DISABLE_CONNECTION(guid), {});
  }

  deleteWatermarks(guid: string): Observable<void> {
    return this.http.delete<void>(API_URLS.WATERMARKS(guid));
  }

  getCrossReferences(guid: string): Observable<unknown[]> {
    return this.http.get<unknown[]>(API_URLS.CROSS_REFERENCES(guid));
  }

  purgeActivity(guid: string): Observable<void> {
    return this.http.delete<void>(API_URLS.ACTIVITY_AUDIT_TREE(guid));
  }

  exportConnection(guid: string): Observable<Blob> {
    return this.http.get(API_URLS.EXPORT_CONNECTION, {
      params: new HttpParams().set('syncGuid', guid),
      responseType: 'blob'
    });
  }
}
