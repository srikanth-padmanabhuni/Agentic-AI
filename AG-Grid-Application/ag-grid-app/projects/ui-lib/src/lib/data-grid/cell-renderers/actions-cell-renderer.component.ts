import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { UiButtonComponent } from '../../button/button.component';

export interface ActionButton {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'text' | 'icon';
  action: string;
  visible?: (data: unknown) => boolean;
  disabled?: (data: unknown) => boolean;
}

export interface ActionsCellRendererParams extends ICellRendererParams {
  actions: ActionButton[];
  onAction: (action: string, data: unknown) => void;
}

@Component({
  selector: 'ui-actions-cell',
  standalone: true,
  imports: [CommonModule, TranslateModule, UiButtonComponent],
  template: `
    <div class="ui-actions-cell" role="group" [attr.aria-label]="'ARIA.ROW_ACTIONS' | translate">
      @for (action of visibleActions; track action.action) {
        <ui-button
          [labelKey]="action.icon ? '' : action.label"
          [ariaLabel]="action.label"
          [icon]="action.icon ?? ''"
          [variant]="action.icon ? 'icon' : (action.variant ?? 'text')"
          [disabled]="action.disabled ? action.disabled(rowData) : false"
          (clicked)="onAction(action.action)" />
      }
    </div>
  `,
  styles: [`
    .ui-actions-cell {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 100%;
    }
  `]
})
export class ActionsCellRendererComponent implements ICellRendererAngularComp {
  visibleActions: ActionButton[] = [];
  rowData: unknown = null;
  private onActionCallback: ((action: string, data: unknown) => void) | null = null;

  agInit(params: ActionsCellRendererParams): void {
    this.updateValue(params);
  }

  refresh(params: ActionsCellRendererParams): boolean {
    this.updateValue(params);
    return true;
  }

  onAction(action: string): void {
    this.onActionCallback?.(action, this.rowData);
  }

  private updateValue(params: ActionsCellRendererParams): void {
    this.rowData = params.data;
    this.onActionCallback = params.onAction;
    this.visibleActions = (params.actions ?? []).filter(
      a => !a.visible || a.visible(params.data)
    );
  }
}
