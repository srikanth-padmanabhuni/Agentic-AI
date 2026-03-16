import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { UiPasswordFieldComponent } from './password-field.component';

const meta: Meta<UiPasswordFieldComponent> = {
  title: 'Form/PasswordField',
  component: UiPasswordFieldComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [FormsModule, ReactiveFormsModule] })],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<UiPasswordFieldComponent>;

export const Default: Story = {
  args: { label: 'Password', placeholder: 'Enter password' },
};

export const Required: Story = {
  args: { label: 'New Password', placeholder: 'Min 8 characters', required: true },
};

export const WithError: Story = {
  args: {
    label: 'Confirm Password',
    placeholder: 'Re-enter password',
    required: true,
    errors: { mismatch: true },
    errorMessages: { mismatch: 'STORY.PASSWORD_MISMATCH' },
  },
};

export const WithMultipleErrors: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter a strong password',
    required: true,
    errors: { minlength: true, uppercase: true },
    errorMessages: {
      minlength: 'STORY.MIN_LENGTH',
      uppercase: 'STORY.UPPERCASE_REQUIRED',
    },
  },
};

export const LoginForm: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
        <ui-text-field label="Username" placeholder="Enter username" [required]="true"></ui-text-field>
        <ui-password-field label="Password" placeholder="Enter password" [required]="true"></ui-password-field>
      </div>
    `,
  }),
};
