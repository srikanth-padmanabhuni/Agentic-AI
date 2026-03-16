import { Component, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  UiButtonComponent,
  UiCardComponent,
  UiTextFieldComponent,
  UiSnackbarService
} from 'ui-lib';
import { GlobalPropertyService } from '../../../../core/services/feature-flag.service';
import { GlobalProperty } from '../../../../shared/models';

@Component({
  selector: 'app-global-settings-panel',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, UiButtonComponent, UiCardComponent, UiTextFieldComponent],
  templateUrl: './global-settings-panel.component.html',
  styleUrl: './global-settings-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalSettingsPanelComponent implements OnInit {
  private readonly propService = inject(GlobalPropertyService);
  private readonly snackbar = inject(UiSnackbarService);
  private readonly fb = inject(FormBuilder);

  readonly settingsForm: FormGroup;
  readonly properties = signal<GlobalProperty[]>([]);
  readonly isDirty = signal(false);

  constructor() {
    this.settingsForm = this.fb.group({ properties: this.fb.array([]) });
  }

  get propertiesArray(): FormArray {
    return this.settingsForm.get('properties') as FormArray;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.propService.loadProperties().subscribe(props => {
      this.properties.set(props);
      this.buildForm(props);
      this.isDirty.set(false);
    });
  }

  onSave(): void {
    const updated: GlobalProperty[] = this.propertiesArray.value;
    this.propService.saveProperties(updated).subscribe({
      next: () => {
        this.snackbar.success('GLOBAL_SETTINGS.SAVE_SUCCESS');
        this.isDirty.set(false);
      },
      error: () => this.snackbar.error('ERRORS.GENERIC')
    });
  }

  onCancel(): void {
    this.loadData();
  }

  private buildForm(props: GlobalProperty[]): void {
    const arr = this.fb.array(
      props.map(p => this.fb.group({ name: [p.name], value: [p.value, Validators.required] }))
    );
    this.settingsForm.setControl('properties', arr);
    this.settingsForm.valueChanges.subscribe(() => this.isDirty.set(true));
  }
}
