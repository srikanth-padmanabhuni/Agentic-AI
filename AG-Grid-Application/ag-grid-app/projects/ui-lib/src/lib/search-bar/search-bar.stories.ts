import type { Meta, StoryObj } from '@storybook/angular';
import { UiSearchBarComponent } from './search-bar.component';

const meta: Meta<UiSearchBarComponent> = {
  title: 'Components/SearchBar',
  component: UiSearchBarComponent,
  tags: ['autodocs'],
  argTypes: {
    placeholderKey: { control: 'text' },
    debounceMs: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<UiSearchBarComponent>;

export const Default: Story = {
  args: { placeholderKey: 'COMMON.SEARCH', debounceMs: 300 },
};

export const CustomPlaceholder: Story = {
  args: { placeholderKey: 'STORY.PLACEHOLDER', debounceMs: 500 },
};
