import { Component, input, output, forwardRef, signal, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ui-inline-edit',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './inline-edit.component.html',
  styleUrl: './inline-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiInlineEditComponent), multi: true }
  ]
})
export class UiInlineEditComponent implements ControlValueAccessor {
  readonly ariaLabel = input<string>('ARIA.INLINE_EDIT');
  readonly initialValue = input<string>('', { alias: 'value' });
  readonly saved = output<string>();

  readonly value = signal('');
  readonly editing = signal(false);
  readonly editValue = signal('');
  readonly isDisabled = signal(false);

  constructor() {
    effect(() => {
      const v = this.initialValue();
      if (v !== undefined) this.value.set(v);
    });
  }

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string): void { this.value.set(val ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.isDisabled.set(d); }

  startEdit(): void {
    if (this.isDisabled()) return;
    this.editValue.set(this.value());
    this.editing.set(true);
  }

  save(): void {
    const val = this.editValue();
    this.value.set(val);
    this.editing.set(false);
    this.onChange(val);
    this.onTouched();
    this.saved.emit(val);
  }

  cancel(): void {
    this.editing.set(false);
  }

  onInputChange(event: Event): void {
    this.editValue.set((event.target as HTMLInputElement).value);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') { this.save(); }
    if (event.key === 'Escape') { this.cancel(); }
  }
}
