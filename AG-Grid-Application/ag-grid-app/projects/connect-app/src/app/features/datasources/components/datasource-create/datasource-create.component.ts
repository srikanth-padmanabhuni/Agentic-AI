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
  UiSnackbarService
} from 'ui-lib';
import { DataSourceService } from '../../services/datasource.service';
import { DataSource } from '../../../../shared/models';

@Component({
  selector: 'app-datasource-create',
  standalone: true,
  imports: [TranslateModule, FormsModule, UiCardComponent, UiButtonComponent, UiToolbarComponent, UiTextFieldComponent, UiSelectComponent],
  templateUrl: './datasource-create.component.html',
  styleUrl: './datasource-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatasourceCreateComponent {
  name = '';
  product = '';
  contextType = '';

  constructor(
    private readonly router: Router,
    private readonly dsService: DataSourceService,
    private readonly snackbar: UiSnackbarService
  ) {}

  onSave(): void {
    const payload: Partial<DataSource> = {
      name: this.name,
      product: this.product,
      contextType: this.contextType
    };
    this.dsService.createDataSource(payload).subscribe({
      next: () => {
        this.snackbar.success('DATASOURCES.CREATE_SUCCESS');
        this.router.navigate(['/datasources']);
      },
      error: () => this.snackbar.error('ERRORS.GENERIC')
    });
  }

  onCancel(): void {
    this.router.navigate(['/datasources']);
  }
}
