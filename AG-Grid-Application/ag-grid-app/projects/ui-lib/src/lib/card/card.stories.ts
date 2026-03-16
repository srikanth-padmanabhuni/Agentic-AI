import type { Meta, StoryObj } from '@storybook/angular';
import { UiCardComponent } from './card.component';

const meta: Meta<UiCardComponent> = {
  title: 'Components/Card',
  component: UiCardComponent,
  tags: ['autodocs'],
  argTypes: {
    titleKey: { control: 'text' },
    subtitleKey: { control: 'text' },
    elevated: { control: 'boolean' },
    padding: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<UiCardComponent>;

export const Default: Story = {
  args: { titleKey: 'STORY.TITLE', subtitleKey: 'STORY.SUBTITLE', elevated: true, padding: true },
};

export const Flat: Story = {
  args: { titleKey: 'STORY.TITLE', elevated: false, padding: true },
};

export const NoPadding: Story = {
  args: { titleKey: 'STORY.TITLE', elevated: true, padding: false },
};
