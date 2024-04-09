import { NativeToken } from '@/Blockchain/interfaces/interfaces'
import ArrowUp from '@/assets/icons/arrowup'
import BTCLogo from '@/assets/icons/coins/btc'
import DAILogo from '@/assets/icons/coins/dai'
import ETHLogo from '@/assets/icons/coins/eth'
import STRKLogo from '@/assets/icons/coins/strk'
import USDCLogo from '@/assets/icons/coins/usdc'
import USDTLogo from '@/assets/icons/coins/usdt'
import DropdownUp from '@/assets/icons/dropdownUpIcon'
import numberFormatter from '@/utils/functions/numberFormatter'
import { Box, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

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
export const Dropdown = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: DropdownProps) => {
  const getCoin = (CoinName: string) => {
    switch (CoinName) {
      case 'BTC':
        return <BTCLogo height={'16px'} width={'16px'} />
      case 'USDC':
        return <USDCLogo height={'16px'} width={'16px'} />
      case 'USDT':
        return <USDTLogo height={'16px'} width={'16px'} />
      case 'ETH':
        return <ETHLogo height={'16px'} width={'16px'} />
      case 'DAI':
        return <DAILogo height={'16px'} width={'16px'} />
      case 'STRK':
        return <STRKLogo height={'16px'} width={'16px'} />
      default:
        break
    }
  }
  const [openDropdown, setopenDropdown] = useState(false)
  const coins: NativeToken[] = ['BTC', 'USDT', 'USDC', 'ETH', 'STRK']

  return (
    <Box flexDirection="column" width="380px" {...props} userSelect="none">
      <Box
        display="flex"
        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
        justifyContent="space-between"
        py="2"
        pl="3"
        pr="3"
        mb="1rem"
        mt="0.3rem"
        borderRadius="md"
        className="navbar"
        cursor="pointer"
        onClick={() => {
          setopenDropdown(!openDropdown)
        }}
      >
        <Box display="flex" gap="1">
          <Box p="1">{getCoin('ETH')}</Box>
          <Text color="white">ETH</Text>
        </Box>

        <Box pt="1" className="navbar-button">
          {openDropdown ? <ArrowUp /> : <DropdownUp />}
        </Box>
        {openDropdown && (
          <Box
            w="full"
            left="0"
            bg="#03060B"
            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
            py="2"
            className="dropdown-container"
            boxShadow="dark-lg"
          >
            {coins?.map((coin: NativeToken, index: number) => {
              return (
                <Box
                  key={index}
                  as="button"
                  w="full"
                  // display="flex"
                  alignItems="center"
                  gap="1"
                  pr="2"
                  display={'flex'}
                >
                  {coin === 'ETH' && (
                    <Box
                      w="3px"
                      h="28px"
                      bg="#4D59E8"
                      borderRightRadius="md"
                    ></Box>
                  )}
                  <Box
                    w="full"
                    display="flex"
                    py="5px"
                    pl={`${coin === 'ETH' ? '1' : '5'}`}
                    pr="6px"
                    gap="1"
                    justifyContent="space-between"
                    bg={`${coin === 'ETH' ? '#4D59E8' : 'inherit'}`}
                    borderRadius="md"
                  >
                    <Box display="flex">
                      <Box p="1">{getCoin(coin)}</Box>
                      <Text color="white">
                        {coin == 'BTC' || coin == 'ETH' ? 'w' + coin : coin}
                      </Text>
                    </Box>
                    <Box
                      fontSize="9px"
                      color="#E6EDF3"
                      mt="6px"
                      fontWeight="thin"
                    >
                      Wallet Balance: {numberFormatter(1)} {coin}
                    </Box>
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}
      </Box>
    </Box>
  )
}
