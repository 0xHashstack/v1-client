import { NativeToken } from '@/Blockchain/interfaces/interfaces'
import { Box, HStack, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import Image from "next/image";
import Link from "next/link";
interface DropdownProps {
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
export const Footer = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: DropdownProps) => {

  const [openDropdown, setopenDropdown] = useState(false)
  const coins: NativeToken[] = ['BTC', 'USDT', 'USDC', 'ETH', 'STRK']

  return (
    <HStack
      zIndex="14"
      position="fixed"
      bottom="0"
      left="0"
      // backgroundColor="#161B22"
      bgColor="#02010F"
      width="100vw"
      boxShadow="rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      color="#FFF"
      height="2rem"
      // bgColor="red"
      borderY="1px solid #2B2F35"
    >
      <HStack height="100%">
        <Link href={"https://status.hashstack.finance/"} target="_blank">
          <HStack borderRight="1px solid #2B2F35" h="100%" p="8px 3.9rem">
            <Box>
              <Image
                src="/stableConnectionIcon.svg"
                alt="Picture of the author"
                width={10}
                height={10}
              />
            </Box>
            <Text color="#00D395" fontSize="12px">
              Stable Connection
            </Text>
          </HStack>
        </Link>
        <HStack borderRight="1px solid #2B2F35" h="100%" p="8px 2rem">
          <Text color="#676D9A" fontSize="12px">
            Latest Synced block:
          </Text>
          <Box
            height={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={1}
          >
            <Box color="#00D395" fontSize="12px">
              178543
            </Box>
            <Image
              src="/latestSyncedBlockGreenDot.svg"
              alt="Picture of the author"
              width="6"
              height="6"
            />
          </Box>
        </HStack>
   
      </HStack>
      <HStack borderLeft="1px solid #2B2F35" h="100%" p="8px 2rem">
          <Box color="#676D9A" fontSize="12px" display="flex">
            Network: Starknet Mainnet
          </Box>
          <Box
            height={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={1}
          >
            <Image
              src="/latestSyncedBlockGreenDot.svg"
              alt="Picture of the author"
              width="6"
              height="6"
            />
          </Box>
        </HStack>
      {/* <HStack>
        <HStack
          borderX="1px solid #2B2F35"
          h="100%"
          p="8px 2rem"
          cursor="pointer"
        >
          <Text color="#BDBFC1" fontSize="12px">
            Announcement
          </Text>
        </HStack>
        <HStack borderRight="1px solid #2B2F35" h="100%" p="8px 2rem">
          <Text color="#BDBFC1" fontSize="12px">
            Dummy copy
          </Text>
        </HStack>
      </HStack> */}
    </HStack>
  )
}
