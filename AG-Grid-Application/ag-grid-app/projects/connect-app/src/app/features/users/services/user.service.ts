import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API_URLS } from '../../../core/constants/api-urls';
import { User, UserListResponse } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly usersSubject = new BehaviorSubject<User[]>([]);
  readonly users$ = this.usersSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadUsers(): Observable<User[]> {
    return this.http.get<UserListResponse>(API_URLS.USERS).pipe(
      map(res => res.users || []),
      tap(users => this.usersSubject.next(users))
    );
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(API_URLS.USERS, user).pipe(
      tap(() => this.loadUsers().subscribe())
    );
  }

  updateUser(user: Partial<User>): Observable<User> {
    return this.http.put<User>(API_URLS.USERS, user).pipe(
      tap(() => this.loadUsers().subscribe())
    );
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(API_URLS.USER_DELETE(userId)).pipe(
      tap(() => this.loadUsers().subscribe())
    );
  }
}
