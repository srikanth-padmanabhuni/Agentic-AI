import type { Meta, StoryObj } from '@storybook/angular';
import { UiToolbarComponent } from './toolbar.component';

const meta: Meta<UiToolbarComponent> = {
  title: 'Components/Toolbar',
  component: UiToolbarComponent,
  tags: ['autodocs'],
  argTypes: {
    titleKey: { control: 'text' },
    elevated: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<UiToolbarComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-toolbar [titleKey]="titleKey" [elevated]="elevated">
        <span toolbarStart style="font-size:14px;opacity:0.7">Dashboard</span>
        <div toolbarEnd style="display:flex;gap:8px">
          <button style="padding:6px 12px;cursor:pointer">Settings</button>
          <button style="padding:6px 12px;cursor:pointer">Profile</button>
        </div>
      </ui-toolbar>
    `,
  }),
  args: { titleKey: 'STORY.TITLE', elevated: false },
};

export const Elevated: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-toolbar [titleKey]="titleKey" [elevated]="elevated">
        <span toolbarStart>⬅ Back</span>
        <div toolbarEnd style="display:flex;gap:8px">
          <button style="padding:6px 12px;cursor:pointer">Save</button>
          <button style="padding:6px 12px;cursor:pointer">Cancel</button>
        </div>
      </ui-toolbar>
    `,
  }),
  args: { titleKey: 'STORY.TITLE', elevated: true },
};

export const TitleOnly: Story = {
  args: { titleKey: 'STORY.TITLE', elevated: false },
};

export const WithActions: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-toolbar [titleKey]="titleKey" [elevated]="elevated">
        <div toolbarEnd style="display:flex;gap:8px">
          <button style="padding:6px 12px;cursor:pointer">🔍 Search</button>
          <button style="padding:6px 12px;cursor:pointer">➕ Create</button>
          <button style="padding:6px 12px;cursor:pointer">📤 Export</button>
        </div>
      </ui-toolbar>
    `,
  }),
  args: { titleKey: 'STORY.TITLE', elevated: false },
};
