import { Box, Text as Tx } from '@chakra-ui/react'

import BlueInfoIcon from '@/assets/icons/blueinfoicon'

interface TextProps {
  label: string
}

/**
 * Primary UI component for user interaction
 */

export const Text = ({ label }: TextProps) => {
  return (
    <Box display="flex">
      <Box pr="3" mt="1" cursor="pointer">
        <BlueInfoIcon />
      </Box>
      <Tx color="#F0F0F5" fontSize="sm">
        {label}
      </Tx>
      <Tx
        color="#4D59E8"
        ml="0.25rem"
        cursor="pointer"
        _hover={{ textDecoration: 'underline' }}
        fontSize="sm"
      >
        guidelines here.
      </Tx>
    </Box>
  )
}
