import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'ui-status-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="ui-status-badge" [class]="'ui-status-badge--' + statusClass" [attr.aria-label]="value">
      <span class="ui-status-badge__dot" aria-hidden="true"></span>
      {{ value }}
    </span>
  `,
  styles: [`
    .ui-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 2px 8px;
      border-radius: var(--ui-border-radius-full, 9999px);
      font-size: var(--ui-font-size-xs, 0.75rem);
      font-weight: var(--ui-font-weight-medium, 500);
    }
    .ui-status-badge__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .ui-status-badge--success { background: var(--ui-color-success-light, #c8e6c9); color: var(--ui-color-success, #2e7d32); }
    .ui-status-badge--success .ui-status-badge__dot { background: var(--ui-color-success, #2e7d32); }
    .ui-status-badge--error { background: var(--ui-color-danger-light, #ffcdd2); color: var(--ui-color-danger, #d32f2f); }
    .ui-status-badge--error .ui-status-badge__dot { background: var(--ui-color-danger, #d32f2f); }
    .ui-status-badge--warning { background: var(--ui-color-warning-light, #ffe0b2); color: var(--ui-color-warning, #f57c00); }
    .ui-status-badge--warning .ui-status-badge__dot { background: var(--ui-color-warning, #f57c00); }
    .ui-status-badge--info { background: var(--ui-color-info-light, #b3e5fc); color: var(--ui-color-info, #0288d1); }
    .ui-status-badge--info .ui-status-badge__dot { background: var(--ui-color-info, #0288d1); }
    .ui-status-badge--neutral { background: var(--ui-color-surface-variant, #f5f5f5); color: var(--ui-color-on-surface-secondary, #757575); }
    .ui-status-badge--neutral .ui-status-badge__dot { background: var(--ui-color-on-surface-secondary, #757575); }
  `]
})
export class StatusCellRendererComponent implements ICellRendererAngularComp {
  value = '';
  statusClass = 'neutral';

  private static readonly STATUS_MAP: Record<string, string> = {
    running: 'success',
    active: 'success',
    enabled: 'success',
    available: 'success',
    connected: 'success',
    stopped: 'error',
    error: 'error',
    failed: 'error',
    locked: 'error',
    disabled: 'warning',
    inactive: 'warning',
    pending: 'info',
    syncing: 'info'
  };

  agInit(params: ICellRendererParams): void {
    this.updateValue(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.updateValue(params);
    return true;
  }

  private updateValue(params: ICellRendererParams): void {
    this.value = params.value ?? '';
    const lower = this.value.toLowerCase();
    this.statusClass = StatusCellRendererComponent.STATUS_MAP[lower] ?? 'neutral';
  }
}
