import { Component, input, forwardRef, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

export interface UiRadioOption {
  value: string;
  labelKey: string;
  disabled?: boolean;
}

@Component({
  selector: 'ui-radio',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiRadioComponent), multi: true }
  ]
})
export class UiRadioComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly ariaLabel = input<string>('');
  readonly name = input<string>('radio-group');
  readonly options = input<UiRadioOption[]>([]);
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');

  readonly value = signal<string>('');
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

  select(optionValue: string): void {
    if (this.isDisabled()) return;
    this.value.set(optionValue);
    this.onChange(optionValue);
    this.onTouched();
  }
}
