import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  UiCardComponent,
  UiButtonComponent,
  UiToolbarComponent,
  UiTextFieldComponent,
  UiSelectComponent,
  UiPasswordFieldComponent,
  UiSnackbarService
} from 'ui-lib';
import type { UiSelectOption } from 'ui-lib';
import { UserService } from '../../services/user.service';
import { User } from '../../../../shared/models';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [TranslateModule, FormsModule, UiCardComponent, UiButtonComponent, UiToolbarComponent, UiTextFieldComponent, UiSelectComponent, UiPasswordFieldComponent],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCreateComponent {
  name = '';
  userId = '';
  password = '';
  role = 'User';
  status = 'Active';

  readonly roleOptions: UiSelectOption[] = [
    { value: 'Site', labelKey: 'USERS.ROLE_SITE' },
    { value: 'Admin', labelKey: 'USERS.ROLE_ADMIN' },
    { value: 'User', labelKey: 'USERS.ROLE_USER' },
    { value: 'ReadOnly', labelKey: 'USERS.ROLE_READONLY' }
  ];

  readonly statusOptions: UiSelectOption[] = [
    { value: 'Active', labelKey: 'USERS.STATUS_ACTIVE' },
    { value: 'Inactive', labelKey: 'USERS.STATUS_INACTIVE' }
  ];

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly snackbar: UiSnackbarService
  ) {}

  onSave(): void {
    const payload: Partial<User> = {
      name: this.name,
      userId: this.userId,
      password: this.password,
      role: this.role,
      status: this.status
    };
    this.userService.createUser(payload).subscribe({
      next: () => {
        this.snackbar.success('USERS.CREATE_SUCCESS');
        this.router.navigate(['/users']);
      },
      error: () => this.snackbar.error('ERRORS.GENERIC')
    });
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
