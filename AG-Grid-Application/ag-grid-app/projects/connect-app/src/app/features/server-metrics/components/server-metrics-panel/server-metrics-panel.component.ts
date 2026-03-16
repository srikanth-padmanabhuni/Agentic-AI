import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  UiButtonComponent,
  UiDataGridComponent
} from 'ui-lib';
import { ServerMetricsService } from '../../services/server-metrics.service';
import { ServerMetrics } from '../../../../shared/models';
import type { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-server-metrics-panel',
  standalone: true,
  imports: [TranslateModule, UiButtonComponent, UiDataGridComponent],
  templateUrl: './server-metrics-panel.component.html',
  styleUrl: './server-metrics-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerMetricsPanelComponent implements OnInit {
  readonly metrics = signal<ServerMetrics[]>([]);

  readonly colDefs: ColDef[] = [
    { field: 'serverGuid', headerName: 'Server', sortable: true, filter: true },
    { field: 'timestamp', headerName: 'Timestamp', sortable: true },
    { field: 'processCpuUsage', headerName: 'Process CPU', sortable: true },
    { field: 'systemCpuUsage', headerName: 'System CPU', sortable: true },
    { field: 'ramUsage', headerName: 'RAM', sortable: true },
    { field: 'diskUsage', headerName: 'Disk', sortable: true },
    { field: 'jvmUsage', headerName: 'JVM', sortable: true }
  ];

  constructor(private readonly metricsService: ServerMetricsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.metricsService.loadMetrics().subscribe(m => this.metrics.set(m));
  }
}
