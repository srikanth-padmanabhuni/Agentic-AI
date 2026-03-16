import type { Meta, StoryObj } from '@storybook/angular';
import { UiChipComponent } from './chip.component';

const meta: Meta<UiChipComponent> = {
  title: 'Components/Chip',
  component: UiChipComponent,
  tags: ['autodocs'],
  argTypes: {
    labelKey: { control: 'text' },
    color: { control: 'select', options: ['default', 'primary', 'success', 'warning', 'danger'] },
    removable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<UiChipComponent>;

export const Default: Story = {
  args: { labelKey: 'STORY.CHIP', color: 'default' },
};

export const Primary: Story = {
  args: { labelKey: 'STORY.CHIP', color: 'primary' },
};

export const Success: Story = {
  args: { labelKey: 'STORY.CHIP', color: 'success' },
};

export const Warning: Story = {
  args: { labelKey: 'STORY.CHIP', color: 'warning' },
};

export const Danger: Story = {
  args: { labelKey: 'STORY.CHIP', color: 'danger' },
};

export const Removable: Story = {
  args: { labelKey: 'STORY.CHIP', color: 'primary', removable: true },
};
