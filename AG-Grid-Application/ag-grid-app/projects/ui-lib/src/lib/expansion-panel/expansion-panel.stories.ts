import type { Meta, StoryObj } from '@storybook/angular';
import { UiExpansionPanelComponent } from './expansion-panel.component';

const meta: Meta<UiExpansionPanelComponent> = {
  title: 'Components/ExpansionPanel',
  component: UiExpansionPanelComponent,
  tags: ['autodocs'],
  argTypes: {
    titleKey: { control: 'text' },
    subtitleKey: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<UiExpansionPanelComponent>;

export const Default: Story = {
  args: { titleKey: 'STORY.PANEL_TITLE', subtitleKey: 'STORY.PANEL_SUBTITLE' },
};

export const TitleOnly: Story = {
  args: { titleKey: 'STORY.PANEL_TITLE' },
};
