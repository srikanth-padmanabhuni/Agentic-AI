import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ui-chip',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiChipComponent {
  readonly labelKey = input.required<string>();
  readonly removable = input(false);
  readonly color = input<'default' | 'primary' | 'success' | 'warning' | 'danger'>('default');
  readonly removed = output<void>();

  onRemove(event: Event): void {
    event.stopPropagation();
    this.removed.emit();
  }
}
