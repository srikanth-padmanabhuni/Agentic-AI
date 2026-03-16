import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { UiTabNavComponent, UiTabItem } from './tab-nav.component';

const storyDecorator = applicationConfig({
  providers: [provideRouter([])],
});

const defaultTabs: UiTabItem[] = [
  { labelKey: 'STORY.TAB_ONE', route: '/one' },
  { labelKey: 'STORY.TAB_TWO', route: '/two' },
  { labelKey: 'STORY.TAB_THREE', route: '/three' },
];

const meta: Meta<UiTabNavComponent> = {
  title: 'Components/TabNav',
  component: UiTabNavComponent,
  tags: ['autodocs'],
  decorators: [storyDecorator],
};

export default meta;
type Story = StoryObj<UiTabNavComponent>;

export const Default: Story = {
  args: {
    tabs: defaultTabs,
    ariaLabel: 'ARIA.TAB_NAVIGATION',
  },
};

export const WithIcons: Story = {
  args: {
    tabs: [
      { labelKey: 'STORY.TAB_ONE', route: '/one', icon: '🏠' },
      { labelKey: 'STORY.TAB_TWO', route: '/two', icon: '⚙️' },
      { labelKey: 'STORY.TAB_THREE', route: '/three', icon: '📊' },
    ],
    ariaLabel: 'ARIA.TAB_NAVIGATION',
  },
};

export const TwoTabs: Story = {
  args: {
    tabs: [
      { labelKey: 'STORY.TAB_ONE', route: '/one' },
      { labelKey: 'STORY.TAB_TWO', route: '/two' },
    ],
  },
};

export const ManyTabs: Story = {
  args: {
    tabs: [
      { labelKey: 'STORY.TAB_ONE', route: '/one', icon: '📄' },
      { labelKey: 'STORY.TAB_TWO', route: '/two', icon: '🔧' },
      { labelKey: 'STORY.TAB_THREE', route: '/three', icon: '📊' },
      { labelKey: 'COMMON.ACTIONS', route: '/actions', icon: '⚡' },
      { labelKey: 'COMMON.STATUS', route: '/status', icon: '📡' },
    ],
  },
};
