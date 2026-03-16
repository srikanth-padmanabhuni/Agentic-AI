import type { Meta, StoryObj } from '@storybook/angular';
import { UiLoadingSpinnerComponent } from './loading-spinner.component';

const meta: Meta<UiLoadingSpinnerComponent> = {
  title: 'Components/LoadingSpinner',
  component: UiLoadingSpinnerComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    overlay: { control: 'boolean' },
    messageKey: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<UiLoadingSpinnerComponent>;

export const Small: Story = {
  args: { size: 'sm' },
};

export const Medium: Story = {
  args: { size: 'md' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const WithMessage: Story = {
  args: { size: 'md', messageKey: 'COMMON.LOADING' },
};

export const Overlay: Story = {
  args: { size: 'lg', overlay: true, messageKey: 'COMMON.LOADING' },
};
