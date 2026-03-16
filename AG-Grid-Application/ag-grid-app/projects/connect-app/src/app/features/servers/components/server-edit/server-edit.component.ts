import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  UiCardComponent,
  UiButtonComponent,
  UiToolbarComponent,
  UiTextFieldComponent,
  UiSnackbarService
} from 'ui-lib';
import { ServerService } from '../../services/server.service';
import { Server } from '../../../../shared/models';

@Component({
  selector: 'app-server-edit',
  standalone: true,
  imports: [TranslateModule, FormsModule, UiCardComponent, UiButtonComponent, UiToolbarComponent, UiTextFieldComponent],
  templateUrl: './server-edit.component.html',
  styleUrl: './server-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerEditComponent implements OnInit {
  readonly server = signal<Server | null>(null);
  maxNumJobs = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly serverService: ServerService,
    private readonly snackbar: UiSnackbarService
  ) {}

  ngOnInit(): void {
    const guid = this.route.snapshot.paramMap.get('id');
    if (guid) {
      this.serverService.getServer(guid).subscribe({
        next: s => {
          this.server.set(s);
          this.maxNumJobs = s.maxNumJobs ?? 0;
        },
        error: () => {
          this.snackbar.error('ERRORS.NOT_FOUND');
          this.router.navigate(['/servers']);
        }
      });
    }
  }

  onSave(): void {
    const s = this.server();
    if (!s) return;
    this.serverService.updateServer({ ...s, maxNumJobs: this.maxNumJobs }).subscribe({
      next: () => {
        this.snackbar.success('SERVERS.UPDATE_SUCCESS');
        this.router.navigate(['/servers', s.serverGuid]);
      },
      error: () => this.snackbar.error('ERRORS.GENERIC')
    });
  }

  onCancel(): void {
    const s = this.server();
    if (s?.serverGuid) {
      this.router.navigate(['/servers', s.serverGuid]);
    } else {
      this.router.navigate(['/servers']);
    }
  }
}
