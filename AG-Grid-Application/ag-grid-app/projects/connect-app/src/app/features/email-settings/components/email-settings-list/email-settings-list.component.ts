import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  UiButtonComponent,
  UiDataGridComponent
} from 'ui-lib';
import { EmailSettingsService } from '../../services/email-settings.service';
import { EmailSettingsConnection } from '../../../../shared/models';
import type { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-email-settings-list',
  standalone: true,
  imports: [TranslateModule, UiButtonComponent, UiDataGridComponent],
  templateUrl: './email-settings-list.component.html',
  styleUrl: './email-settings-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailSettingsListComponent implements OnInit {
  readonly settings = signal<EmailSettingsConnection[]>([]);

  readonly colDefs: ColDef[] = [
    { field: 'syncName', headerName: 'Connection', sortable: true, filter: true },
    { field: 'smtpToAddressList', headerName: 'Email Recipients', sortable: true },
    { field: 'emailFrequency', headerName: 'Frequency', sortable: true }
  ];

  constructor(private readonly settingsService: EmailSettingsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.settingsService.loadConnections().subscribe(s => this.settings.set(s));
  }
}
