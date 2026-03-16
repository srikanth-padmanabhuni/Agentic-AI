import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../theme/theme.service';

@Component({
  selector: 'ui-theme-switcher',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiThemeSwitcherComponent {
  readonly themeService = inject(ThemeService);
}
