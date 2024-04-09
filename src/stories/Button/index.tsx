import { Button as Btn } from '@chakra-ui/react'
import React from 'react'

import './index.css'

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
    <Btn
      height="2rem"
      fontSize="12px"
      padding="6px 12px"
      border="1px solid #3E415C"
      bgColor="transparent"
      _hover={{ bg: 'white', color: 'black' }}
      borderRadius="6px"
      color="#3E415C"
    >
      Supply
    </Btn>
  )
}
