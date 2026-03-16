import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UiCardComponent, UiButtonComponent, UiToolbarComponent, UiSnackbarService } from 'ui-lib';
import { DataSourceService } from '../../services/datasource.service';
import { DataSource } from '../../../../shared/models';

@Component({
  selector: 'app-datasource-detail',
  standalone: true,
  imports: [TranslateModule, UiCardComponent, UiButtonComponent, UiToolbarComponent],
  templateUrl: './datasource-detail.component.html',
  styleUrl: './datasource-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatasourceDetailComponent implements OnInit {
  readonly dataSource = signal<DataSource | null>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dsService: DataSourceService,
    private readonly snackbar: UiSnackbarService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dsService.loadDataSources().subscribe(all => {
        const found = all.find(d => d.connectId === id);
        if (found) {
          this.dataSource.set(found);
        } else {
          this.snackbar.error('ERRORS.NOT_FOUND');
          this.router.navigate(['/datasources']);
        }
      });
    }
  }

  onDelete(): void {
    const ds = this.dataSource();
    if (ds?.connectId) {
      this.dsService.deleteDataSource(ds.connectId).subscribe({
        next: () => {
          this.snackbar.success('DATASOURCES.DELETE_SUCCESS');
          this.router.navigate(['/datasources']);
        },
        error: () => this.snackbar.error('ERRORS.GENERIC')
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/datasources']);
  }
}
