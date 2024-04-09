import type { Preview } from '@storybook/react'
import { theme } from '../src/pages/_app'
const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'twitter',
      values: [
        {
          name: 'twitter',
          value: '#0E0c1d',
        },
        {
          name: 'facebook',
          value: '#3b5998',
        },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    chakra:{
      theme:theme
    }
  },
}

export default preview
