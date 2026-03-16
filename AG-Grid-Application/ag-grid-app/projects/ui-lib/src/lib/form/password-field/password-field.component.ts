import { Component, input, forwardRef, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ui-password-field',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './password-field.component.html',
  styleUrl: './password-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiPasswordFieldComponent), multi: true }
  ]
})
export class UiPasswordFieldComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly ariaLabel = input<string>('');
  readonly required = input(false);
  readonly errors = input<Record<string, unknown> | null>(null);
  readonly errorMessages = input<Record<string, string>>({});

  readonly value = signal('');
  readonly visible = signal(false);
  readonly touched = signal(false);
  readonly isDisabled = signal(false);
  readonly errorKeys = computed(() => Object.keys(this.errors() ?? {}));

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string): void { this.value.set(val ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.isDisabled.set(d); }

  onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChange(v);
  }

  onBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }

  toggleVisibility(): void {
    this.visible.update(v => !v);
  }
}
