import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { UiButtonComponent, UiTextFieldComponent, UiPasswordFieldComponent, UiCardComponent } from 'ui-lib';
import { AuthService } from '../../core/services/auth.service';
import { PermissionsService } from '../../core/services/permissions.service';
import { FeatureFlagService } from '../../core/services/feature-flag.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    UiButtonComponent,
    UiTextFieldComponent,
    UiPasswordFieldComponent,
    UiCardComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  username = '';
  password = '';
  tenant = 'Micro Focus Connect';
  readonly error = signal('');
  readonly loading = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly permissionsService: PermissionsService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.error.set('LOGIN.REQUIRED_FIELDS');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.username, this.password, this.tenant).subscribe({
      next: () => {
        forkJoin([
          this.permissionsService.fetchPermissions(),
          this.featureFlagService.loadFlags()
        ]).subscribe({
          next: () => this.router.navigate(['/connections']),
          error: () => this.router.navigate(['/connections'])
        });
      },
      error: () => {
        this.loading.set(false);
        this.error.set('LOGIN.INVALID_CREDENTIALS');
      }
    });
  }
}
