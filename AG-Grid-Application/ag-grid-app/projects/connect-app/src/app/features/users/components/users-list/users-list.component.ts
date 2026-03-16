import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  UiButtonComponent,
  UiDataGridComponent,
  UiSnackbarService
} from 'ui-lib';
import { UserService } from '../../services/user.service';
import { User } from '../../../../shared/models';
import type { ColDef, RowClickedEvent } from 'ag-grid-community';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [TranslateModule, UiButtonComponent, UiDataGridComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit {
  readonly users = signal<User[]>([]);

  readonly colDefs: ColDef[] = [
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'userId', headerName: 'User ID', sortable: true, filter: true },
    { field: 'role', headerName: 'Role', sortable: true },
    { field: 'status', headerName: 'Status', sortable: true },
    { field: 'lastPasswordChange', headerName: 'Last Password Change', sortable: true }
  ];

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly snackbar: UiSnackbarService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.userService.loadUsers().subscribe((users) => {
      this.users.set(users);
    });
  }

  onRowClicked(event: RowClickedEvent): void {
    const user = event.data as User;
    if (user?.connectId) {
      this.router.navigate(['/users', user.connectId, 'edit']);
    }
  }

  onCreate(): void {
    this.router.navigate(['/users', 'create']);
  }

  onDelete(user: User): void {
    if (user.userId) {
      this.userService.deleteUser(user.userId).subscribe({
        next: () => {
          this.snackbar.success('USERS.DELETE_SUCCESS');
          this.loadData();
        },
        error: () => this.snackbar.error('ERRORS.GENERIC')
      });
    }
  }
}
