import { Component, input, output, signal, ElementRef, inject, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface UiMenuItem {
  labelKey: string;
  icon?: string;
  disabled?: boolean;
  danger?: boolean;
  action: () => void;
}

@Component({
  selector: 'ui-menu',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiMenuComponent {
  readonly items = input<UiMenuItem[]>([]);
  readonly ariaLabel = input<string>('ARIA.MENU');
  readonly closed = output<void>();

  readonly isOpen = signal(false);
  private elRef = inject(ElementRef);

  toggle(): void {
    this.isOpen.update(v => !v);
  }

  close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  onItemClick(item: UiMenuItem): void {
    if (!item.disabled) {
      item.action();
      this.close();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
