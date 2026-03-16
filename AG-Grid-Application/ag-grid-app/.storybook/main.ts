import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../projects/ui-lib/src/lib/**/*.stories.ts'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  addons: [],
};

export default config;
