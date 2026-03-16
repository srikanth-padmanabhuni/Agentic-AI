import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  UiButtonComponent,
  UiDataGridComponent,
  UiSnackbarService
} from 'ui-lib';
import { AuthenticatorService } from '../../services/authenticator.service';
import { AuthenticatorDataSource } from '../../../../shared/models';
import type { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-authenticators-list',
  standalone: true,
  imports: [TranslateModule, UiButtonComponent, UiDataGridComponent],
  templateUrl: './authenticators-list.component.html',
  styleUrl: './authenticators-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticatorsListComponent implements OnInit {
  readonly authenticators = signal<AuthenticatorDataSource[]>([]);

  readonly colDefs: ColDef[] = [
    { field: 'product', headerName: 'Product', sortable: true, filter: true },
    { field: 'name', headerName: 'Data Source', sortable: true, filter: true }
  ];

  constructor(
    private readonly authService: AuthenticatorService,
    private readonly snackbar: UiSnackbarService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.authService.loadAuthenticators().subscribe(auths => this.authenticators.set(auths));
  }

  onDelete(auth: AuthenticatorDataSource): void {
    if (auth.connectId) {
      this.authService.deleteAuthenticator(auth.connectId).subscribe({
        next: () => this.snackbar.success('AUTHENTICATORS.DELETE_SUCCESS'),
        error: () => this.snackbar.error('ERRORS.GENERIC')
      });
    }
  }
}
