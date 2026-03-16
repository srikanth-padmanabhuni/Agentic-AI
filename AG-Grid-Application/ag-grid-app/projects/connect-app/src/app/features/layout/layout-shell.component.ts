import { Component, ChangeDetectionStrategy, computed, signal, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, ActivatedRoute, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import {
  UiToolbarComponent,
  UiButtonComponent,
  UiBreadcrumbComponent,
  UiMenuComponent,
  UiLoadingSpinnerComponent,
  UiLanguageSwitcherComponent,
  UiThemeSwitcherComponent,
  UiSnackbarContainerComponent
} from 'ui-lib';
import type { BreadcrumbItem, UiMenuItem } from 'ui-lib';
import { AuthService } from '../../core/services/auth.service';
import { StatusService } from '../../core/services/status.service';
import { PermissionsService } from '../../core/services/permissions.service';
import { FeatureFlagService } from '../../core/services/feature-flag.service';
import { LoadingService } from '../../core/services/loading.service';
import { UserPermission } from '../../shared/enums';
import { FeatureFlag } from '../../shared/enums';

interface NavTab {
  labelKey: string;
  route: string;
  icon?: string;
  permission?: UserPermission;
  featureFlag?: FeatureFlag;
}

@Component({
  selector: 'app-layout-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    UiToolbarComponent,
    UiButtonComponent,
    UiBreadcrumbComponent,
    UiMenuComponent,
    UiLoadingSpinnerComponent,
    UiLanguageSwitcherComponent,
    UiThemeSwitcherComponent,
    UiSnackbarContainerComponent
  ],
  templateUrl: './layout-shell.component.html',
  styleUrl: './layout-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutShellComponent {
  private readonly authService = inject(AuthService);
  private readonly statusService = inject(StatusService);
  private readonly permissionsService = inject(PermissionsService);
  private readonly featureFlagService = inject(FeatureFlagService);
  private readonly loadingService = inject(LoadingService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly allTabs: NavTab[] = [
    { labelKey: 'NAV.CONNECTIONS', route: '/connections' },
    { labelKey: 'NAV.SERVERS', route: '/servers', permission: UserPermission.READ_SERVERS },
    { labelKey: 'NAV.DATASOURCES', route: '/datasources' },
    { labelKey: 'NAV.USER_MAPS', route: '/user-maps' },
    { labelKey: 'NAV.AUTHENTICATORS', route: '/authenticators', featureFlag: FeatureFlag.LOGIN_WITH_AUTHENTICATORS },
    { labelKey: 'NAV.USERS', route: '/users', permission: UserPermission.READ_USERS },
    { labelKey: 'NAV.ACCESS_TOKENS', route: '/access-tokens' },
    { labelKey: 'NAV.EMAIL_SETTINGS', route: '/email-settings', featureFlag: FeatureFlag.EMAIL_NOTIFICATIONS_ENABLED },
    { labelKey: 'NAV.GLOBAL_SETTINGS', route: '/global-settings' },
    { labelKey: 'NAV.SERVER_METRICS', route: '/server-metrics', permission: UserPermission.READ_SERVER_METRICS },
    { labelKey: 'NAV.IMPORT_EXPORT', route: '/import-export' }
  ];

  readonly tabs = computed(() =>
    this.allTabs.filter(tab => {
      if (tab.permission && !this.permissionsService.hasPermission(tab.permission)) return false;
      if (tab.featureFlag && !this.featureFlagService.isEnabled(tab.featureFlag)) return false;
      return true;
    })
  );

  readonly breadcrumbs = signal<BreadcrumbItem[]>([]);
  readonly isLoading = this.loadingService.isLoading;
  readonly currentUser = this.authService.currentUser;
  readonly version = this.statusService.version;
  readonly uptime = this.statusService.uptime;

  readonly settingsMenu: UiMenuItem[] = [
    { labelKey: 'HEADER.FLUSH_CACHE', action: () => this.flushCache() },
    { labelKey: 'HEADER.BACKUP_DB', action: () => this.backupDb() }
  ];

  constructor() {
    this.statusService.fetchStatus().subscribe();
    this.permissionsService.fetchPermissions().subscribe();
    this.featureFlagService.loadFlags().subscribe();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateBreadcrumbs();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private flushCache(): void {
    // Calls server flush cache API
  }

  private backupDb(): void {
    // Calls server backup API
  }

  private updateBreadcrumbs(): void {
    const crumbs: BreadcrumbItem[] = [];
    let route: ActivatedRoute | null = this.activatedRoute.root;

    while (route) {
      if (route.snapshot.data['breadcrumb']) {
        crumbs.push({
          labelKey: route.snapshot.data['breadcrumb'],
          route: route.snapshot.url.map(s => s.path).join('/')
        });
      }
      route = route.firstChild;
    }

    this.breadcrumbs.set(crumbs);
  }
}
