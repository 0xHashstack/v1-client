import type { Meta, StoryObj } from '@storybook/react'

import { Banners } from './index'

const meta = {
  title: 'Example/Banners',
  component: Banners,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],

  argTypes: {
    variants: {
      control: {
        type: 'object',
        options: {
          info: {
            label: 'Info',
            name: 'info',
          },
          warning: {
            label: 'Warning',
            name: 'warning',
          },
          danger: {
            label: 'Danger',
            name: 'danger',
          },
        },
      },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof Banners>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    variants: {
      info: {
        label:
          'You have selected a native token as collateral which will be converted to rtokens 1rUSDC = 1.0255USDC',
        name: 'info',
      },
      warning: {
        label:
          "The current collateral and borrowing market combination isn't allowed at this moment.",
        name: 'warning',
      },
      danger: {
        label:
          'We are evaluating few promising DApps to integrate. Please check back at a late time.',
        name: 'danger',
      },
    },
  },
}
