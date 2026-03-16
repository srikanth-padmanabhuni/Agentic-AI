import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export type UiButtonVariant = 'primary' | 'secondary' | 'danger' | 'text' | 'icon';
export type UiButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiButtonComponent {
  readonly labelKey = input<string>('');
  readonly ariaLabel = input<string>('');
  readonly icon = input<string>('');
  readonly variant = input<UiButtonVariant>('primary');
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly type = input<UiButtonType>('button');

  readonly clicked = output<MouseEvent>();

  readonly isDisabled = computed(() => this.disabled() || this.loading());
  readonly iconOnly = computed(() => this.variant() === 'icon' || (!this.labelKey() && !!this.icon()));

  onClick(event: MouseEvent): void {
    if (!this.isDisabled()) {
      this.clicked.emit(event);
    }
  }
}
