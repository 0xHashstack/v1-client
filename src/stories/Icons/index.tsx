import { Box } from '@chakra-ui/react'
import Image from 'next/image'

import ArrowUp from '@/assets/icons/arrowup'
import BTCLogo from '@/assets/icons/coins/btc'
import DAILogo from '@/assets/icons/coins/dai'
import ETHLogo from '@/assets/icons/coins/eth'
import STRKLogo from '@/assets/icons/coins/strk'
import USDCLogo from '@/assets/icons/coins/usdc'
import USDTLogo from '@/assets/icons/coins/usdt'
import DropdownUp from '@/assets/icons/dropdownUpIcon'
import InfoIcon from '@/assets/icons/infoIcon'
import hoverDashboardIcon from '../../assets/images/hoverDashboardIcon.svg'

export const Icons = () => {
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
          style={{ cursor: 'pointer' }}
        />
        <InfoIcon />
        <DropdownUp />
        <ArrowUp />
        <Image
          src="/settingIcon.svg"
          alt="Picture of the author"
          width="18"
          height="18"
          style={{
            cursor: 'pointer',
          }}
        />
      </Box>
      <Box display="flex" gap="1.5rem">
        {coins.map((coin: any, idx: number) => getCoin(coin))}
      </Box>
    </Box>
  )
}
