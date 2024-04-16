import React, { useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  RadioGroup,
  Radio as RD,
  Stack,
} from '@chakra-ui/react'
import Image from 'next/image'
import Pagination from '@/components/uiElements/pagination'
import BTCLogo from '@/assets/icons/coins/btc'
import DAILogo from '@/assets/icons/coins/dai'
import ETHLogo from '@/assets/icons/coins/eth'
import STRKLogo from '@/assets/icons/coins/strk'
import USDCLogo from '@/assets/icons/coins/usdc'
import USDTLogo from '@/assets/icons/coins/usdt'
import hoverDashboardIcon from '../../assets/images/hoverDashboardIcon.svg'
import hoverContributeEarnIcon from '../../assets/images/hoverContributeEarnIcon.svg'
import InfoIcon from '@/assets/icons/infoIcon'
import DropdownUp from '@/assets/icons/dropdownUpIcon'
import ArrowUp from '@/assets/icons/arrowup'
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
export const Icons = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: TabsProps) => {
  const coins = ['STRK', 'USDT', 'USDC', 'ETH', 'BTC', 'DAI']
  const getCoin = (CoinName: string) => {
    switch (CoinName) {
      case 'BTC':
        return <BTCLogo height={'32px'} width={'32px'} />
      case 'USDC':
        return <USDCLogo height={'32px'} width={'32px'} />
      case 'USDT':
        return <USDTLogo height={'32px'} width={'32px'} />
      case 'ETH':
        return <ETHLogo height={'32px'} width={'32px'} />
      case 'DAI':
        return <DAILogo height={'32px'} width={'32px'} />
      case 'STRK':
        return <STRKLogo height={'32px'} width={'32px'} />
      default:
        break
    }
  }
  const mode = primary
    ? 'storybook-button--primary'
    : 'storybook-button--secondary'
  const [currentPagination, setCurrentPagination] = useState<number>(1)
  return (
    <Box display="flex" flexDirection="column" gap="2rem">
      <Box display="flex" justifyContent="space-between">
        <Image
          src={hoverDashboardIcon}
          alt="Picture of the author"
          width="16"
          height="16"
          style={{ cursor: 'pointer' }}
        />
        <Image
          src={'/contributeEarnIcon.svg'}
          alt="Picture of the author"
          width="16"
          height="16"
          style={{ cursor: 'pointer' }}
        />
                    <Image
              src="/stake.svg"
              alt="Picture of the author"
              width="16"
              height="16"
              style={{ cursor: 'pointer'  }}
            />
            <InfoIcon/>
            <DropdownUp />
            <ArrowUp />
                          <Image
                src="/settingIcon.svg"
                alt="Picture of the author"
                width="18"
                height="18"
                style={{
                  cursor: "pointer",
                }}
              />
      </Box>
      <Box display="flex" gap="1.5rem">
        {coins.map((coin: any, idx: number) => getCoin(coin))}
      </Box>
    </Box>
  )
}
