import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  UiButtonComponent,
  UiCardComponent,
  UiProgressBarComponent,
  UiSnackbarService
} from 'ui-lib';
import { ImportExportService } from '../../services/import-export.service';
import { ConnectionService } from '../../../connections/services/connection.service';
import { ServerService } from '../../../servers/services/server.service';
import { DataSourceService } from '../../../datasources/services/datasource.service';
import { UserService } from '../../../users/services/user.service';
import { Connection, Server, DataSource, User, ImportResult, ImportMessage } from '../../../../shared/models';

@Component({
  selector: 'app-import-export-panel',
  standalone: true,
  imports: [TranslateModule, UiButtonComponent, UiCardComponent, UiProgressBarComponent],
  templateUrl: './import-export-panel.component.html',
  styleUrl: './import-export-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportExportPanelComponent implements OnInit {
  readonly connections = signal<Connection[]>([]);
  readonly servers = signal<Server[]>([]);
  readonly dataSources = signal<DataSource[]>([]);
  readonly users = signal<User[]>([]);

  readonly selectedConnections = signal<Set<string>>(new Set());
  readonly selectedServers = signal<Set<string>>(new Set());
  readonly selectedDataSources = signal<Set<string>>(new Set());
  readonly selectedUsers = signal<Set<string>>(new Set());

  readonly isExporting = signal(false);
  readonly isImporting = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly importResult = signal<ImportResult | null>(null);
  readonly importMessages = signal<ImportMessage[]>([]);

  constructor(
    private readonly importExportService: ImportExportService,
    private readonly connectionService: ConnectionService,
    private readonly serverService: ServerService,
    private readonly dsService: DataSourceService,
    private readonly userService: UserService,
    private readonly snackbar: UiSnackbarService
  ) {}

  ngOnInit(): void {
    this.connectionService.getConnections().subscribe(c => this.connections.set(c));
    this.serverService.loadServers().subscribe(s => this.servers.set(s));
    this.dsService.loadDataSources().subscribe(d => this.dataSources.set(d));
    this.userService.loadUsers().subscribe(u => this.users.set(u));
  }

  toggleConnection(id: string, checked: boolean): void {
    const set = new Set(this.selectedConnections());
    checked ? set.add(id) : set.delete(id);
    this.selectedConnections.set(set);
  }

  toggleServer(id: string, checked: boolean): void {
    const set = new Set(this.selectedServers());
    checked ? set.add(id) : set.delete(id);
    this.selectedServers.set(set);
  }

  toggleDataSource(id: string, checked: boolean): void {
    const set = new Set(this.selectedDataSources());
    checked ? set.add(id) : set.delete(id);
    this.selectedDataSources.set(set);
  }

  toggleUser(id: string, checked: boolean): void {
    const set = new Set(this.selectedUsers());
    checked ? set.add(id) : set.delete(id);
    this.selectedUsers.set(set);
  }

  get hasSelections(): boolean {
    return this.selectedConnections().size > 0 ||
           this.selectedServers().size > 0 ||
           this.selectedDataSources().size > 0 ||
           this.selectedUsers().size > 0;
  }

  onExport(): void {
    const elements = [
      ...Array.from(this.selectedConnections()).map(id => ({ name: id, type: 'connection', selected: true })),
      ...Array.from(this.selectedServers()).map(id => ({ name: id, type: 'server', selected: true })),
      ...Array.from(this.selectedDataSources()).map(id => ({ name: id, type: 'dataSource', selected: true })),
      ...Array.from(this.selectedUsers()).map(id => ({ name: id, type: 'user', selected: true }))
    ];

    this.isExporting.set(true);
    this.importExportService.exportConfiguration(elements).subscribe({
      next: (blob) => {
        this.isExporting.set(false);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Connect.xml';
        a.click();
        URL.revokeObjectURL(url);
        this.snackbar.success('IMPORT_EXPORT.EXPORT_SUCCESS');
      },
      error: () => {
        this.isExporting.set(false);
        this.snackbar.error('IMPORT_EXPORT.EXPORT_FAILED');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  onImport(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.isImporting.set(true);
    this.importExportService.importConfiguration(file).subscribe({
      next: (result) => {
        this.isImporting.set(false);
        const importRes = result as ImportResult;
        this.importResult.set(importRes);
        this.importMessages.set(importRes?.importMessages ?? []);
        this.snackbar.success('IMPORT_EXPORT.IMPORT_SUCCESS');
      },
      error: () => {
        this.isImporting.set(false);
        this.snackbar.error('IMPORT_EXPORT.IMPORT_FAILED');
      }
    });
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'ERROR': return 'msg-error';
      case 'WARNING': return 'msg-warning';
      default: return 'msg-info';
    }
  }
}
