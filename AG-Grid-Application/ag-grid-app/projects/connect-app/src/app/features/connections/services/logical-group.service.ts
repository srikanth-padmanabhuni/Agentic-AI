import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../../../core/constants/api-urls';
import { LogicalGroup } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class LogicalGroupService {
  constructor(private readonly http: HttpClient) {}

  getGroups(): Observable<LogicalGroup[]> {
    return this.http.get<LogicalGroup[]>(API_URLS.LOGICAL_GROUPS);
  }

  createGroup(group: Partial<LogicalGroup>): Observable<LogicalGroup> {
    return this.http.post<LogicalGroup>(API_URLS.LOGICAL_GROUPS, group);
  }

  updateGroup(guid: string, group: Partial<LogicalGroup>): Observable<LogicalGroup> {
    return this.http.put<LogicalGroup>(API_URLS.LOGICAL_GROUP(guid), group);
  }

  deleteGroup(guid: string): Observable<void> {
    return this.http.delete<void>(API_URLS.LOGICAL_GROUP(guid));
  }
}
