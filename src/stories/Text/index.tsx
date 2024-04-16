import BlueInfoIcon from '@/assets/icons/blueinfoicon'
import { Box, Button,Text as Tx } from '@chakra-ui/react'
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

export const Text = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: TabsProps) => {
  return (
    <Box
      display="flex"
    >
        <Box pr="3" mt="1" cursor="pointer">
            <BlueInfoIcon />
          </Box>
        <Tx color="#F0F0F5"
          fontSize="sm">
            The borrowing amount is fixed to $5000 worth of assets. Check for more 
        </Tx>
        <Tx color="#4D59E8" ml="0.25rem" cursor="pointer" _hover={{textDecoration:"underline"}}
          fontSize="sm">
            guidelines  here.
        </Tx>

    </Box>
  )
}
