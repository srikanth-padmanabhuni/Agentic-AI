import { Component, input, model, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ui-expansion-panel',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiExpansionPanelComponent {
  readonly titleKey = input.required<string>();
  readonly subtitleKey = input<string>('');
  readonly expanded = model(false);

  toggle(): void {
    this.expanded.update(v => !v);
  }
}
