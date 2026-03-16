import type { Meta, StoryObj } from '@storybook/angular';
import { UiStepperComponent, StepDef } from './stepper.component';

const threeSteps: StepDef[] = [
  { labelKey: 'STORY.STEP_1' },
  { labelKey: 'STORY.STEP_2' },
  { labelKey: 'STORY.STEP_3' },
];

const fiveSteps: StepDef[] = [
  { labelKey: 'STORY.STEP_1' },
  { labelKey: 'STORY.STEP_2' },
  { labelKey: 'STORY.STEP_3' },
  { labelKey: 'STORY.STEP_4' },
  { labelKey: 'STORY.STEP_5' },
];

const optionalSteps: StepDef[] = [
  { labelKey: 'STORY.STEP_1' },
  { labelKey: 'STORY.STEP_2', optional: true },
  { labelKey: 'STORY.STEP_3' },
];

const meta: Meta<UiStepperComponent> = {
  title: 'Components/Stepper',
  component: UiStepperComponent,
  tags: ['autodocs'],
  argTypes: {
    linear: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
};

export default meta;
type Story = StoryObj<UiStepperComponent>;

// ═══════════════════════════════════════════════════════════
// Horizontal (default orientation)
// ═══════════════════════════════════════════════════════════

export const Horizontal: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-stepper [steps]="steps" [linear]="linear" [orientation]="orientation" #stepper>
        <div style="padding:16px;border:1px solid #ddd;border-radius:6px;background:#fafafa">
          <p style="margin:0 0 12px"><strong>Horizontal stepper</strong> — default layout, steps flow left-to-right.</p>
          <div style="display:flex;gap:8px">
            <button (click)="stepper.previous()" style="padding:6px 16px;border:1px solid #ccc;border-radius:4px;cursor:pointer;background:#fff">\u2190 Previous</button>
            <button (click)="stepper.next()" style="padding:6px 16px;border:none;border-radius:4px;cursor:pointer;background:#1976d2;color:#fff">Next \u2192</button>
          </div>
        </div>
      </ui-stepper>
    `,
  }),
  args: {
    steps: threeSteps,
    linear: true,
    orientation: 'horizontal',
  },
};

export const HorizontalNonLinear: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-stepper [steps]="steps" [linear]="linear" [orientation]="orientation">
        <div style="padding:16px;border:1px solid #ddd;border-radius:6px;background:#fafafa">
          <p style="margin:0">Non-linear mode \u2014 click any step to jump directly.</p>
        </div>
      </ui-stepper>
    `,
  }),
  args: {
    steps: threeSteps,
    linear: false,
    orientation: 'horizontal',
  },
};

export const HorizontalManySteps: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-stepper [steps]="steps" [linear]="linear" [orientation]="orientation" #stepper>
        <div style="padding:16px;border:1px solid #ddd;border-radius:6px;background:#fafafa">
          <p style="margin:0 0 12px">5 steps \u2014 header scrolls horizontally on narrow viewports.</p>
          <div style="display:flex;gap:8px">
            <button (click)="stepper.previous()" style="padding:6px 16px;border:1px solid #ccc;border-radius:4px;cursor:pointer;background:#fff">\u2190 Previous</button>
            <button (click)="stepper.next()" style="padding:6px 16px;border:none;border-radius:4px;cursor:pointer;background:#1976d2;color:#fff">Next \u2192</button>
          </div>
        </div>
      </ui-stepper>
    `,
  }),
  args: {
    steps: fiveSteps,
    linear: false,
    orientation: 'horizontal',
  },
};

// ═══════════════════════════════════════════════════════════
// Vertical orientation
// ═══════════════════════════════════════════════════════════

export const Vertical: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-stepper [steps]="steps" [linear]="linear" [orientation]="orientation" #stepper>
        <div style="padding:16px;border:1px solid #ddd;border-radius:6px;background:#fafafa;min-height:160px">
          <p style="margin:0 0 12px"><strong>Vertical stepper</strong> \u2014 steps listed top-to-bottom, content to the right.</p>
          <div style="display:flex;gap:8px">
            <button (click)="stepper.previous()" style="padding:6px 16px;border:1px solid #ccc;border-radius:4px;cursor:pointer;background:#fff">\u2190 Previous</button>
            <button (click)="stepper.next()" style="padding:6px 16px;border:none;border-radius:4px;cursor:pointer;background:#1976d2;color:#fff">Next \u2192</button>
          </div>
        </div>
      </ui-stepper>
    `,
  }),
  args: {
    steps: threeSteps,
    linear: true,
    orientation: 'vertical',
  },
};

export const VerticalNonLinear: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-stepper [steps]="steps" [linear]="linear" [orientation]="orientation">
        <div style="padding:16px;border:1px solid #ddd;border-radius:6px;background:#fafafa;min-height:160px">
          <p style="margin:0">Vertical non-linear \u2014 click any step to jump.</p>
        </div>
      </ui-stepper>
    `,
  }),
  args: {
    steps: threeSteps,
    linear: false,
    orientation: 'vertical',
  },
};

export const VerticalManySteps: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-stepper [steps]="steps" [linear]="linear" [orientation]="orientation" #stepper>
        <div style="padding:16px;border:1px solid #ddd;border-radius:6px;background:#fafafa;min-height:200px">
          <p style="margin:0 0 12px">5 steps in vertical layout.</p>
          <div style="display:flex;gap:8px">
            <button (click)="stepper.previous()" style="padding:6px 16px;border:1px solid #ccc;border-radius:4px;cursor:pointer;background:#fff">\u2190 Previous</button>
            <button (click)="stepper.next()" style="padding:6px 16px;border:none;border-radius:4px;cursor:pointer;background:#1976d2;color:#fff">Next \u2192</button>
          </div>
        </div>
      </ui-stepper>
    `,
  }),
  args: {
    steps: fiveSteps,
    linear: false,
    orientation: 'vertical',
  },
};

// ═══════════════════════════════════════════════════════════
// With Optional Steps
// ═══════════════════════════════════════════════════════════

export const WithOptionalSteps: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-stepper [steps]="steps" [linear]="linear" [orientation]="orientation" #stepper>
        <div style="padding:16px;border:1px solid #ddd;border-radius:6px;background:#fafafa">
          <p style="margin:0 0 12px">Step 2 is optional \u2014 can be skipped.</p>
          <div style="display:flex;gap:8px">
            <button (click)="stepper.previous()" style="padding:6px 16px;border:1px solid #ccc;border-radius:4px;cursor:pointer;background:#fff">\u2190 Previous</button>
            <button (click)="stepper.next()" style="padding:6px 16px;border:none;border-radius:4px;cursor:pointer;background:#1976d2;color:#fff">Next \u2192</button>
          </div>
        </div>
      </ui-stepper>
    `,
  }),
  args: {
    steps: optionalSteps,
    linear: true,
    orientation: 'horizontal',
  },
};

export const VerticalWithOptional: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-stepper [steps]="steps" [linear]="linear" [orientation]="orientation" #stepper>
        <div style="padding:16px;border:1px solid #ddd;border-radius:6px;background:#fafafa;min-height:160px">
          <p style="margin:0 0 12px">Vertical with optional step.</p>
          <div style="display:flex;gap:8px">
            <button (click)="stepper.previous()" style="padding:6px 16px;border:1px solid #ccc;border-radius:4px;cursor:pointer;background:#fff">\u2190 Previous</button>
            <button (click)="stepper.next()" style="padding:6px 16px;border:none;border-radius:4px;cursor:pointer;background:#1976d2;color:#fff">Next \u2192</button>
          </div>
        </div>
      </ui-stepper>
    `,
  }),
  args: {
    steps: optionalSteps,
    linear: true,
    orientation: 'vertical',
  },
};

// ═══════════════════════════════════════════════════════════
// Two Steps (simple flow)
// ═══════════════════════════════════════════════════════════

export const TwoSteps: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-stepper [steps]="steps" [linear]="linear" [orientation]="orientation" #stepper>
        <div style="padding:16px;border:1px solid #ddd;border-radius:6px;background:#fafafa">
          <p style="margin:0 0 12px">Minimal two-step flow.</p>
          <div style="display:flex;gap:8px">
            <button (click)="stepper.previous()" style="padding:6px 16px;border:1px solid #ccc;border-radius:4px;cursor:pointer;background:#fff">\u2190 Back</button>
            <button (click)="stepper.next()" style="padding:6px 16px;border:none;border-radius:4px;cursor:pointer;background:#1976d2;color:#fff">Continue \u2192</button>
          </div>
        </div>
      </ui-stepper>
    `,
  }),
  args: {
    steps: [
      { labelKey: 'STORY.STEP_1' },
      { labelKey: 'STORY.STEP_2' },
    ],
    linear: true,
    orientation: 'horizontal',
  },
};

// ═══════════════════════════════════════════════════════════
// All Optional (non-linear)
// ═══════════════════════════════════════════════════════════

export const AllOptional: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-stepper [steps]="steps" [linear]="linear" [orientation]="orientation">
        <div style="padding:16px;border:1px solid #ddd;border-radius:6px;background:#fafafa">
          <p style="margin:0">All steps are optional \u2014 user can skip or reorder freely.</p>
        </div>
      </ui-stepper>
    `,
  }),
  args: {
    steps: [
      { labelKey: 'STORY.STEP_1', optional: true },
      { labelKey: 'STORY.STEP_2', optional: true },
      { labelKey: 'STORY.STEP_3', optional: true },
    ],
    linear: false,
    orientation: 'horizontal',
  },
};
