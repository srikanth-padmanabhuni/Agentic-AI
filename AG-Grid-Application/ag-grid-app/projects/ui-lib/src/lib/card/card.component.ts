import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiCardComponent {
  readonly titleKey = input<string>('');
  readonly subtitleKey = input<string>('');
  readonly elevated = input(true);
  readonly padding = input(true);
}
