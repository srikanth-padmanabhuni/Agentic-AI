import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'ui-date-cell',
  standalone: true,
  template: `<span [attr.aria-label]="formattedDate">{{ formattedDate }}</span>`,
  styles: [`
    :host { display: flex; align-items: center; height: 100%; }
  `]
})
export class DateCellRendererComponent implements ICellRendererAngularComp {
  formattedDate = '';

  agInit(params: ICellRendererParams): void {
    this.updateValue(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.updateValue(params);
    return true;
  }

  private updateValue(params: ICellRendererParams): void {
    const value = params.value;
    if (!value) {
      this.formattedDate = '—';
      return;
    }
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) {
      this.formattedDate = String(value);
      return;
    }
    this.formattedDate = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
