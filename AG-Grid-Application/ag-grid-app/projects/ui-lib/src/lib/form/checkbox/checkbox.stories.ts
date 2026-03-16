import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { UiCheckboxComponent } from './checkbox.component';

const meta: Meta<UiCheckboxComponent> = {
  title: 'Form/Checkbox',
  component: UiCheckboxComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [FormsModule, ReactiveFormsModule] })],
  argTypes: {
    label: { control: 'text' },
    ariaLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<UiCheckboxComponent>;

export const Default: Story = {
  args: { label: 'Accept terms and conditions' },
};

export const WithAriaLabel: Story = {
  args: { label: 'Enable notifications', ariaLabel: 'Toggle notifications' },
};

export const Disabled: Story = {
  render: () => ({
    template: `<ui-checkbox label="Disabled option"></ui-checkbox>`,
    props: {},
  }),
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('ui-checkbox') as any;
    if (checkbox) {
      const comp = checkbox.__ngContext__?.[8];
      if (comp?.setDisabledState) comp.setDisabledState(true);
    }
  },
};

export const CheckboxGroup: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px">
        <ui-checkbox label="Option A — Receive emails"></ui-checkbox>
        <ui-checkbox label="Option B — Receive SMS"></ui-checkbox>
        <ui-checkbox label="Option C — Receive push notifications"></ui-checkbox>
      </div>
    `,
  }),
};

export const PreChecked: Story = {
  render: () => ({
    template: `<ui-checkbox label="I agree to the privacy policy"></ui-checkbox>`,
    props: {},
  }),
};
