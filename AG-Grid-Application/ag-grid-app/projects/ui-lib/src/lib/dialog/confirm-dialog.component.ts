import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DialogRef } from './dialog.service';
import { UiButtonComponent } from '../button/button.component';

export interface ConfirmDialogData {
  titleKey: string;
  messageKey: string;
  confirmKey?: string;
  cancelKey?: string;
  variant?: 'danger' | 'primary';
}

@Component({
  selector: 'ui-confirm-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule, UiButtonComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiConfirmDialogComponent {
  data!: ConfirmDialogData;
  dialogRef!: DialogRef<boolean>;

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
