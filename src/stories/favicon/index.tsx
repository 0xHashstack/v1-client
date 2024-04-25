import { Box } from '@chakra-ui/react'
import Image from 'next/image'

import ExpandedCoinIcon from '@/assets/expanded/ExpandedCoins'
import ExpandedMarketIcon from '@/assets/expanded/ExpandedMarket'

export const FavIcon = () => {
  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <Box display="flex" flexDirection="column" gap="1rem" >
        <Image
            src="/favicon-32x32.png"
            width={32}
            height={32}
            alt="Logo"
        />
      </Box>
    </Box>
  )
}
