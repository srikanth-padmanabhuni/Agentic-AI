import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ui-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiLanguageSwitcherComponent {
  private translate = inject(TranslateService);

  readonly languages: { code: string; labelKey: string }[] = [
    { code: 'en', labelKey: 'COMMON.LANG_EN' },
    { code: 'ru', labelKey: 'COMMON.LANG_RU' },
    { code: 'uk', labelKey: 'COMMON.LANG_UK' },
    { code: 'be', labelKey: 'COMMON.LANG_BE' }
  ];

  get currentLang(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'en';
  }

  switchLang(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('connect_lang', lang);
  }
}
