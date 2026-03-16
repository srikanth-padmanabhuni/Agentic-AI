import type { Meta, StoryObj } from '@storybook/angular';
import { UiProgressBarComponent } from './progress-bar.component';

const meta: Meta<UiProgressBarComponent> = {
  title: 'Components/ProgressBar',
  component: UiProgressBarComponent,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    indeterminate: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<UiProgressBarComponent>;

export const Default: Story = {
  args: { value: 45 },
};

export const Complete: Story = {
  args: { value: 100 },
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};
