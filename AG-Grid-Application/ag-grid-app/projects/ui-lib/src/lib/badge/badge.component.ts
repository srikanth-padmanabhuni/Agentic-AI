import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <span class="ui-badge" [class]="'ui-badge--' + color()">
      {{ labelKey() | translate }}
    </span>
  `,
  styles: [`
    .ui-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 999px;
      font-family: var(--ui-font-family);
      font-size: var(--ui-font-size-xs);
      font-weight: var(--ui-font-weight-semibold);
      line-height: 1.4;
      white-space: nowrap;

    }
    .ui-badge--default { background: var(--ui-color-surface-variant); color: var(--ui-color-on-surface); }
    .ui-badge--primary { background: var(--ui-color-primary); color: var(--ui-color-primary-contrast); }
    .ui-badge--success { background: var(--ui-color-success); color: #fff; }
    .ui-badge--warning { background: var(--ui-color-warning); color: #000; }
    .ui-badge--danger { background: var(--ui-color-danger); color: #fff;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiBadgeComponent {
  readonly labelKey = input.required<string>();
  readonly color = input<'default' | 'primary' | 'success' | 'warning' | 'danger'>('default');
}
