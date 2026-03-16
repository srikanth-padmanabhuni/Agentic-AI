import type { Meta, StoryObj } from '@storybook/angular';
import { UiThemeSwitcherComponent } from './theme-switcher.component';

const meta: Meta<UiThemeSwitcherComponent> = {
  title: 'Components/ThemeSwitcher',
  component: UiThemeSwitcherComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<UiThemeSwitcherComponent>;

export const Default: Story = {};
