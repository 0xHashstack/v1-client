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

      <Box
        width="103%"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        fontWeight="400"
        margin="0 auto"
        gap="2"
        pl="1.1rem"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="22px"
          bgColor="#0C521F"
          color="white"
          p="0px 12px"
          fontSize="12px"
          gap="2"
        >
          Staked
          <Box>0.0007 ETH</Box>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="22px"
          bgColor="#404953"
          color="white"
          p="0px 12px"
          fontSize="12px"
          gap="2"
        >
          Collateral
          <Box>0.0008 ETH</Box>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="22px"
          bgColor="#340c7e"
          color="white"
          p="0px 12px"
          fontSize="12px"
          gap="2"
        >
          Available
          <Box>0.0009 ETH</Box>
        </Box>
      </Box>
    </Box>
  )
}
