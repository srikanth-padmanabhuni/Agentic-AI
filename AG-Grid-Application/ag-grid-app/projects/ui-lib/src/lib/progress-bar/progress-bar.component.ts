import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ui-progress-bar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiProgressBarComponent {
  readonly value = input(0);
  readonly indeterminate = input(false);
  readonly ariaLabel = input<string>('ARIA.PROGRESS');
}
