import { Directive, ElementRef, input, inject, OnDestroy, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[uiTooltip]',
  standalone: true
})
export class UiTooltipDirective implements OnDestroy {
  readonly uiTooltip = input.required<string>();
  readonly tooltipPosition = input<'top' | 'bottom' | 'left' | 'right'>('top');

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private translate = inject(TranslateService);
  private tooltipEl: HTMLElement | null = null;
  private showHandler = () => this.show();
  private hideHandler = () => this.hide();

  constructor() {
    const native = this.el.nativeElement as HTMLElement;
    native.addEventListener('mouseenter', this.showHandler);
    native.addEventListener('focus', this.showHandler);
    native.addEventListener('mouseleave', this.hideHandler);
    native.addEventListener('blur', this.hideHandler);
  }

  private show(): void {
    if (this.tooltipEl) return;
    const text = this.translate.instant(this.uiTooltip());
    if (!text) return;

    this.tooltipEl = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipEl, 'ui-tooltip');
    this.renderer.addClass(this.tooltipEl, `ui-tooltip--${this.tooltipPosition()}`);
    this.renderer.setAttribute(this.tooltipEl, 'role', 'tooltip');
    const textNode = this.renderer.createText(text);
    this.renderer.appendChild(this.tooltipEl, textNode);
    this.renderer.appendChild(document.body, this.tooltipEl);

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const pos = this.tooltipPosition();
    const tt = this.tooltipEl!;

    requestAnimationFrame(() => {
      const ttRect = tt.getBoundingClientRect();
      let top = 0, left = 0;
      switch (pos) {
        case 'top':
          top = hostRect.top - ttRect.height - 8;
          left = hostRect.left + hostRect.width / 2 - ttRect.width / 2;
          break;
        case 'bottom':
          top = hostRect.bottom + 8;
          left = hostRect.left + hostRect.width / 2 - ttRect.width / 2;
          break;
        case 'left':
          top = hostRect.top + hostRect.height / 2 - ttRect.height / 2;
          left = hostRect.left - ttRect.width - 8;
          break;
        case 'right':
          top = hostRect.top + hostRect.height / 2 - ttRect.height / 2;
          left = hostRect.right + 8;
          break;
      }
      this.renderer.setStyle(tt, 'top', `${top + window.scrollY}px`);
      this.renderer.setStyle(tt, 'left', `${left + window.scrollX}px`);
    });
  }

  private hide(): void {
    if (this.tooltipEl) {
      this.renderer.removeChild(document.body, this.tooltipEl);
      this.tooltipEl = null;
    }
  }

  ngOnDestroy(): void {
    this.hide();
    const native = this.el.nativeElement as HTMLElement;
    native.removeEventListener('mouseenter', this.showHandler);
    native.removeEventListener('focus', this.showHandler);
    native.removeEventListener('mouseleave', this.hideHandler);
    native.removeEventListener('blur', this.hideHandler);
  }
}
