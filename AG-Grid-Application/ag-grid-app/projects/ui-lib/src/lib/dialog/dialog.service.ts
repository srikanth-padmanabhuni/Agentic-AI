import { Injectable, inject, ComponentRef, Type } from '@angular/core';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';

export interface DialogConfig<D = unknown> {
  data?: D;
  width?: string;
  maxWidth?: string;
  panelClass?: string;
  hasBackdrop?: boolean;
  disableClose?: boolean;
}

export class DialogRef<R = unknown> {
  private readonly _afterClosed = new Subject<R | undefined>();
  readonly afterClosed$ = this._afterClosed.asObservable();

  constructor(private overlayRef: OverlayRef) {
    overlayRef.backdropClick().subscribe(() => {
      if (!this._disableClose) {
        this.close();
      }
    });
    overlayRef.keydownEvents().subscribe(e => {
      if (e.key === 'Escape' && !this._disableClose) {
        this.close();
      }
    });
  }

  private _disableClose = false;
  setDisableClose(v: boolean): void { this._disableClose = v; }

  close(result?: R): void {
    this.overlayRef.dispose();
    this._afterClosed.next(result);
    this._afterClosed.complete();
  }
}

@Injectable({ providedIn: 'root' })
export class UiDialogService {
  private overlay = inject(Overlay);

  open<C, D = unknown, R = unknown>(
    component: Type<C>,
    config: DialogConfig<D> = {}
  ): DialogRef<R> {
    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop !== false,
      panelClass: config.panelClass ?? 'ui-dialog-panel',
      width: config.width ?? '480px',
      maxWidth: config.maxWidth ?? '90vw',
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block()
    });

    const overlayRef = this.overlay.create(overlayConfig);
    const dialogRef = new DialogRef<R>(overlayRef);
    dialogRef.setDisableClose(!!config.disableClose);

    const portal = new ComponentPortal(component);
    const componentRef: ComponentRef<C> = overlayRef.attach(portal);

    const instance = componentRef.instance as Record<string, unknown>;
    if (config.data !== undefined) {
      instance['data'] = config.data;
    }
    instance['dialogRef'] = dialogRef;

    return dialogRef;
  }
}
