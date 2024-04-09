import React, { useState } from 'react'
import { Box, Text } from '@chakra-ui/react'
import BTCLogo from '@/assets/icons/coins/btc'
import DAILogo from '@/assets/icons/coins/dai'
import ETHLogo from '@/assets/icons/coins/eth'
import STRKLogo from '@/assets/icons/coins/strk'
import USDCLogo from '@/assets/icons/coins/usdc'
import USDTLogo from '@/assets/icons/coins/usdt'
import ArrowUp from '@/assets/icons/arrowup'
import DropdownUp from '@/assets/icons/dropdownUpIcon'

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
        return <BTCLogo height={'28px'} width={'28px'} />
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
  const mode = primary
    ? 'storybook-button--primary'
    : 'storybook-button--secondary'
  return (
    <Box  flexDirection="column">
      <Box
        display="flex"
        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
        justifyContent="space-between"
        alignItems="center"
        py="2"
        pl="9"
        pr="9"
        mb="1rem"
        mt="0.3rem"
        borderRadius="6px"
        className="navbar"
        cursor="pointer"
        onClick={() => {
          setopenDropdown(!openDropdown)
        }}
      >
        <Box display="flex" gap="8">
          <Box p="1" mt="0.6rem">{getCoin('BTC')}</Box>
          <Text color="white">BTC</Text>
        </Box>

        <Box pt="1" ml="0.4rem"  className="navbar-button">
          {openDropdown ? <ArrowUp />:<DropdownUp/>}
        </Box>

      </Box>
        {openDropdown && (
          <Box
            as="button"
            w="full"
            // display="flex"
            alignItems="center"
            gap="1"
            pr="2"
            display={'flex'}
          >
            <Box w="3px" h="28px" bg="#4D59E8" borderRightRadius="md"></Box>
            <Box
              w="full"
              display="flex"
              py="5px"
              pl="1"
              pr="6px"
              gap="1"
              justifyContent="space-between"
              bg="#4D59E8"
              borderRadius="md"
            >
              <Box display="flex">
                <Box p="1">{getCoin('USDT')}</Box>
                <Text color="white">{'USDT'}</Text>
              </Box>
              <Box fontSize="9px" color="#E6EDF3" mt="6px" fontWeight="thin">
                Wallet Balance:{' '}
                {/* {assetBalance[coin]?.dataBalanceOf?.balance
            ? numberFormatter(
                parseAmount(
                    String(
                    uint256.uint256ToBN(
                        assetBalance[coin]?.dataBalanceOf
                        ?.balance
                    )
                    ),
                    tokenDecimalsMap[coin]
                )
                )
            : '-'} */}
              </Box>
            </Box>
          </Box>
        )}
    </Box>
  )
}
