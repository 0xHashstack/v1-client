import type { Meta, StoryObj } from '@storybook/react'

import { Tooltip } from '.'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    label:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero voluptatem illum, animi nemo consectetur sint doloremque saepe earum placeat suscipit.',
    children: 'Hover over me!',
  },
}
