import { Component, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  UiCardComponent,
  UiButtonComponent,
  UiToolbarComponent,
  UiChipComponent,
  UiBadgeComponent,
  UiExpansionPanelComponent,
  UiSnackbarService
} from 'ui-lib';
import { ConnectionService } from '../../services/connection.service';
import { ChartService } from '../../../../core/services/chart.service';
import { Connection } from '../../../../shared/models';

@Component({
  selector: 'app-connection-detail',
  standalone: true,
  imports: [
    TranslateModule,
    UiCardComponent,
    UiButtonComponent,
    UiToolbarComponent,
    UiChipComponent,
    UiBadgeComponent,
    UiExpansionPanelComponent
  ],
  templateUrl: './connection-detail.component.html',
  styleUrl: './connection-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionDetailComponent implements OnInit {
  readonly connection = signal<Connection | null>(null);
  readonly loading = signal(true);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly connectionService: ConnectionService,
    private readonly chartService: ChartService,
    private readonly snackbar: UiSnackbarService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.connectionService.getConnection(id).subscribe({
        next: conn => {
          this.connection.set(conn);
          this.loading.set(false);
        },
        error: () => {
          this.snackbar.error('ERRORS.NOT_FOUND');
          this.router.navigate(['/connections']);
        }
      });
    }
  }

  onEdit(): void {
    const conn = this.connection();
    if (conn?.connectId) {
      this.router.navigate(['/connections', conn.connectId, 'edit']);
    }
  }

  onRun(): void {
    const conn = this.connection();
    if (conn?.connectId) {
      this.connectionService.runConnection(conn.connectId).subscribe({
        next: () => this.snackbar.success('CONNECTIONS.RUN_SUCCESS'),
        error: () => this.snackbar.error('ERRORS.GENERIC')
      });
    }
  }

  onStop(): void {
    const conn = this.connection();
    if (conn?.connectId) {
      this.connectionService.stopConnection(conn.connectId).subscribe({
        next: () => this.snackbar.success('CONNECTIONS.STOP_SUCCESS'),
        error: () => this.snackbar.error('ERRORS.GENERIC')
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/connections']);
  }
}
