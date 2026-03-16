import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { UiSelectComponent } from './select.component';

const meta: Meta<UiSelectComponent> = {
  title: 'Form/Select',
  component: UiSelectComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [FormsModule, ReactiveFormsModule] })],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<UiSelectComponent>;

export const Default: Story = {
  args: {
    label: 'Role',
    placeholder: 'Select a role',
    options: [
      { value: 'admin', labelKey: 'Administrator' },
      { value: 'editor', labelKey: 'Editor' },
      { value: 'viewer', labelKey: 'Viewer' },
    ],
  },
};

export const Required: Story = {
  args: {
    label: 'Status',
    required: true,
    options: [
      { value: 'active', labelKey: 'Active' },
      { value: 'inactive', labelKey: 'Inactive' },
    ],
  },
};

export const WithPlaceholder: Story = {
  args: {
    label: 'Country',
    placeholder: 'Choose a country…',
    options: [
      { value: 'us', labelKey: 'United States' },
      { value: 'uk', labelKey: 'United Kingdom' },
      { value: 'de', labelKey: 'Germany' },
      { value: 'fr', labelKey: 'France' },
      { value: 'jp', labelKey: 'Japan' },
    ],
  },
};

export const ManyOptions: Story = {
  args: {
    label: 'Timezone',
    placeholder: 'Select timezone',
    options: [
      { value: 'utc-12', labelKey: 'UTC−12:00' },
      { value: 'utc-11', labelKey: 'UTC−11:00' },
      { value: 'utc-10', labelKey: 'UTC−10:00 (Hawaii)' },
      { value: 'utc-8', labelKey: 'UTC−08:00 (Pacific)' },
      { value: 'utc-7', labelKey: 'UTC−07:00 (Mountain)' },
      { value: 'utc-6', labelKey: 'UTC−06:00 (Central)' },
      { value: 'utc-5', labelKey: 'UTC−05:00 (Eastern)' },
      { value: 'utc+0', labelKey: 'UTC±00:00 (London)' },
      { value: 'utc+1', labelKey: 'UTC+01:00 (Berlin)' },
      { value: 'utc+5.5', labelKey: 'UTC+05:30 (India)' },
      { value: 'utc+8', labelKey: 'UTC+08:00 (Singapore)' },
      { value: 'utc+9', labelKey: 'UTC+09:00 (Tokyo)' },
    ],
  },
};

export const WithError: Story = {
  args: {
    label: 'Department',
    required: true,
    placeholder: 'Select department',
    options: [
      { value: 'eng', labelKey: 'Engineering' },
      { value: 'hr', labelKey: 'Human Resources' },
      { value: 'finance', labelKey: 'Finance' },
    ],
    errors: { required: true },
    errorMessages: { required: 'STORY.REQUIRED' },
  },
};
