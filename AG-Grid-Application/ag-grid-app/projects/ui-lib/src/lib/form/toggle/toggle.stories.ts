import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { UiToggleComponent } from './toggle.component';

const meta: Meta<UiToggleComponent> = {
  title: 'Form/Toggle',
  component: UiToggleComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [FormsModule, ReactiveFormsModule] })],
  argTypes: {
    label: { control: 'text' },
    ariaLabel: { control: 'text' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<UiToggleComponent>;

export const Default: Story = {
  args: { label: 'Enable dark mode' },
};

export const Small: Story = {
  args: { label: 'Compact toggle', size: 'sm' },
};

export const Large: Story = {
  args: { label: 'Large toggle', size: 'lg' },
};

export const WithAriaLabel: Story = {
  args: { label: 'Airplane mode', ariaLabel: 'Toggle airplane mode' },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px">
        <ui-toggle label="Small" size="sm"></ui-toggle>
        <ui-toggle label="Medium (default)" size="md"></ui-toggle>
        <ui-toggle label="Large" size="lg"></ui-toggle>
      </div>
    `,
  }),
};

export const SettingsPanel: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:300px">
        <ui-toggle label="Email Notifications"></ui-toggle>
        <ui-toggle label="Push Notifications"></ui-toggle>
        <ui-toggle label="Auto-update"></ui-toggle>
        <ui-toggle label="Analytics"></ui-toggle>
      </div>
    `,
  }),
};
