import { Component, input, output, computed, inject, effect, signal, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { TranslateModule } from '@ngx-translate/core';
import {
  ColDef, GridApi, GridReadyEvent, RowClickedEvent, SelectionChangedEvent,
  SortChangedEvent, GridOptions, ModuleRegistry, AllCommunityModule,
  FirstDataRenderedEvent, IDetailCellRendererParams, GetDataPath, IsRowMaster,
  RowGroupOpenedEvent
} from 'ag-grid-community';
import { MasterDetailModule, TreeDataModule, RowGroupingModule } from 'ag-grid-enterprise';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AgGridLocaleService } from './ag-grid-locale.service';

ModuleRegistry.registerModules([AllCommunityModule, MasterDetailModule, TreeDataModule, RowGroupingModule]);

@Component({
  selector: 'ui-data-grid',
  standalone: true,
  imports: [CommonModule, AgGridAngular, TranslateModule],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiDataGridComponent implements OnInit, OnDestroy {
  readonly rowData = input<unknown[]>([]);
  readonly columnDefs = input<ColDef[]>([]);
  readonly defaultColDef = input<ColDef>({
    sortable: true,
    resizable: true,
    filter: true,
    minWidth: 100
  });
  readonly pagination = input(true);
  readonly paginationPageSize = input(25);
  readonly paginationPageSizeSelector = input<number[]>([10, 25, 50, 100]);
  readonly rowSelection = input<'single' | 'multiple' | undefined>(undefined);
  readonly gridOptions = input<GridOptions>({});
  readonly quickFilterText = input<string>('');
  readonly domLayout = input<'normal' | 'autoHeight'>('normal');
  readonly gridHeight = input<string>('500px');

  // Master-Detail inputs
  readonly masterDetail = input(false);
  readonly detailCellRendererParams = input<Partial<IDetailCellRendererParams> | undefined>(undefined);
  readonly detailRowHeight = input<number | undefined>(undefined);
  readonly detailRowAutoHeight = input(false);
  readonly isRowMaster = input<IsRowMaster | undefined>(undefined);
  readonly keepDetailRows = input(false);
  readonly keepDetailRowsCount = input<number | undefined>(undefined);
  readonly embedFullWidthRows = input(false);

  // Tree Data inputs
  readonly treeData = input(false);
  readonly getDataPath = input<GetDataPath | undefined>(undefined);
  readonly groupDefaultExpanded = input<number>(0);
  readonly autoGroupColumnDef = input<ColDef | undefined>(undefined);

  readonly rowClicked = output<RowClickedEvent>();
  readonly selectionChanged = output<SelectionChangedEvent>();
  readonly sortChanged = output<SortChangedEvent>();
  readonly gridReady = output<GridReadyEvent>();
  readonly firstDataRendered = output<FirstDataRenderedEvent>();
  readonly rowGroupOpened = output<RowGroupOpenedEvent>();

  private gridApi: GridApi | null = null;
  private readonly gridApiReady = signal<GridApi | null>(null);
  private readonly destroy$ = new Subject<void>();
  private readonly translate = inject(TranslateService);
  private readonly localeService = inject(AgGridLocaleService);

  constructor() {
    effect(() => {
      const data = this.rowData();
      const api = this.gridApiReady();
      api?.setGridOption('rowData', data);
    });
  }

  localeText: Record<string, string> = {};

  readonly translatedColumnDefs = computed(() => {
    return this.columnDefs().map(col => ({
      ...col,
      headerName: col.headerName ? this.translate.instant(col.headerName) : col.headerName
    }));
  });

  ngOnInit(): void {
    this.localeText = this.localeService.getLocaleText();
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.localeText = this.localeService.getLocaleText();
        this.gridApi?.refreshHeader();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.gridApiReady.set(event.api);
    event.api.sizeColumnsToFit();
    this.gridReady.emit(event);
  }

  onRowClicked(event: RowClickedEvent): void {
    this.rowClicked.emit(event);
  }

  onSelectionChanged(event: SelectionChangedEvent): void {
    this.selectionChanged.emit(event);
  }

  onSortChanged(event: SortChangedEvent): void {
    this.sortChanged.emit(event);
  }

  onFirstDataRendered(event: FirstDataRenderedEvent): void {
    this.firstDataRendered.emit(event);
  }

  onRowGroupOpened(event: RowGroupOpenedEvent): void {
    this.rowGroupOpened.emit(event);
  }

  expandAllDetails(): void {
    this.gridApi?.forEachNode(node => node.setExpanded(true));
  }

  collapseAllDetails(): void {
    this.gridApi?.forEachNode(node => node.setExpanded(false));
  }

  exportToCsv(fileName = 'export.csv'): void {
    this.gridApi?.exportDataAsCsv({ fileName });
  }

  setQuickFilter(text: string): void {
    this.gridApi?.setGridOption('quickFilterText', text);
  }

  refreshCells(): void {
    this.gridApi?.refreshCells({ force: true });
  }

  getSelectedRows<T = unknown>(): T[] {
    return this.gridApi?.getSelectedRows() as T[] ?? [];
  }
}
