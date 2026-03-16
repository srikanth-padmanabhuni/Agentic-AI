import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API_URLS } from '../../../core/constants/api-urls';
import { DataSource, DataSourceListResponse, DataSourceProperty, DataSourceType, DataSourceTypeProperty } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class DataSourceService {
  private readonly dataSourcesSubject = new BehaviorSubject<DataSource[]>([]);
  readonly dataSources$ = this.dataSourcesSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadDataSources(): Observable<DataSource[]> {
    return this.http.get<DataSourceListResponse>(API_URLS.DATA_SOURCES).pipe(
      map(res => res.DataSource || []),
      tap(ds => this.dataSourcesSubject.next(ds))
    );
  }

  createDataSource(dataSource: Partial<DataSource>): Observable<DataSource> {
    return this.http.post<DataSource>(API_URLS.DATA_SOURCES, dataSource).pipe(
      tap(() => this.loadDataSources().subscribe())
    );
  }

  updateDataSource(dataSource: Partial<DataSource>): Observable<DataSource> {
    return this.http.put<DataSource>(API_URLS.DATA_SOURCES, dataSource).pipe(
      tap(() => this.loadDataSources().subscribe())
    );
  }

  deleteDataSource(guid: string): Observable<void> {
    return this.http.delete<void>(API_URLS.DATA_SOURCE_DELETE(guid)).pipe(
      tap(() => this.loadDataSources().subscribe())
    );
  }

  getProperties(guid: string): Observable<DataSourceProperty[]> {
    return this.http.get<DataSourceProperty[]>(API_URLS.DATA_SOURCE_PROPERTIES(guid));
  }

  saveProperties(guid: string, properties: DataSourceProperty[]): Observable<DataSourceProperty[]> {
    return this.http.put<DataSourceProperty[]>(API_URLS.DATA_SOURCE_PROPERTIES(guid), properties);
  }

  getTypes(guid: string): Observable<DataSourceType[]> {
    return this.http.get<DataSourceType[]>(API_URLS.DATA_SOURCE_TYPES(guid));
  }

  getTypeProperties(guid: string, typeGuid: string): Observable<DataSourceTypeProperty[]> {
    return this.http.get<DataSourceTypeProperty[]>(API_URLS.DATA_SOURCE_TYPE_PROPERTIES(guid, typeGuid));
  }

  validateDataSource(dataSource: Partial<DataSource>): Observable<unknown> {
    return this.http.post(API_URLS.DATA_SOURCE_IS_VALID, dataSource);
  }

  getSupportedProducts(): Observable<unknown[]> {
    return this.http.get<unknown[]>(API_URLS.SUPPORTED_PRODUCTS);
  }

  getRelationships(guid: string): Observable<unknown[]> {
    return this.http.get<unknown[]>(API_URLS.DATA_SOURCE_RELATIONSHIPS(guid));
  }
}
