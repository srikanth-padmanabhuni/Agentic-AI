import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { UiInlineEditComponent } from './inline-edit.component';

const meta: Meta<UiInlineEditComponent> = {
  title: 'Components/InlineEdit',
  component: UiInlineEditComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [FormsModule, ReactiveFormsModule] })],
  argTypes: {
    ariaLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<UiInlineEditComponent>;

export const Default: Story = {
  args: { ariaLabel: 'ARIA.INLINE_EDIT' },
};
