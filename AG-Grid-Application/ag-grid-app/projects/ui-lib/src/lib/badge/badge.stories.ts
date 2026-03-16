import type { Meta, StoryObj } from '@storybook/angular';
import { UiBadgeComponent } from './badge.component';

const meta: Meta<UiBadgeComponent> = {
  title: 'Components/Badge',
  component: UiBadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    labelKey: { control: 'text' },
    color: { control: 'select', options: ['default', 'primary', 'success', 'warning', 'danger'] },
  },
};

export default meta;
type Story = StoryObj<UiBadgeComponent>;

export const Default: Story = {
  args: { labelKey: 'STORY.BADGE', color: 'default' },
};

export const Primary: Story = {
  args: { labelKey: 'STORY.BADGE', color: 'primary' },
};

export const Success: Story = {
  args: { labelKey: 'STORY.BADGE', color: 'success' },
};

export const Warning: Story = {
  args: { labelKey: 'STORY.BADGE', color: 'warning' },
};

export const Danger: Story = {
  args: { labelKey: 'STORY.BADGE', color: 'danger' },
};
