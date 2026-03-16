import { Component, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  UiButtonComponent,
  UiSearchBarComponent,
  UiDataGridComponent,
  UiSnackbarService
} from 'ui-lib';
import { DataSourceService } from '../../services/datasource.service';
import { PermissionsService } from '../../../../core/services/permissions.service';
import { DataSource } from '../../../../shared/models';
import { UserPermission } from '../../../../shared/enums';
import type { ColDef, RowClickedEvent } from 'ag-grid-community';

@Component({
  selector: 'app-datasource-list',
  standalone: true,
  imports: [TranslateModule, UiButtonComponent, UiSearchBarComponent, UiDataGridComponent],
  templateUrl: './datasource-list.component.html',
  styleUrl: './datasource-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatasourceListComponent implements OnInit {
  readonly dataSources = signal<DataSource[]>([]);
  readonly filteredDataSources = signal<DataSource[]>([]);
  readonly searchText = signal('');

  readonly canCreate = computed(() => this.permissions.hasPermission(UserPermission.CREATE_DATASOURCE));

  readonly colDefs: ColDef[] = [
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'product', headerName: 'Product', sortable: true, filter: true },
    { field: 'productDisplayName', headerName: 'Display Name', sortable: true },
    { field: 'contextType', headerName: 'Context', sortable: true }
  ];

  constructor(
    private readonly dsService: DataSourceService,
    private readonly permissions: PermissionsService,
    private readonly router: Router,
    private readonly snackbar: UiSnackbarService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dsService.loadDataSources().subscribe(ds => {
      this.dataSources.set(ds);
      this.applyFilter();
    });
  }

  onSearch(text: string): void {
    this.searchText.set(text);
    this.applyFilter();
  }

  onRowClicked(event: RowClickedEvent): void {
    const ds = event.data as DataSource;
    if (ds?.connectId) {
      this.router.navigate(['/datasources', ds.connectId]);
    }
  }

  onCreate(): void {
    this.router.navigate(['/datasources', 'create']);
  }

  private applyFilter(): void {
    const text = this.searchText().toLowerCase();
    if (!text) {
      this.filteredDataSources.set(this.dataSources());
      return;
    }
    this.filteredDataSources.set(this.dataSources().filter(ds =>
      ds.name?.toLowerCase().includes(text) || ds.product?.toLowerCase().includes(text)
    ));
  }
}
