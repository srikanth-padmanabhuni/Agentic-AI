import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class AgGridLocaleService {
  private readonly translate = inject(TranslateService);

  getLocaleText(): Record<string, string> {
    const t = (key: string) => this.translate.instant(key);
    return {
      page: t('UI_LIB.GRID.PAGE'),
      of: t('UI_LIB.GRID.OF'),
      to: t('UI_LIB.GRID.TO'),
      more: t('UI_LIB.GRID.MORE'),
      next: t('UI_LIB.GRID.NEXT'),
      previous: t('UI_LIB.GRID.PREVIOUS'),
      first: t('UI_LIB.GRID.FIRST'),
      last: t('UI_LIB.GRID.LAST'),
      loadingOoo: t('UI_LIB.GRID.LOADING'),
      noRowsToShow: t('UI_LIB.GRID.NO_ROWS'),
      filterOoo: t('UI_LIB.GRID.FILTER'),
      equals: t('UI_LIB.GRID.EQUALS'),
      notEqual: t('UI_LIB.GRID.NOT_EQUAL'),
      contains: t('UI_LIB.GRID.CONTAINS'),
      notContains: t('UI_LIB.GRID.NOT_CONTAINS'),
      startsWith: t('UI_LIB.GRID.STARTS_WITH'),
      endsWith: t('UI_LIB.GRID.ENDS_WITH'),
      lessThan: t('UI_LIB.GRID.LESS_THAN'),
      greaterThan: t('UI_LIB.GRID.GREATER_THAN'),
      searchOoo: t('UI_LIB.GRID.SEARCH'),
      selectAll: t('UI_LIB.GRID.SELECT_ALL'),
      blanks: t('UI_LIB.GRID.BLANKS'),
      notBlank: t('UI_LIB.GRID.NOT_BLANK'),
      applyFilter: t('UI_LIB.GRID.APPLY_FILTER'),
      resetFilter: t('UI_LIB.GRID.RESET_FILTER'),
      clearFilter: t('UI_LIB.GRID.CLEAR_FILTER'),
      columns: t('UI_LIB.GRID.COLUMNS'),
      export: t('UI_LIB.GRID.EXPORT'),
      csvExport: t('UI_LIB.GRID.CSV_EXPORT'),
      excelExport: t('UI_LIB.GRID.EXCEL_EXPORT'),
      pinColumn: t('UI_LIB.GRID.PIN_COLUMN'),
      pinLeft: t('UI_LIB.GRID.PIN_LEFT'),
      pinRight: t('UI_LIB.GRID.PIN_RIGHT'),
      noPin: t('UI_LIB.GRID.NO_PIN'),
      autosizeThisColumn: t('UI_LIB.GRID.AUTOSIZE_COLUMN'),
      autosizeAllColumns: t('UI_LIB.GRID.AUTOSIZE_ALL'),
      resetColumns: t('UI_LIB.GRID.RESET_COLUMNS'),
      copy: t('UI_LIB.GRID.COPY'),
      copyWithHeaders: t('UI_LIB.GRID.COPY_WITH_HEADERS'),
      paste: t('UI_LIB.GRID.PASTE'),
      rowGroupColumnsEmptyMessage: t('UI_LIB.GRID.ROW_GROUP_EMPTY'),
      valueColumnsEmptyMessage: t('UI_LIB.GRID.VALUE_COLUMNS_EMPTY'),
      pivotMode: t('UI_LIB.GRID.PIVOT_MODE'),
      ariaFilterInput: t('UI_LIB.GRID.ARIA_FILTER_INPUT'),
      ariaPageSizeSelectorLabel: t('UI_LIB.GRID.ARIA_PAGE_SIZE')
    };
  }
}
