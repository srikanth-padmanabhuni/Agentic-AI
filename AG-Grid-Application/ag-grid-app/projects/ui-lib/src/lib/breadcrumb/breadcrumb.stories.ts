import type { Meta, StoryObj } from '@storybook/angular';
import { UiBreadcrumbComponent } from './breadcrumb.component';

const meta: Meta<UiBreadcrumbComponent> = {
  title: 'Components/Breadcrumb',
  component: UiBreadcrumbComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<UiBreadcrumbComponent>;

export const Default: Story = {
  args: {
    items: [
      { labelKey: 'STORY.HOME', route: '/' },
      { labelKey: 'STORY.SECTION', route: '/section' },
      { labelKey: 'STORY.PAGE' },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ labelKey: 'STORY.HOME' }],
  },
};
