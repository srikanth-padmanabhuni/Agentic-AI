import type { Meta, StoryObj } from '@storybook/angular';
import { UiButtonComponent } from './button.component';

const meta: Meta<UiButtonComponent> = {
  title: 'Components/Button',
  component: UiButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'text', 'icon'],
    },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    labelKey: { control: 'text' },
    ariaLabel: { control: 'text' },
    icon: { control: 'text' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<UiButtonComponent>;

export const Primary: Story = {
  args: { labelKey: 'Primary', variant: 'primary' },
};

export const Secondary: Story = {
  args: { labelKey: 'Secondary', variant: 'secondary' },
};

export const Danger: Story = {
  args: { labelKey: 'Delete', variant: 'danger' },
};

export const Text: Story = {
  args: { labelKey: 'Text Button', variant: 'text' },
};

export const Loading: Story = {
  args: { labelKey: 'Loading…', variant: 'primary', loading: true },
};

export const Disabled: Story = {
  args: { labelKey: 'Disabled', variant: 'primary', disabled: true },
};
