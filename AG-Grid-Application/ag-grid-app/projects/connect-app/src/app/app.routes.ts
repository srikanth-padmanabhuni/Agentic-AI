import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/layout/layout-shell.component').then(m => m.LayoutShellComponent),
    children: [
      { path: '', redirectTo: 'connections', pathMatch: 'full' },
      {
        path: 'connections',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/connections/components/connection-list/connection-list.component').then(m => m.ConnectionListComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('./features/connections/components/connection-wizard/connection-wizard.component').then(m => m.ConnectionWizardComponent),
            data: { breadcrumb: 'CONNECTIONS.CREATE' }
          },
          {
            path: ':id',
            loadComponent: () => import('./features/connections/components/connection-detail/connection-detail.component').then(m => m.ConnectionDetailComponent),
            data: { breadcrumb: 'CONNECTIONS.DETAIL' }
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/connections/components/connection-wizard/connection-wizard.component').then(m => m.ConnectionWizardComponent),
            data: { breadcrumb: 'CONNECTIONS.EDIT' }
          }
        ],
        data: { breadcrumb: 'NAV.CONNECTIONS' }
      },
      {
        path: 'servers',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/servers/components/server-list/server-list.component').then(m => m.ServerListComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/servers/components/server-detail/server-detail.component').then(m => m.ServerDetailComponent),
            data: { breadcrumb: 'SERVERS.DETAIL' }
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/servers/components/server-edit/server-edit.component').then(m => m.ServerEditComponent),
            data: { breadcrumb: 'SERVERS.EDIT' }
          }
        ],
        data: { breadcrumb: 'NAV.SERVERS' }
      },
      {
        path: 'datasources',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/datasources/components/datasource-list/datasource-list.component').then(m => m.DatasourceListComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('./features/datasources/components/datasource-create/datasource-create.component').then(m => m.DatasourceCreateComponent),
            data: { breadcrumb: 'DATASOURCES.CREATE' }
          },
          {
            path: ':id',
            loadComponent: () => import('./features/datasources/components/datasource-detail/datasource-detail.component').then(m => m.DatasourceDetailComponent),
            data: { breadcrumb: 'DATASOURCES.DETAIL' }
          }
        ],
        data: { breadcrumb: 'NAV.DATASOURCES' }
      },
      {
        path: 'user-maps',
        loadComponent: () => import('./features/user-maps/components/user-maps-list/user-maps-list.component').then(m => m.UserMapsListComponent),
        data: { breadcrumb: 'NAV.USER_MAPS' }
      },
      {
        path: 'authenticators',
        loadComponent: () => import('./features/authenticators/components/authenticators-list/authenticators-list.component').then(m => m.AuthenticatorsListComponent),
        data: { breadcrumb: 'NAV.AUTHENTICATORS' }
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/users/components/users-list/users-list.component').then(m => m.UsersListComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('./features/users/components/user-create/user-create.component').then(m => m.UserCreateComponent),
            data: { breadcrumb: 'USERS.CREATE' }
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/users/components/user-edit/user-edit.component').then(m => m.UserEditComponent),
            data: { breadcrumb: 'USERS.EDIT' }
          }
        ],
        data: { breadcrumb: 'NAV.USERS' }
      },
      {
        path: 'access-tokens',
        loadComponent: () => import('./features/access-tokens/components/access-tokens-list/access-tokens-list.component').then(m => m.AccessTokensListComponent),
        data: { breadcrumb: 'NAV.ACCESS_TOKENS' }
      },
      {
        path: 'email-settings',
        loadComponent: () => import('./features/email-settings/components/email-settings-list/email-settings-list.component').then(m => m.EmailSettingsListComponent),
        data: { breadcrumb: 'NAV.EMAIL_SETTINGS' }
      },
      {
        path: 'global-settings',
        loadComponent: () => import('./features/global-settings/components/global-settings-panel/global-settings-panel.component').then(m => m.GlobalSettingsPanelComponent),
        data: { breadcrumb: 'NAV.GLOBAL_SETTINGS' }
      },
      {
        path: 'server-metrics',
        loadComponent: () => import('./features/server-metrics/components/server-metrics-panel/server-metrics-panel.component').then(m => m.ServerMetricsPanelComponent),
        data: { breadcrumb: 'NAV.SERVER_METRICS' }
      },
      {
        path: 'import-export',
        loadComponent: () => import('./features/import-export/components/import-export-panel/import-export-panel.component').then(m => m.ImportExportPanelComponent),
        data: { breadcrumb: 'NAV.IMPORT_EXPORT' }
      }
    ]
  },
  { path: '**', redirectTo: 'connections' }
];
