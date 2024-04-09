import React, { useState } from 'react'
import { Box, Checkbox as Ch, Text } from '@chakra-ui/react'
import BTCLogo from '@/assets/icons/coins/btc'
import DAILogo from '@/assets/icons/coins/dai'
import ETHLogo from '@/assets/icons/coins/eth'
import STRKLogo from '@/assets/icons/coins/strk'
import USDCLogo from '@/assets/icons/coins/usdc'
import USDTLogo from '@/assets/icons/coins/usdt'
import ArrowUp from '@/assets/icons/arrowup'
import DropdownUp from '@/assets/icons/dropdownUpIcon'

interface CheckBoxProps {
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
export const Check = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: CheckBoxProps) => {
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
    <Box display="flex">
        <Ch
            size="100px"
            colorScheme="#4D59E8"
            borderColor="#2B2F35"
            isChecked={true}
            mb="0.2rem"
        />
        <Text>
            Check
        </Text>
    </Box>
  )
}
