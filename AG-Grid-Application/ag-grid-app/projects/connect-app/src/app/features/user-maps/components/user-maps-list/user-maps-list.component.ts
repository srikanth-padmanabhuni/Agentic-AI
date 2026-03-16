import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  UiButtonComponent,
  UiCardComponent,
  UiInlineEditComponent,
  UiSnackbarService
} from 'ui-lib';
import { UserMapService } from '../../services/user-map.service';
import { PermissionsService } from '../../../../core/services/permissions.service';
import { UserMapTreeNode } from '../../../../shared/models';
import { UserPermission } from '../../../../shared/enums';

@Component({
  selector: 'app-user-maps-list',
  standalone: true,
  imports: [TranslateModule, UiButtonComponent, UiCardComponent, UiInlineEditComponent],
  templateUrl: './user-maps-list.component.html',
  styleUrl: './user-maps-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMapsListComponent implements OnInit {
  readonly userMaps = signal<UserMapTreeNode[]>([]);
  readonly isDirty = signal(false);
  readonly canCreate = signal(false);
  private originalData: UserMapTreeNode[] = [];

  constructor(
    private readonly userMapService: UserMapService,
    private readonly permissions: PermissionsService,
    private readonly snackbar: UiSnackbarService
  ) {}

  ngOnInit(): void {
    this.canCreate.set(this.permissions.hasPermission(UserPermission.CREATE_USER_MAPS));
    this.loadData();
  }

  loadData(): void {
    this.userMapService.loadUserMaps().subscribe(maps => {
      this.userMaps.set(maps);
      this.originalData = JSON.parse(JSON.stringify(maps));
      this.isDirty.set(false);
    });
  }

  onNodeTextSaved(node: UserMapTreeNode, newText: string): void {
    node.text = newText;
    this.isDirty.set(true);
  }

  onSave(): void {
    this.userMapService.saveUserMaps(this.userMaps()).subscribe({
      next: () => {
        this.snackbar.success('USER_MAPS.SAVE_SUCCESS');
        this.isDirty.set(false);
      },
      error: () => this.snackbar.error('ERRORS.GENERIC')
    });
  }

  onCancel(): void {
    this.userMaps.set(JSON.parse(JSON.stringify(this.originalData)));
    this.isDirty.set(false);
  }
}
