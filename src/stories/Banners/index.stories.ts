import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Banners } from './index'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/Banners',
  component: Banners,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
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
export const Primary: Story = {
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
