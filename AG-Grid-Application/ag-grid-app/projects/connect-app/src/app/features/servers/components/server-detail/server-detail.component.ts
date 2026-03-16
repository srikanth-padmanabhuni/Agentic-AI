import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  UiCardComponent,
  UiButtonComponent,
  UiToolbarComponent,
  UiBadgeComponent,
  UiDataGridComponent,
  UiSnackbarService
} from 'ui-lib';
import { ServerService } from '../../services/server.service';
import { JobService } from '../../services/job.service';
import { Server, Job } from '../../../../shared/models';
import type { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-server-detail',
  standalone: true,
  imports: [TranslateModule, UiCardComponent, UiButtonComponent, UiToolbarComponent, UiBadgeComponent, UiDataGridComponent],
  templateUrl: './server-detail.component.html',
  styleUrl: './server-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerDetailComponent implements OnInit {
  readonly server = signal<Server | null>(null);
  readonly jobs = signal<Job[]>([]);

  readonly jobColDefs: ColDef[] = [
    { field: 'syncName', headerName: 'Connection' },
    { field: 'status', headerName: 'Status' },
    { field: 'runType', headerName: 'Run Type' },
    { field: 'timeOfStateChange', headerName: 'Last Change' }
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly serverService: ServerService,
    private readonly jobService: JobService,
    private readonly snackbar: UiSnackbarService
  ) {}

  ngOnInit(): void {
    const guid = this.route.snapshot.paramMap.get('id');
    if (guid) {
      this.serverService.getServer(guid).subscribe({
        next: s => {
          this.server.set(s);
          this.jobService.getJobsAssignedToServer(guid).subscribe(j => this.jobs.set(j));
        },
        error: () => {
          this.snackbar.error('ERRORS.NOT_FOUND');
          this.router.navigate(['/servers']);
        }
      });
    }
  }

  onEdit(): void {
    const s = this.server();
    if (s?.serverGuid) {
      this.router.navigate(['/servers', s.serverGuid, 'edit']);
    }
  }

  onBack(): void {
    this.router.navigate(['/servers']);
  }

  getStatusVariant(): 'success' | 'danger' {
    return this.server()?.status?.toLowerCase() === 'running' ? 'success' : 'danger';
  }
}
