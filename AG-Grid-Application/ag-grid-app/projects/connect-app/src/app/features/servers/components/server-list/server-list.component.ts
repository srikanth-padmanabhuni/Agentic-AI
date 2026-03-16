import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import {
  UiButtonComponent,
  UiExpansionPanelComponent,
  UiBadgeComponent,
  UiDataGridComponent,
  UiSnackbarService
} from 'ui-lib';
import { ServerService } from '../../services/server.service';
import { JobService } from '../../services/job.service';
import { WebSocketService } from '../../../../core/services/websocket.service';
import { Server, Job } from '../../../../shared/models';
import type { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-server-list',
  standalone: true,
  imports: [
    TranslateModule,
    UiButtonComponent,
    UiExpansionPanelComponent,
    UiBadgeComponent,
    UiDataGridComponent
  ],
  templateUrl: './server-list.component.html',
  styleUrl: './server-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerListComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  readonly servers = signal<Server[]>([]);
  readonly unassignedJobs = signal<Job[]>([]);
  readonly serverJobs = signal<Map<string, Job[]>>(new Map());
  readonly expandedAll = signal(false);

  readonly jobColDefs: ColDef[] = [
    { field: 'syncName', headerName: 'Connection' },
    { field: 'status', headerName: 'Status' },
    { field: 'unifiedStatus', headerName: 'Unified Status' },
    { field: 'runType', headerName: 'Run Type' },
    { field: 'timeOfStateChange', headerName: 'Last Change' },
    { field: 'server', headerName: 'Server' }
  ];

  constructor(
    private readonly serverService: ServerService,
    private readonly jobService: JobService,
    private readonly wsService: WebSocketService,
    private readonly snackbar: UiSnackbarService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.wsService.onAny()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadData());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.serverService.loadServers().subscribe(servers => {
      this.servers.set(servers);
      servers.forEach(s => {
        if (s.serverGuid) {
          this.jobService.getJobsAssignedToServer(s.serverGuid).subscribe(jobs => {
            const map = new Map(this.serverJobs());
            map.set(s.serverGuid!, jobs);
            this.serverJobs.set(map);
          });
        }
      });
    });
    this.jobService.getUnassignedJobs().subscribe(jobs => this.unassignedJobs.set(jobs));
  }

  onStopForUpgrade(): void {
    this.serverService.stopServersForUpgrade().subscribe({
      next: () => this.snackbar.success('SERVERS.SHUTDOWN_SUCCESS'),
      error: () => this.snackbar.error('SERVERS.SHUTDOWN_FAILED')
    });
  }

  onDeleteServer(server: Server): void {
    if (server.serverGuid) {
      this.serverService.deleteServer(server.serverGuid).subscribe({
        next: () => this.snackbar.success('SERVERS.DELETE_SUCCESS'),
        error: () => this.snackbar.error('ERRORS.GENERIC')
      });
    }
  }

  toggleExpandAll(): void {
    this.expandedAll.update(v => !v);
  }

  getJobsForServer(serverGuid: string): Job[] {
    return this.serverJobs().get(serverGuid) ?? [];
  }

  getStatusVariant(server: Server): 'success' | 'danger' {
    return server.status?.toLowerCase() === 'running' ? 'success' : 'danger';
  }
}
