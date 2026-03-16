import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { UiRadioComponent } from './radio.component';

const meta: Meta<UiRadioComponent> = {
  title: 'Form/Radio',
  component: UiRadioComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [FormsModule, ReactiveFormsModule] })],
  argTypes: {
    label: { control: 'text' },
    orientation: { control: 'radio', options: ['vertical', 'horizontal'] },
  },
};

export default meta;
type Story = StoryObj<UiRadioComponent>;

export const Default: Story = {
  args: {
    label: 'Notification Preference',
    name: 'notification',
    options: [
      { value: 'email', labelKey: 'Email' },
      { value: 'sms', labelKey: 'SMS' },
      { value: 'push', labelKey: 'Push Notification' },
    ],
  },
};

export const Horizontal: Story = {
  args: {
    label: 'Gender',
    name: 'gender',
    orientation: 'horizontal',
    options: [
      { value: 'male', labelKey: 'Male' },
      { value: 'female', labelKey: 'Female' },
      { value: 'other', labelKey: 'Other' },
    ],
  },
};

export const WithDisabledOption: Story = {
  args: {
    label: 'Plan',
    name: 'plan',
    options: [
      { value: 'free', labelKey: 'Free' },
      { value: 'pro', labelKey: 'Pro' },
      { value: 'enterprise', labelKey: 'Enterprise (Coming Soon)', disabled: true },
    ],
  },
};

export const TwoOptions: Story = {
  args: {
    label: 'Theme',
    name: 'theme',
    orientation: 'horizontal',
    options: [
      { value: 'light', labelKey: 'Light' },
      { value: 'dark', labelKey: 'Dark' },
    ],
  },
};

export const ManyOptions: Story = {
  args: {
    label: 'Priority',
    name: 'priority',
    options: [
      { value: 'critical', labelKey: 'Critical' },
      { value: 'high', labelKey: 'High' },
      { value: 'medium', labelKey: 'Medium' },
      { value: 'low', labelKey: 'Low' },
      { value: 'none', labelKey: 'None' },
    ],
  },
};
