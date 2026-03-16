import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ui-search-bar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiSearchBarComponent {
  readonly placeholderKey = input<string>('COMMON.SEARCH');
  readonly ariaLabel = input<string>('ARIA.SEARCH');
  readonly debounceMs = input(300);
  readonly searchChanged = output<string>();

  readonly query = signal('');
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.searchChanged.emit(value);
    }, this.debounceMs());
  }

  clear(): void {
    this.query.set('');
    this.searchChanged.emit('');
  }
}
