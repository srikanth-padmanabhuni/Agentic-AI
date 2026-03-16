import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API_URLS } from '../../../core/constants/api-urls';
import { Job, JobListResponse } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly jobsSubject = new BehaviorSubject<Job[]>([]);
  readonly jobs$ = this.jobsSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadJobs(): Observable<Job[]> {
    return this.http.get<JobListResponse>(API_URLS.JOBS).pipe(
      map(res => res.Job || []),
      tap(jobs => this.jobsSubject.next(jobs))
    );
  }

  getJob(syncGuid: string): Observable<Job> {
    return this.http.get<Job>(API_URLS.JOB(syncGuid));
  }

  getJobsAssignedToServer(serverGuid: string): Observable<Job[]> {
    return this.http.get<JobListResponse>(API_URLS.JOBS_ASSIGNED_TO_SERVER(serverGuid)).pipe(
      map(res => res.Job || [])
    );
  }

  getUnassignedJobs(): Observable<Job[]> {
    return this.http.get<JobListResponse>(API_URLS.UNASSIGNED_JOBS).pipe(
      map(res => res.Job || [])
    );
  }
}
