import { Component, input, signal, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface StepDef {
  labelKey: string;
  optional?: boolean;
}

@Component({
  selector: 'ui-stepper',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiStepperComponent {
  readonly steps = input<StepDef[]>([]);
  readonly linear = input(true);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  readonly activeIndex = signal(0);
  readonly stepChanged = output<number>();

  goTo(index: number): void {
    if (!this.linear() || index <= this.activeIndex() + 1) {
      this.activeIndex.set(index);
      this.stepChanged.emit(index);
    }
  }

  next(): void {
    const max = this.steps().length - 1;
    if (this.activeIndex() < max) {
      this.goTo(this.activeIndex() + 1);
    }
  }

  previous(): void {
    if (this.activeIndex() > 0) {
      this.goTo(this.activeIndex() - 1);
    }
  }
}
