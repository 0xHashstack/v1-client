import { Box, Button as Btn, Text } from '@chakra-ui/react'
import React from 'react'

import './index.css'
import TableInfoIcon from '@/components/layouts/table/tableIcons/infoIcon'

interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean
  /**
   * What background color to use
   */
  backgroundColor?: string
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Button contents
   */
  label: string
  /**
   * Optional click handler
   */
  onClick?: () => void
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary
    ? 'storybook-button--primary'
    : 'storybook-button--secondary'

  return (
    // <button
    //   type="button"
    //   className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
    //   {...props}
    // >
    //   {label}
    //   <style jsx>{`
    //     button {
    //       background-color: ${backgroundColor};
    //     }
    //   `}</style>
    // </button>
    <Box
      display="flex"
      flexDir="column"
      justify-content="center"
      alignItems="center"
      gap="1.5rem"
      width="500px"
    >

      <Box display="flex" gap="1rem" alignItems="center">
        <Text color="grey">Disabled</Text>
        <Btn
          background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
          color="#6E7681"
          size="sm"
          width="200px"
          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
          _hover={{
            bg: 'var(--surface-of-10, rgba(103, 109, 154, 0.10))',
          }}
        >
          Supply
        </Btn>
      </Box>

<Box display="flex" gap="1rem" alignItems="center">
<Text color="grey">Hover</Text>
      <Btn
        height="2rem"
        fontSize="12px"
        padding="6px 12px"
        border="1px solid #6E7681"
        width="200px"
        bgColor="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
        _hover={{ bg: 'white', color: 'black' }}
        borderRadius="6px"
        color="#6E7681"
      >
        Supply
      </Btn>
</Box>

<Box display="flex" gap="1rem" alignItems="center">
<Text color="grey">Active</Text>
      <Btn
        height="2rem"
        fontSize="12px"
        width="200px"
        padding="6px 12px"
        border="1px solid #3E415C"
        bgColor="white"
        _hover={{ bg: 'white', color: 'black' }}
        borderRadius="6px"
        color="black"
      >
        Supply
      </Btn>
</Box>

<Box display="flex" gap="1rem" alignItems="center">
<Text color="grey">Pressed</Text>
      <Btn
        height="2rem"
        fontSize="12px"
        padding="6px 12px"
        border="2px solid #6E7681"
        _hover={{ background: 'white' }}
        width="200px"
        bgColor="white"
        borderRadius="6px"
        color="black"
      >
        Supply
      </Btn>
</Box>

<Box display="flex" gap="1rem" alignItems="center">
<Text color="grey">Progress</Text>
      <Btn
        height="2rem"
        fontSize="12px"
        width="200px"
        padding="6px 12px"
        border="1px solid #3E415C"
        borderRadius="6px"
        color="black"
        style={{
          background: 'linear-gradient(to right, #00D395 25%, white 25%)',
        }}
      >
        Supply
      </Btn>
</Box>
    </Box>
  )
}
