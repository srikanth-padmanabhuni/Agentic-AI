import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  UiStepperComponent,
  UiButtonComponent,
  UiCardComponent,
  UiTextFieldComponent,
  UiSelectComponent,
  UiSnackbarService
} from 'ui-lib';
import type { StepDef, UiSelectOption } from 'ui-lib';
import { FormsModule } from '@angular/forms';
import { ConnectionWizardService } from '../../services/connection-wizard.service';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-connection-wizard',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    UiStepperComponent,
    UiButtonComponent,
    UiCardComponent,
    UiTextFieldComponent,
    UiSelectComponent
  ],
  templateUrl: './connection-wizard.component.html',
  styleUrl: './connection-wizard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionWizardComponent implements OnInit, OnDestroy {
  private readonly wizardService = inject(ConnectionWizardService);
  private readonly connectionService = inject(ConnectionService);
  private readonly snackbar = inject(UiSnackbarService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly state = this.wizardService.state;

  readonly steps: StepDef[] = [
    { labelKey: 'WIZARD.STEP_DATASOURCE' },
    { labelKey: 'WIZARD.STEP_TYPE_MAPPING' },
    { labelKey: 'WIZARD.STEP_SYNC_RULES' },
    { labelKey: 'WIZARD.STEP_REVIEW' }
  ];

  readonly currentStep = computed(() => this.state().currentStep);
  readonly isEditMode = computed(() => this.state().mode === 'UPDATE');

  readonly directionOptions: UiSelectOption[] = [
    { value: 'both', labelKey: 'WIZARD.DIRECTION_BOTH' },
    { value: 'source_to_target', labelKey: 'WIZARD.DIRECTION_SOURCE_TO_TARGET' },
    { value: 'target_to_source', labelKey: 'WIZARD.DIRECTION_TARGET_TO_SOURCE' }
  ];

  constructor() {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.wizardService.initForEdit(id);
      this.connectionService.getConnection(id).subscribe({
        next: conn => {
          this.wizardService.updateBasicInfo({
            connectionName: conn.name || '',
            connectionDescription: conn.description || '',
            direction: conn.direction || 'both',
            frequency: conn.repeat || 60,
            enabled: conn.enabled ?? true
          });
        },
        error: () => {
          this.snackbar.error('ERRORS.NOT_FOUND');
          this.router.navigate(['/connections']);
        }
      });
    } else {
      this.wizardService.reset();
    }
  }

  ngOnDestroy(): void {
    this.wizardService.reset();
  }

  onNext(): void {
    this.wizardService.nextStep();
  }

  onPrevious(): void {
    this.wizardService.prevStep();
  }

  onCancel(): void {
    this.router.navigate(['/connections']);
  }

  onSave(): void {
    const s = this.state();
    const payload = {
      name: s.connectionName,
      description: s.connectionDescription,
      direction: s.direction,
      repeat: s.frequency,
      enabled: s.enabled
    };

    const obs = s.mode === 'UPDATE' && s.existingConnectionGuid
      ? this.connectionService.updateConnection(s.existingConnectionGuid, payload)
      : this.connectionService.createConnection(payload);

    obs.subscribe({
      next: () => {
        this.snackbar.success(s.mode === 'UPDATE' ? 'CONNECTIONS.UPDATE_SUCCESS' : 'CONNECTIONS.CREATE_SUCCESS');
        this.router.navigate(['/connections']);
      },
      error: () => this.snackbar.error('ERRORS.GENERIC')
    });
  }
}
