import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  UiCardComponent,
  UiButtonComponent,
  UiToolbarComponent,
  UiTextFieldComponent,
  UiSelectComponent,
  UiSnackbarService
} from 'ui-lib';
import type { UiSelectOption } from 'ui-lib';
import { UserService } from '../../services/user.service';
import { User } from '../../../../shared/models';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [TranslateModule, FormsModule, UiCardComponent, UiButtonComponent, UiToolbarComponent, UiTextFieldComponent, UiSelectComponent],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditComponent implements OnInit {
  readonly user = signal<User | null>(null);
  name = '';
  role = '';
  status = '';

  readonly roleOptions: UiSelectOption[] = [
    { value: 'Site', labelKey: 'USERS.ROLE_SITE' },
    { value: 'Admin', labelKey: 'USERS.ROLE_ADMIN' },
    { value: 'User', labelKey: 'USERS.ROLE_USER' },
    { value: 'ReadOnly', labelKey: 'USERS.ROLE_READONLY' }
  ];

  readonly statusOptions: UiSelectOption[] = [
    { value: 'Active', labelKey: 'USERS.STATUS_ACTIVE' },
    { value: 'Inactive', labelKey: 'USERS.STATUS_INACTIVE' },
    { value: 'Locked', labelKey: 'USERS.STATUS_LOCKED' }
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly snackbar: UiSnackbarService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.loadUsers().subscribe(users => {
        const found = users.find(u => u.connectId === id);
        if (found) {
          this.user.set(found);
          this.name = found.name ?? '';
          this.role = found.role ?? 'User';
          this.status = found.status ?? 'Active';
        } else {
          this.snackbar.error('ERRORS.NOT_FOUND');
          this.router.navigate(['/users']);
        }
      });
    }
  }

  onSave(): void {
    const u = this.user();
    if (!u) return;
    this.userService.updateUser({ ...u, name: this.name, role: this.role, status: this.status }).subscribe({
      next: () => {
        this.snackbar.success('USERS.UPDATE_SUCCESS');
        this.router.navigate(['/users']);
      },
      error: () => this.snackbar.error('ERRORS.GENERIC')
    });
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
