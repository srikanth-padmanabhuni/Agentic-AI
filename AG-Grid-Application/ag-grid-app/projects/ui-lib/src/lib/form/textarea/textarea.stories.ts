import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { UiTextareaComponent } from './textarea.component';

const meta: Meta<UiTextareaComponent> = {
  title: 'Form/Textarea',
  component: UiTextareaComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [FormsModule, ReactiveFormsModule] })],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<UiTextareaComponent>;

export const Default: Story = {
  args: { label: 'Description', placeholder: 'Enter a description…', rows: 4 },
};

export const LargeArea: Story = {
  args: { label: 'Notes', placeholder: 'Enter detailed notes…', rows: 8 },
};

export const Required: Story = {
  args: { label: 'Comments', placeholder: 'Leave a comment…', rows: 4, required: true },
};

export const SmallArea: Story = {
  args: { label: 'Short Note', placeholder: 'Brief note…', rows: 2 },
};

export const WithError: Story = {
  args: {
    label: 'Feedback',
    placeholder: 'Your feedback…',
    rows: 4,
    required: true,
    errors: { required: true },
    errorMessages: { required: 'STORY.REQUIRED' },
  },
};
