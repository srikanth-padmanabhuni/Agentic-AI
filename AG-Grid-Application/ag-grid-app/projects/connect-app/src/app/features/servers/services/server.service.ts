import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API_URLS } from '../../../core/constants/api-urls';
import { Server, ServerListResponse } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class ServerService {
  private readonly serversSubject = new BehaviorSubject<Server[]>([]);
  readonly servers$ = this.serversSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadServers(): Observable<Server[]> {
    return this.http.get<ServerListResponse>(API_URLS.SERVERS).pipe(
      map(res => res.Server || []),
      tap(servers => this.serversSubject.next(servers))
    );
  }

  getServer(guid: string): Observable<Server> {
    return this.http.get<Server>(API_URLS.SERVER(guid));
  }

  updateServer(server: Partial<Server>): Observable<Server> {
    return this.http.put<Server>(API_URLS.SERVERS, server).pipe(
      tap(() => this.loadServers().subscribe())
    );
  }

  deleteServer(guid: string): Observable<void> {
    return this.http.delete<void>(API_URLS.SERVER(guid)).pipe(
      tap(() => this.loadServers().subscribe())
    );
  }

  stopServersForUpgrade(): Observable<void> {
    return this.http.put<void>(API_URLS.STOP_SERVERS_FOR_UPGRADE, {});
  }

  getServerChoices(guid: string): Observable<unknown> {
    return this.http.get(API_URLS.SERVER_CHOICES(guid));
  }
}
