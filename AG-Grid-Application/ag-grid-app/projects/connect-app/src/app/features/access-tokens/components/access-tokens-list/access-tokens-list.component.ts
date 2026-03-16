import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  UiButtonComponent,
  UiDataGridComponent,
  UiSnackbarService
} from 'ui-lib';
import { AccessTokenService } from '../../services/access-token.service';
import { AccessToken } from '../../../../shared/models';
import type { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-access-tokens-list',
  standalone: true,
  imports: [TranslateModule, UiButtonComponent, UiDataGridComponent],
  templateUrl: './access-tokens-list.component.html',
  styleUrl: './access-tokens-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessTokensListComponent implements OnInit {
  readonly tokens = signal<AccessToken[]>([]);

  readonly colDefs: ColDef[] = [
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'role', headerName: 'Role', sortable: true },
    { field: 'expirationDate', headerName: 'Expires', sortable: true },
    { field: 'status', headerName: 'Status', sortable: true }
  ];

  constructor(
    private readonly tokenService: AccessTokenService,
    private readonly snackbar: UiSnackbarService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.tokenService.loadTokens().subscribe(t => this.tokens.set(t));
  }

  onDelete(token: AccessToken): void {
    this.tokenService.deleteToken(token.id).subscribe({
      next: () => this.snackbar.success('ACCESS_TOKENS.REVOKE_SUCCESS'),
      error: () => this.snackbar.error('ERRORS.GENERIC')
    });
  }
}
