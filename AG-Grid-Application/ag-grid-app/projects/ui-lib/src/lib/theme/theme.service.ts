import { Injectable, signal, computed, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type UiTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private static readonly STORAGE_KEY = 'connect_theme';
  private readonly currentTheme = signal<UiTheme>('light');
  private readonly isBrowser: boolean;

  readonly theme = this.currentTheme.asReadonly();
  readonly isDark = computed(() => this.currentTheme() === 'dark');

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const saved = localStorage.getItem(ThemeService.STORAGE_KEY) as UiTheme | null;
      const initial = saved ?? 'light';
      this.currentTheme.set(initial);
      this.applyTheme(initial);
    }
  }

  setTheme(theme: UiTheme): void {
    this.currentTheme.set(theme);
    this.applyTheme(theme);
    if (this.isBrowser) {
      localStorage.setItem(ThemeService.STORAGE_KEY, theme);
    }
  }

  toggleTheme(): void {
    this.setTheme(this.currentTheme() === 'light' ? 'dark' : 'light');
  }

  private applyTheme(theme: UiTheme): void {
    if (!this.isBrowser) return;
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark');
    body.classList.add(`theme-${theme}`);
  }
}
