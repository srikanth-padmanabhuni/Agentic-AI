import type { Meta, StoryObj } from '@storybook/angular';
import { UiMenuComponent, UiMenuItem } from './menu.component';

const meta: Meta<UiMenuComponent> = {
  title: 'Components/Menu',
  component: UiMenuComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<UiMenuComponent>;

export const Default: Story = {
  render: () => {
    const items: UiMenuItem[] = [
      { labelKey: 'STORY.MENU_ITEM_1', icon: '📄', action: () => console.log('Item 1') },
      { labelKey: 'STORY.MENU_ITEM_2', icon: '✏️', action: () => console.log('Item 2') },
      { labelKey: 'STORY.MENU_ITEM_3', icon: '🗑️', danger: true, action: () => console.log('Delete') },
    ];
    return {
      props: { items, ariaLabel: 'ARIA.MENU' },
      template: `
        <div style="padding:16px">
          <ui-menu [items]="items" [ariaLabel]="ariaLabel">
            <button menuTrigger style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;border:1px solid #ccc;border-radius:6px;background:#fff;cursor:pointer;font-size:14px;font-weight:500">
              ☰ Actions
            </button>
          </ui-menu>
        </div>
      `,
    };
  },
};

export const WithIcons: Story = {
  render: () => {
    const items: UiMenuItem[] = [
      { labelKey: 'COMMON.CREATE', icon: '📄', action: () => {} },
      { labelKey: 'COMMON.EDIT', icon: '✏️', action: () => {} },
      { labelKey: 'COMMON.SAVE', icon: '💾', action: () => {} },
      { labelKey: 'COMMON.CLOSE', icon: '❌', action: () => {} },
      { labelKey: 'COMMON.DELETE', icon: '🗑️', danger: true, action: () => {} },
    ];
    return {
      props: { items },
      template: `
        <div style="padding:16px">
          <ui-menu [items]="items">
            <button menuTrigger style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;border:1px solid #ccc;border-radius:6px;background:#fff;cursor:pointer;font-size:14px">
              📋 File Menu
            </button>
          </ui-menu>
        </div>
      `,
    };
  },
};

export const WithDisabledItems: Story = {
  render: () => {
    const items: UiMenuItem[] = [
      { labelKey: 'COMMON.EDIT', icon: '✏️', action: () => {} },
      { labelKey: 'COMMON.SAVE', icon: '💾', disabled: true, action: () => {} },
      { labelKey: 'COMMON.DELETE', icon: '🗑️', danger: true, action: () => {} },
    ];
    return {
      props: { items },
      template: `
        <div style="padding:16px">
          <ui-menu [items]="items">
            <button menuTrigger style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;border:1px solid #ccc;border-radius:6px;background:#fff;cursor:pointer;font-size:14px">
              ☰ With Disabled
            </button>
          </ui-menu>
        </div>
      `,
    };
  },
};

export const DangerItems: Story = {
  render: () => {
    const items: UiMenuItem[] = [
      { labelKey: 'COMMON.EDIT', icon: '✏️', action: () => {} },
      { labelKey: 'COMMON.DELETE', icon: '🗑️', danger: true, action: () => {} },
    ];
    return {
      props: { items },
      template: `
        <div style="padding:16px">
          <ui-menu [items]="items">
            <button menuTrigger style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;border:1px solid #d32f2f;border-radius:6px;background:#fff;cursor:pointer;font-size:14px;color:#d32f2f">
              ⚠ Danger Actions
            </button>
          </ui-menu>
        </div>
      `,
    };
  },
};
