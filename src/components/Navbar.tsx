import HashstackLogo from '@/assets/hashstacklogo'
import SettingsLogo from '@/assets/settingsLogo'
import { HStack,Text,Box } from '@chakra-ui/react'
import React from 'react'

const Navbar = () => {
  return (
    <HStack
    padding="10px"
    width="100vw"
    display="flex"
    background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
      boxShadow="rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px"
      justifyContent="space-between"
      alignItems="center"
      color="#fff"
      height="3.8125rem"
    >
      <Box  ml="1rem">
        <HashstackLogo/>
      </Box>
        <HStack color="white" mr="1rem">
            <Text color="white">
                Connect Wallet
            </Text>
            <Text color="white">
                <SettingsLogo/>
            </Text>
        </HStack>
    </HStack>
  )
}

export default Navbar