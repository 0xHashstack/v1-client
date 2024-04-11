import { Box } from '@chakra-ui/react'
import Image from 'next/image'

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

export const Tags = ({
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
      gap="1rem"
    >
      <Image
        src={`/new.svg`}
        alt={`Picture of the coin that I want to access strk`}
        width="56"
        height="36"
      />

      <Image
        src={`/paused.svg`}
        alt={`Picture of the coin that I want to access strk`}
        width="56"
        height="36"
      />
    </Box>
  )
}
