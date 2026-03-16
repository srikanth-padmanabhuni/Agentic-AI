import {
  Component, input, output, forwardRef, signal, computed,
  ChangeDetectionStrategy, ElementRef, ViewChild, OnDestroy, OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export interface UiDropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface UiDropdownLazyLoadEvent {
  query: string;
  offset: number;
  limit: number;
}

@Component({
  selector: 'ui-dropdown',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown)': 'onDocumentKeydown($event)',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiDropdownComponent), multi: true }
  ]
})
export class UiDropdownComponent implements ControlValueAccessor, OnInit, OnDestroy {
  readonly label = input<string>('');
  readonly ariaLabel = input<string>('');
  readonly placeholder = input<string>('');
  readonly options = input<UiDropdownOption[]>([]);
  readonly searchable = input(true);
  readonly searchPlaceholder = input<string>('Search…');
  readonly required = input(false);
  readonly multiple = input(false);
  readonly lazyLoad = input(false);
  readonly lazyPageSize = input(20);
  readonly loading = input(false);
  readonly noResultsText = input<string>('No results found');
  readonly errors = input<Record<string, unknown> | null>(null);
  readonly errorMessages = input<Record<string, string>>({});

  /** Emitted when lazy loading should fetch more items. */
  readonly lazyLoadRequest = output<UiDropdownLazyLoadEvent>();

  readonly isOpen = signal(false);
  readonly searchQuery = signal('');
  readonly selectedValue = signal<string>('');
  readonly selectedValues = signal<string[]>([]);
  readonly isDisabled = signal(false);
  readonly touched = signal(false);
  readonly highlightedIndex = signal(-1);

  private readonly destroy$ = new Subject<void>();
  private readonly searchSubject = new Subject<string>();
  private lazyOffset = 0;

  @ViewChild('listbox') listboxRef!: ElementRef<HTMLElement>;

  readonly filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const opts = this.options();
    if (!query || this.lazyLoad()) return opts;
    return opts.filter(o => o.label.toLowerCase().includes(query));
  });

  readonly displayValue = computed(() => {
    if (this.multiple()) {
      const vals = this.selectedValues();
      const opts = this.options();
      const labels = vals
        .map(v => opts.find(o => o.value === v)?.label)
        .filter(Boolean);
      return labels.join(', ');
    }
    const val = this.selectedValue();
    if (!val) return '';
    const opt = this.options().find(o => o.value === val);
    return opt?.label ?? val;
  });

  private onChange: (value: string | string[]) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe(query => {
      if (this.lazyLoad()) {
        this.lazyOffset = 0;
        this.lazyLoadRequest.emit({ query, offset: 0, limit: this.lazyPageSize() });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(val: string | string[]): void {
    if (this.multiple()) {
      this.selectedValues.set(Array.isArray(val) ? val : []);
    } else {
      this.selectedValue.set((val as string) ?? '');
    }
  }

  registerOnChange(fn: (value: string | string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  toggleDropdown(): void {
    if (this.isDisabled()) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    this.isOpen.set(true);
    this.searchQuery.set('');
    this.highlightedIndex.set(-1);
    if (this.lazyLoad()) {
      this.lazyOffset = 0;
      this.lazyLoadRequest.emit({ query: '', offset: 0, limit: this.lazyPageSize() });
    }
  }

  close(): void {
    this.isOpen.set(false);
    this.searchQuery.set('');
    this.touched.set(true);
    this.onTouched();
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.highlightedIndex.set(-1);
    this.searchSubject.next(value);
  }

  selectOption(opt: UiDropdownOption): void {
    if (opt.disabled) return;
    if (this.multiple()) {
      const current = this.selectedValues();
      const idx = current.indexOf(opt.value);
      const next = idx >= 0
        ? current.filter(v => v !== opt.value)
        : [...current, opt.value];
      this.selectedValues.set(next);
      this.onChange(next);
    } else {
      this.selectedValue.set(opt.value);
      this.onChange(opt.value);
      this.close();
    }
  }

  isSelected(value: string): boolean {
    if (this.multiple()) {
      return this.selectedValues().includes(value);
    }
    return this.selectedValue() === value;
  }

  onListboxScroll(event: Event): void {
    if (!this.lazyLoad()) return;
    const el = event.target as HTMLElement;
    const threshold = 50;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < threshold) {
      this.loadMore();
    }
  }

  loadMore(): void {
    this.lazyOffset += this.lazyPageSize();
    this.lazyLoadRequest.emit({
      query: this.searchQuery(),
      offset: this.lazyOffset,
      limit: this.lazyPageSize(),
    });
  }

  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('ui-dropdown')) {
      this.close();
    }
  }

  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) return;
    const opts = this.filteredOptions();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex.update(i => Math.min(i + 1, opts.length - 1));
        this.scrollToHighlighted();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex.update(i => Math.max(i - 1, 0));
        this.scrollToHighlighted();
        break;
      case 'Enter':
        event.preventDefault();
        if (this.highlightedIndex() >= 0 && this.highlightedIndex() < opts.length) {
          this.selectOption(opts[this.highlightedIndex()]);
        }
        break;
      case 'Escape':
        this.close();
        break;
    }
  }

  removeValue(val: string, event: Event): void {
    event.stopPropagation();
    const next = this.selectedValues().filter(v => v !== val);
    this.selectedValues.set(next);
    this.onChange(next);
  }

  getOptionLabel(val: string): string {
    return this.options().find(o => o.value === val)?.label ?? val;
  }

  private scrollToHighlighted(): void {
    requestAnimationFrame(() => {
      const list = this.listboxRef?.nativeElement;
      if (!list) return;
      const item = list.querySelector('.ui-dropdown__option--highlighted');
      item?.scrollIntoView({ block: 'nearest' });
    });
  }
}
