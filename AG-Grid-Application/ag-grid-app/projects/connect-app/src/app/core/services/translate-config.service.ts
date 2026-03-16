import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

@Injectable({ providedIn: 'root' })
export class TranslateConfigService {
  readonly availableLanguages: LanguageOption[] = [
    { code: 'en', label: 'English', flag: '\u{1F1FA}\u{1F1F8}' },
    { code: 'ru', label: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439', flag: '\u{1F1F7}\u{1F1FA}' },
    { code: 'uk', label: '\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430', flag: '\u{1F1FA}\u{1F1E6}' },
    { code: 'be', label: '\u0411\u0435\u043B\u0430\u0440\u0443\u0441\u043A\u0430\u044F', flag: '\u{1F1E7}\u{1F1FE}' }
  ];

  private readonly storageKey = 'connect_language';

  constructor(private readonly translate: TranslateService) {}

  initialize(): void {
    const langCodes = this.availableLanguages.map(l => l.code);
    this.translate.addLangs(langCodes);
    this.translate.setDefaultLang('en');

    const savedLang = localStorage.getItem(this.storageKey);
    const browserLang = this.translate.getBrowserLang();
    const langToUse = savedLang ?? (langCodes.includes(browserLang ?? '') ? browserLang! : 'en');

    this.translate.use(langToUse);
  }

  switchLanguage(langCode: string): void {
    this.translate.use(langCode);
    localStorage.setItem(this.storageKey, langCode);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || 'en';
  }

  getCurrentLanguageOption(): LanguageOption {
    return this.availableLanguages.find(l => l.code === this.getCurrentLanguage())
      ?? this.availableLanguages[0];
  }
}
