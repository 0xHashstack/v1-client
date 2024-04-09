import type { Preview } from '@storybook/react'
import { theme } from '../src/pages/_app'
const preview: Preview = {
  parameters: {
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
