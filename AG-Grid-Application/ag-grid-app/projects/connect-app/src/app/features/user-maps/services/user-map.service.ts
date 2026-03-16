import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URLS } from '../../../core/constants/api-urls';
import { UserMapTreeNode } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class UserMapService {
  private readonly userMapsSubject = new BehaviorSubject<UserMapTreeNode[]>([]);
  readonly userMaps$ = this.userMapsSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadUserMaps(): Observable<UserMapTreeNode[]> {
    return this.http.get<UserMapTreeNode[]>(API_URLS.USER_MAPS).pipe(
      tap(maps => this.userMapsSubject.next(maps))
    );
  }

  getUserMapList(): Observable<unknown[]> {
    return this.http.get<unknown[]>(API_URLS.USER_MAP_LIST);
  }

  saveUserMaps(maps: UserMapTreeNode[]): Observable<UserMapTreeNode[]> {
    return this.http.put<UserMapTreeNode[]>(API_URLS.USER_MAPS, maps).pipe(
      tap(saved => this.userMapsSubject.next(saved))
    );
  }

  createUserMap(map: Partial<UserMapTreeNode>): Observable<UserMapTreeNode> {
    return this.http.post<UserMapTreeNode>(API_URLS.USER_MAPS, map).pipe(
      tap(() => this.loadUserMaps().subscribe())
    );
  }

  deleteUserMap(mapId: string): Observable<void> {
    return this.http.delete<void>(`${API_URLS.USER_MAPS}/${encodeURIComponent(mapId)}`).pipe(
      tap(() => this.loadUserMaps().subscribe())
    );
  }
}
