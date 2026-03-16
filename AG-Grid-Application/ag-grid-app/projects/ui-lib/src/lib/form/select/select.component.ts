import { Component, input, forwardRef, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

export interface UiSelectOption {
  value: string;
  labelKey: string;
}

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSelectComponent), multi: true }
  ]
})
export class UiSelectComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly ariaLabel = input<string>('');
  readonly options = input<UiSelectOption[]>([]);
  readonly placeholder = input<string>('');
  readonly required = input(false);
  readonly errors = input<Record<string, unknown> | null>(null);
  readonly errorMessages = input<Record<string, string>>({});

  readonly value = signal<string>('');
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

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }

  onBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }
}
