import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { UiTextFieldComponent } from './text-field.component';

const meta: Meta<UiTextFieldComponent> = {
  title: 'Form/TextField',
  component: UiTextFieldComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [FormsModule, ReactiveFormsModule] })],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    type: { control: 'select', options: ['text', 'email', 'number', 'url'] },
    required: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<UiTextFieldComponent>;

export const Default: Story = {
  args: { label: 'Full Name', placeholder: 'Enter your name', hint: 'First and last name' },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'user@example.com',
    type: 'email',
    required: true,
    errors: { required: true },
    errorMessages: { required: 'STORY.REQUIRED' },
  },
};

export const Disabled: Story = {
  render: () => ({
    template: `<ui-text-field label="Locked Field" placeholder="Cannot edit"></ui-text-field>`,
    props: {},
  }),
};

export const ReadOnly: Story = {
  args: { label: 'API Key', placeholder: '', readonly: true, hint: 'This field is read-only' },
};

export const EmailType: Story = {
  args: { label: 'Email Address', placeholder: 'user@company.com', type: 'email', required: true },
};

export const NumberType: Story = {
  args: { label: 'Port Number', placeholder: '8080', type: 'number', hint: 'Enter a valid port (1-65535)' },
};

export const WithMultipleErrors: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    required: true,
    errors: { minlength: { requiredLength: 3, actualLength: 1 } },
    errorMessages: { minlength: 'STORY.MIN_LENGTH' },
  },
};

export const FormLayout: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:400px">
        <ui-text-field label="First Name" placeholder="John" [required]="true"></ui-text-field>
        <ui-text-field label="Last Name" placeholder="Doe" [required]="true"></ui-text-field>
        <ui-text-field label="Email" placeholder="john@example.com" type="email"></ui-text-field>
        <ui-text-field label="Phone" placeholder="+1 (555) 000-0000" hint="Optional"></ui-text-field>
      </div>
    `,
  }),
};
