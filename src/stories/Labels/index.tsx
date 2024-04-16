import ExpandedCoinIcon from '@/assets/expanded/ExpandedCoins'
import ExpandedMarketIcon from '@/assets/expanded/ExpandedMarket'
import { Box, NumberInput, NumberInputField, Text } from '@chakra-ui/react'
import Image from 'next/image'
interface InputProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean

  checked?: boolean

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

export const Labels = ({ ...props }: InputProps) => {
  {
    /* border={`${
    depositAmount > walletBalance
      ? 
      : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
          depositAmount > maximumDepositAmount
        ? '1px solid #CF222E'
        : depositAmount < 0
          ? '1px solid #CF222E'
          : isNaN(depositAmount)
            ? '1px solid #CF222E'
            : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                depositAmount < minimumDepositAmount &&
                depositAmount > 0
              ? '1px solid #CF222E'
              : depositAmount > 0 &&
                  depositAmount <= walletBalance
                ? '1px solid #00D395'
                : '1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
  }`} */
  }
  return (
    <>
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
            <ExpandedMarketIcon
            asset='JEDI_SWAP'
            />
          </Box>
          <Box display="flex" gap="0.5rem">
            <Image
              src={`/MY_SWAP.svg`}
              alt="Picture of the author"
              width="16"
              height="16"
            />
            <ExpandedMarketIcon
            asset='MY_SWAP'
            />
          </Box>
          <Box display="flex" gap="0.5rem">
            <Image
              src={`/ZKlend.svg`}
              alt="Picture of the author"
              width="16"
              height="16"
            />
            <ExpandedMarketIcon
            asset='ZKLEND'
            />
          </Box>
        </Box>
      </Box>
    </>
  )
}
