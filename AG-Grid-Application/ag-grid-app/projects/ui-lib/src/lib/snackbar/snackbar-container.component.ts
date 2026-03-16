import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UiSnackbarService } from './snackbar.service';

@Component({
  selector: 'ui-snackbar-container',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './snackbar-container.component.html',
  styleUrl: './snackbar-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiSnackbarContainerComponent {
  readonly snackbarService = inject(UiSnackbarService);
}
