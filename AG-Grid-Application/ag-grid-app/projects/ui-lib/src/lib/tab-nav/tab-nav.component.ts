import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

export interface UiTabItem {
  labelKey: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'ui-tab-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './tab-nav.component.html',
  styleUrl: './tab-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiTabNavComponent {
  readonly tabs = input<UiTabItem[]>([]);
  readonly ariaLabel = input<string>('ARIA.TAB_NAVIGATION');
}
