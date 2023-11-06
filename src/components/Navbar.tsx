import HashstackLogo from '@/assets/hashstacklogo'
import { HStack,Text } from '@chakra-ui/react'
import React from 'react'

const Navbar = () => {
  return (
    <HStack
    padding="10px"
    width="100vw"
    display="flex"
      justifyContent="space-between"
      alignItems="center"
      color="#fff"
      height="3.8125rem"
    >
        <HashstackLogo/>
        <HStack color="white">
            <Text color="white">
                Connect Wallet
            </Text>
            <Text color="white">
                Settings
            </Text>
        </HStack>
    </HStack>
  )
}

export default Navbar