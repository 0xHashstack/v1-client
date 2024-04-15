import { Box, Button } from '@chakra-ui/react'
import Image from 'next/image'
import { ToastContainer, toast } from 'react-toastify'

interface TabsProps {
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

export const Toast = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: TabsProps) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexDir="column"
      gap="1.5rem"
    >
      <ToastContainer theme="dark" limit={5} />

      <Button
        width="10rem"
        onClick={() => {
          toast.success('Your transaction has been confirmed!')
        }}
      >
        Success Toast
      </Button>

      <Button
        width="10rem"
        onClick={() => {
          toast.error('Your transaction has been failed!')
        }}
      >
        Error Toast
      </Button>

      <Button
        width="10rem"
        onClick={() => {
          toast.warn('Your transaction is pending!')
        }}
      >
        Warning Toast
      </Button>

      <Button
        width="10rem"
        onClick={() => {
          toast.info('Your transaction is in progress!')
        }}
      >
        Info Toast
      </Button>

      <Button
        width="10rem"
        onClick={() => {
          toast('Your transaction is in progress!')
        }}
      >
        Default Toast
      </Button>
    </Box>
  )
}
