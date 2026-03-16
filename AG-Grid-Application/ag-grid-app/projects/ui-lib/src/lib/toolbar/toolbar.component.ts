import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ui-toolbar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiToolbarComponent {
  readonly titleKey = input<string>('');
  readonly elevated = input(false);
}
