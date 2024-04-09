import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    "@chakra-ui/storybook-addon",
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  refs: {
    "@chakra-ui/react": {
      disable: true,
    },
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['..\\public'],
}
export default config
