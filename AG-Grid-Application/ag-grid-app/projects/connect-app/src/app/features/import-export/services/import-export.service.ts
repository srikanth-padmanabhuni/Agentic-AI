import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../../../core/constants/api-urls';
import { ImportExportElement } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class ImportExportService {
  constructor(private readonly http: HttpClient) {}

  importConfiguration(file: File): Observable<unknown> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(API_URLS.IMPORT, formData);
  }

  exportConfiguration(elements: ImportExportElement[]): Observable<Blob> {
    return this.http.post(API_URLS.EXPORT, elements, { responseType: 'blob' });
  }

  importProjectMapping(syncName: string, file: File): Observable<unknown> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(API_URLS.IMPORT_PROJECT_MAPPING(encodeURIComponent(syncName)), formData);
  }
}
