import type { Meta, StoryObj } from '@storybook/angular';
import { UiLanguageSwitcherComponent } from './language-switcher.component';

const meta: Meta<UiLanguageSwitcherComponent> = {
  title: 'Components/LanguageSwitcher',
  component: UiLanguageSwitcherComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<UiLanguageSwitcherComponent>;

export const Default: Story = {};
