import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URLS } from '../constants/api-urls';
import { UserPermissions as UserPermissionsModel } from '../../shared/models';
import { UserPermission } from '../../shared/enums';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private readonly permissions = signal<UserPermissionsModel | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  fetchPermissions(): Observable<UserPermissionsModel | null> {
    return this.http.get<UserPermissionsModel>(API_URLS.PERMISSIONS).pipe(
      tap(perms => this.permissions.set(perms)),
      catchError(() => {
        this.permissions.set(null);
        return of(null);
      })
    );
  }

  hasPermission(permission: UserPermission | UserPermission[]): boolean {
    const permData = this.permissions();
    const user = this.authService.currentUser();

    if (!permData || !user) return false;

    const rolePerms = permData.permissions[user.role];
    if (!rolePerms) return false;

    if (Array.isArray(permission)) {
      return permission.some(p => rolePerms.includes(p));
    }
    return rolePerms.includes(permission);
  }

  hasAnyPermission(...permissions: UserPermission[]): boolean {
    return permissions.some(p => this.hasPermission(p));
  }

  hasAllPermissions(...permissions: UserPermission[]): boolean {
    return permissions.every(p => this.hasPermission(p));
  }
}
