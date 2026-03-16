import { Component, signal, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ColDef, RowClickedEvent } from 'ag-grid-community';
import {
  UiDataGridComponent,
  UiButtonComponent,
  UiSearchBarComponent,
  UiSnackbarService
} from 'ui-lib';
import { ConnectionService } from '../../services/connection.service';
import { Connection } from '../../../../shared/models';
import { WebSocketService, WebSocketEvent } from '../../../../core/services/websocket.service';

@Component({
  selector: 'app-connection-list',
  standalone: true,
  imports: [
    TranslateModule,
    UiDataGridComponent,
    UiButtonComponent,
    UiSearchBarComponent
  ],
  templateUrl: './connection-list.component.html',
  styleUrl: './connection-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionListComponent implements OnInit {
  readonly connections = signal<Connection[]>([]);
  readonly searchText = signal('');

  readonly columnDefs: ColDef[] = [
    { field: 'name', headerName: 'CONNECTIONS.NAME', sortable: true, filter: true, flex: 2 },
    { field: 'source', headerName: 'CONNECTIONS.SOURCE', sortable: true, flex: 1 },
    { field: 'target', headerName: 'CONNECTIONS.TARGET', sortable: true, flex: 1 },
    { field: 'unifiedStatus', headerName: 'CONNECTIONS.STATUS', sortable: true, flex: 1 },
    { field: 'lastSyncChanges', headerName: 'CONNECTIONS.LAST_CHANGES', sortable: true, flex: 1 },
    { field: 'server', headerName: 'CONNECTIONS.SERVER', sortable: true, flex: 1 }
  ];

  private readonly cdr = inject(ChangeDetectorRef);

  constructor(
    private readonly connectionService: ConnectionService,
    private readonly webSocketService: WebSocketService,
    private readonly snackbar: UiSnackbarService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadConnections();

    this.webSocketService.on(WebSocketEvent.LAST_SYNC_CHANGES).subscribe(() => {
      this.loadConnections();
    });
  }

  loadConnections(): void {
    this.connectionService.getConnections().subscribe({
      next: data => {
        this.connections.set(data);
        this.cdr.markForCheck();
      },
      error: () => this.snackbar.error('ERRORS.GENERIC')
    });
  }

  onSearch(text: string): void {
    this.searchText.set(text);
  }

  onRowClicked(event: RowClickedEvent): void {
    const connection = event.data as Connection;
    if (connection?.connectId) {
      this.router.navigate(['/connections', connection.connectId]);
    }
  }

  onCreate(): void {
    this.router.navigate(['/connections', 'create']);
  }

  onRun(connection: Connection): void {
    if (connection.connectId) {
      this.connectionService.runConnection(connection.connectId).subscribe({
        next: () => this.snackbar.success('CONNECTIONS.RUN_SUCCESS'),
        error: () => this.snackbar.error('ERRORS.GENERIC')
      });
    }
  }

  onStop(connection: Connection): void {
    if (connection.connectId) {
      this.connectionService.stopConnection(connection.connectId).subscribe({
        next: () => this.snackbar.success('CONNECTIONS.STOP_SUCCESS'),
        error: () => this.snackbar.error('ERRORS.GENERIC')
      });
    }
  }

  onDelete(connection: Connection): void {
    if (connection.connectId) {
      this.connectionService.deleteConnection(connection.connectId).subscribe({
        next: () => {
          this.snackbar.success('CONNECTIONS.DELETE_SUCCESS');
          this.loadConnections();
        },
        error: () => this.snackbar.error('ERRORS.GENERIC')
      });
    }
  }
}
