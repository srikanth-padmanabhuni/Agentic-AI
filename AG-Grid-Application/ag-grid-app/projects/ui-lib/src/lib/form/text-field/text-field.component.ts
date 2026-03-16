import { Component, input, forwardRef, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ui-text-field',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, FormsModule],
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiTextFieldComponent), multi: true }
  ]
})
export class UiTextFieldComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly ariaLabel = input<string>('');
  readonly type = input<string>('text');
  readonly errorMessages = input<Record<string, string>>({});
  readonly hint = input<string>('');
  readonly required = input(false);
  readonly readonly = input(false);
  readonly autocomplete = input<string>('off');
  readonly errors = input<Record<string, unknown> | null>(null);

  readonly value = signal('');
  readonly touched = signal(false);
  readonly isDisabled = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.value.set(val ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }

  onBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }

  get firstErrorKey(): string | null {
    const errs = this.errors();
    if (!errs) return null;
    const keys = Object.keys(errs);
    return keys.length > 0 ? keys[0] : null;
  }

  get firstErrorTranslationKey(): string {
    const key = this.firstErrorKey;
    if (!key) return '';
    const map = this.errorMessages();
    return map[key] ?? `UI_LIB.FORM.${key.toUpperCase()}`;
  }
}
