import { Box } from '@chakra-ui/react'
import Image from 'next/image'

import ExpandedCoinIcon from '@/assets/expanded/ExpandedCoins'
import ExpandedMarketIcon from '@/assets/expanded/ExpandedMarket'

export const Labels = () => {
  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <Box display="flex" gap="0.5rem">
        <ExpandedCoinIcon asset="USDT" />
        <ExpandedCoinIcon asset="USDC" />
        <ExpandedCoinIcon asset="STRK" />
        <ExpandedCoinIcon asset="DAI" />
        <ExpandedCoinIcon asset="BTC" />
        <ExpandedCoinIcon asset="ETH" />
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" gap="0.5rem">
          <Image
            src={`/Jediswap.svg`}
            alt="Picture of the author"
            width="16"
            height="16"
          />
          <ExpandedMarketIcon asset="JEDI_SWAP" />
        </Box>
        <Box display="flex" gap="0.5rem">
          <Image
            src={`/MY_SWAP.svg`}
            alt="Picture of the author"
            width="16"
            height="16"
          />
          <ExpandedMarketIcon asset="MY_SWAP" />
        </Box>
        <Box display="flex" gap="0.5rem">
          <Image
            src={`/ZKlend.svg`}
            alt="Picture of the author"
            width="16"
            height="16"
          />
          <ExpandedMarketIcon asset="ZKLEND" />
        </Box>
      </Box>
    </Box>
  )
}
