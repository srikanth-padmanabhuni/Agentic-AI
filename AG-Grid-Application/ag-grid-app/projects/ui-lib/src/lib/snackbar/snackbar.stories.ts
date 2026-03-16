import type { Meta, StoryObj } from '@storybook/angular';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UiSnackbarContainerComponent } from './snackbar-container.component';
import { UiSnackbarService, SnackbarMessage } from './snackbar.service';

/* ── Trigger component: buttons + snackbar container ────── */
@Component({
  selector: 'story-snackbar-demo',
  standalone: true,
  imports: [CommonModule, TranslateModule, UiSnackbarContainerComponent],
  styles: [`
    .demo-buttons { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
    .demo-buttons button {
      padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;
      font-size: 14px; font-weight: 500; color: #fff;
    }
    .btn-success { background: #2e7d32; }
    .btn-error   { background: #d32f2f; }
    .btn-warning { background: #f57c00; color: #000 !important; }
    .btn-info    { background: #1976d2; }
    .btn-dismiss { background: #424242; }

    .inline-snack-area {
      position: relative; min-height: 200px;
      border: 1px dashed #ccc; border-radius: 8px; padding: 16px;
      background: #fafafa;
    }
    .inline-snack-area :host-context(.theme-light) & { background: #fafafa; }
    .snack-item {
      display: flex; align-items: center; padding: 12px 16px;
      border-radius: 8px; margin-bottom: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,.12);
      font-size: 14px; animation: slideIn 200ms ease-out;
    }
    .snack-item--success { background: #2e7d32; color: #fff; }
    .snack-item--error   { background: #d32f2f; color: #fff; }
    .snack-item--warning { background: #f57c00; color: #000; }
    .snack-item--info    { background: #1976d2; color: #fff; }
    .snack-item__msg { flex: 1; }
    .snack-item__close {
      background: none; border: none; color: inherit;
      font-size: 18px; cursor: pointer; margin-left: 12px; opacity: .8;
    }
    .snack-item__close:hover { opacity: 1; }
    .empty-hint { text-align: center; padding: 40px 0; color: #999; font-style: italic; }
    @keyframes slideIn { from { transform:translateX(30px); opacity:0 } to { transform:translateX(0); opacity:1 } }
  `],
  template: `
    <div class="demo-buttons">
      <button class="btn-success" (click)="show('success')">✓ Success</button>
      <button class="btn-error" (click)="show('error')">✕ Error</button>
      <button class="btn-warning" (click)="show('warning')">⚠ Warning</button>
      <button class="btn-info" (click)="show('info')">ℹ Info</button>
      <button class="btn-dismiss" (click)="snackbar.dismissAll()">Dismiss All</button>
    </div>
    <div class="inline-snack-area">
      @if (snackbar.messages().length === 0) {
        <div class="empty-hint">Click a button above to show a snackbar message</div>
      }
      @for (msg of snackbar.messages(); track msg.id) {
        <div class="snack-item" [class]="'snack-item--' + msg.type">
          <span class="snack-item__msg">{{ msg.messageKey | translate }}</span>
          <button class="snack-item__close" (click)="snackbar.dismiss(msg.id)">&times;</button>
        </div>
      }
    </div>
  `,
})
class StorySnackbarDemoComponent {
  readonly snackbar = inject(UiSnackbarService);

  show(type: 'success' | 'error' | 'warning' | 'info'): void {
    const msgs: Record<string, string> = {
      success: 'COMMON.SAVE',
      error: 'COMMON.DELETE',
      warning: 'COMMON.CONFIRM',
      info: 'COMMON.LOADING',
    };
    this.snackbar.open(msgs[type], type, 0);
  }
}

/* ── Pre-loaded: shows all types on mount ────────────────── */
@Component({
  selector: 'story-snackbar-preloaded',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  styles: [`
    .snack-item {
      display: flex; align-items: center; padding: 12px 16px;
      border-radius: 8px; margin-bottom: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,.12); font-size: 14px;
    }
    .snack-item--success { background: #2e7d32; color: #fff; }
    .snack-item--error   { background: #d32f2f; color: #fff; }
    .snack-item--warning { background: #f57c00; color: #000; }
    .snack-item--info    { background: #1976d2; color: #fff; }
    .snack-item__msg { flex: 1; }
    .snack-item__close {
      background: none; border: none; color: inherit;
      font-size: 18px; cursor: pointer; margin-left: 12px; opacity: .8;
    }
    .container { display: flex; flex-direction: column; gap: 0; }
  `],
  template: `
    <div class="container">
      @for (msg of messages; track msg.type) {
        <div class="snack-item" [class]="'snack-item--' + msg.type">
          <span class="snack-item__msg">{{ msg.label }}</span>
          <button class="snack-item__close">&times;</button>
        </div>
      }
    </div>
  `,
})
class StorySnackbarPreloadedComponent {
  messages = [
    { type: 'success', label: 'Record saved successfully' },
    { type: 'error', label: 'Failed to delete record' },
    { type: 'warning', label: 'Are you sure you want to continue?' },
    { type: 'info', label: 'Loading data, please wait…' },
  ];
}

const meta: Meta<StorySnackbarDemoComponent> = {
  title: 'Components/Snackbar',
  component: StorySnackbarDemoComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<StorySnackbarDemoComponent>;

export const Interactive: Story = {};

export const AllTypes: Story = {
  render: () => ({
    component: StorySnackbarPreloadedComponent,
    props: {},
  }),
};

export const SuccessOnly: Story = {
  render: () => ({
    component: StorySnackbarPreloadedComponent,
    props: {
      messages: [{ type: 'success', label: 'Record saved successfully' }],
    },
  }),
};

export const ErrorOnly: Story = {
  render: () => ({
    component: StorySnackbarPreloadedComponent,
    props: {
      messages: [{ type: 'error', label: 'An error occurred while processing your request' }],
    },
  }),
};

export const WarningOnly: Story = {
  render: () => ({
    component: StorySnackbarPreloadedComponent,
    props: {
      messages: [{ type: 'warning', label: 'This action cannot be undone' }],
    },
  }),
};

export const InfoOnly: Story = {
  render: () => ({
    component: StorySnackbarPreloadedComponent,
    props: {
      messages: [{ type: 'info', label: 'Your session will expire in 5 minutes' }],
    },
  }),
};
