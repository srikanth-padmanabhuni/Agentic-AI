import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { API_URLS } from '../constants/api-urls';
import { FeatureFlagItem, GlobalProperty } from '../../shared/models';
import { FeatureFlag } from '../../shared/enums';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private readonly flags = signal<FeatureFlagItem[]>([]);

  constructor(private readonly http: HttpClient) {}

  loadFlags(): Observable<FeatureFlagItem[]> {
    return this.http.get<FeatureFlagItem[] | Record<string, unknown>>(API_URLS.FEATURE_FLAGS).pipe(
      map(response => {
        if (Array.isArray(response)) return response;
        const values = Object.values(response);
        const arr = values.find(v => Array.isArray(v));
        return (arr as FeatureFlagItem[]) ?? [];
      }),
      tap(flags => this.flags.set(flags)),
      catchError(() => of([]))
    );
  }

  isEnabled(flag: FeatureFlag): boolean {
    return this.flags().some(f => f.name === flag && f.enabled);
  }

  getFlags(): FeatureFlagItem[] {
    return this.flags();
  }
}

@Injectable({ providedIn: 'root' })
export class GlobalPropertyService {
  private readonly properties = signal<GlobalProperty[]>([]);

  constructor(private readonly http: HttpClient) {}

  loadProperties(): Observable<GlobalProperty[]> {
    return this.http.get<GlobalProperty[]>(API_URLS.GLOBAL_PROPERTIES).pipe(
      tap(props => this.properties.set(props)),
      catchError(() => of([]))
    );
  }

  getProperty(name: string): string | undefined {
    return this.properties().find(p => p.name === name)?.value;
  }

  getProperties(): GlobalProperty[] {
    return this.properties();
  }

  saveProperties(properties: GlobalProperty[]): Observable<GlobalProperty[]> {
    return this.http.put<GlobalProperty[]>(API_URLS.GLOBAL_PROPERTIES, properties).pipe(
      tap(props => this.properties.set(props))
    );
  }
}
