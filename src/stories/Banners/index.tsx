import AlertTrade from '@/assets/icons/alertTrade'
import ArrowUp from '@/assets/icons/arrowup'
import BlueInfoIcon from '@/assets/icons/blueinfoicon'
import BTCLogo from '@/assets/icons/coins/btc'
import DAILogo from '@/assets/icons/coins/dai'
import ETHLogo from '@/assets/icons/coins/eth'
import STRKLogo from '@/assets/icons/coins/strk'
import USDCLogo from '@/assets/icons/coins/usdc'
import USDTLogo from '@/assets/icons/coins/usdt'
import DropdownUp from '@/assets/icons/dropdownUpIcon'
import RedinfoIcon from '@/assets/icons/redinfoicon'
import TableClose from '@/components/layouts/table/tableIcons/close'
import { Box, Checkbox as Ch, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

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
export const Banners = ({
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

  return (
    <Box display="flex" flexDirection="column" gap="2rem">
      <Box display="flex" flexDirection="column" gap=".3rem">
        <Text color="white" fontSize="sm">
          Info
        </Text>

        <Box
          display="flex"
          bg={'#222766'}
          color="#F0F0F5"
          fontSize="12px"
          p="4"
          border={'1px solid #3841AA'}
          fontStyle="normal"
          fontWeight="400"
          lineHeight="18px"
          borderRadius="6px"
        >
          <Box pr="3" mt="0.6" cursor="pointer">
            <BlueInfoIcon />
          </Box>
          You have selected a native token as collateral which will be converted
          to rtokens 1rUSDC = 1.0255USDC
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap=".3rem">
        <Text color="white" fontSize="sm">
          Error
        </Text>

        <Box
          display="flex"
          bg={'#480C10'}
          color="#F0F0F5"
          fontSize="12px"
          p="4"
          border={'1px solid #9B1A23'}
          fontStyle="normal"
          fontWeight="400"
          lineHeight="18px"
          borderRadius="6px"
        >
          <Box pr="3" mt="0.9" cursor="pointer">
            <RedinfoIcon />
          </Box>
          The current collateral and borrowing market combination isn&apos;t
          allowed at this moment.
          <Box></Box>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap=".3rem">
        <Text color="white" fontSize="sm">
          Warning
        </Text>

        <Box
          display="flex"
          bg="#4D3C03"
          fontSize="14px"
          p="8px"
          fontStyle="normal"
          fontWeight="400"
          borderRadius="6px"
          justifyContent="start"
          alignItems="flex-start"
        >
          <Box
            cursor="pointer"
            display="flex"
            justifyContent="flex-start"
            alignItems="flex-start"
            pt="2px"
            pr="4px"
          >
            <AlertTrade />
          </Box>
          <Box p="6px 2px" display="flex">
            <Text mt="0.9" fontSize="sm" color="#F0F0F5">
              We are evaluating few promising DApps to integrate. Please check
              back at a late time.
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
