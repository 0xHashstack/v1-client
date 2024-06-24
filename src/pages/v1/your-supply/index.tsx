import { Box, HStack, Skeleton, Text, Tooltip, VStack } from '@chakra-ui/react'
import { NextPage } from 'next'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import InfoIconBig from '@/assets/icons/infoIconBig'
import NavButtons from '@/components/layouts/navButtons'
import PageCard from '@/components/layouts/pageCard'
import SupplyDashboard from '@/components/layouts/supplyDashboard'
import useDataLoader from '@/hooks/useDataLoader'
import {
  selectYourSupply,
  selectnetAprDeposits,
} from '@/store/slices/readDataSlice'
import { Coins } from '@/utils/constants/coin'
import numberFormatter from '@/utils/functions/numberFormatter'

const columnItems = [
  'rToken amount',
  'Exchange rate',
  'Supply APR',
  'Effective APR',
  'Assets Distribution',
  '',
]

const YourSupply: NextPage = () => {
  const [currentPagination, setCurrentPagination] = useState<number>(1)

  const totalSupply = useSelector(selectYourSupply)
  const netAPR = useSelector(selectnetAprDeposits)

  useDataLoader()

  return (
    <PageCard pt="6.5rem">
      <HStack
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        width="95%"
        pr="3rem"
        mb="1rem"
      >
        <NavButtons width={70} marginBottom={'0rem'} />

        <HStack
          width="13.5rem"
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <VStack
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={'3px'}
          >
            <Text color="#6e7681" fontSize="14px" alignItems="center">
              Total Supply
            </Text>

            {totalSupply == null ? (
              <Skeleton
                width="6rem"
                height="1.9rem"
                startColor="#101216"
                endColor="#2B2F35"
                borderRadius="6px"
              />
            ) : (
              <Text color="#e6edf3" fontSize="20px">
                {totalSupply ? `$${numberFormatter(totalSupply)}` : 'NA'}
              </Text>
            )}
          </VStack>

          <VStack gap={'3px'}>
            <Box
              color={'#6e7681'}
              fontSize="14px"
              display="flex"
              alignItems="center"
              gap="2"
            >
              Net APR
              <Tooltip
                hasArrow
                placement="right"
                boxShadow="dark-lg"
                label="Net APR on your supply is calculated based on the effective APR of each assets, and the supply and collateral amount."
                bg="#02010F"
                fontSize={'13px'}
                fontWeight={'400'}
                borderRadius={'lg'}
                padding={'2'}
                color="#F0F0F5"
                border="1px solid"
                borderColor="#23233D"
                arrowShadowColor="#2B2F35"
              >
                <Box>
                  <InfoIconBig />
                </Box>
              </Tooltip>
            </Box>

            {netAPR == null ? (
              <Skeleton
                width="6rem"
                height="1.9rem"
                startColor="#101216"
                endColor="#2B2F35"
                borderRadius="6px"
              />
            ) : (
              <Text
                color={
                  netAPR > 0
                    ? '#00D395'
                    : netAPR == 0
                      ? 'white'
                      : 'rgb(255 94 94)'
                }
                fontSize="20px"
              >
                {netAPR != 0 ? `${netAPR}%` : 'NA'}
              </Text>
            )}
          </VStack>
        </HStack>
      </HStack>

      <SupplyDashboard
        width={'95%'}
        currentPagination={currentPagination}
        Coins={Coins}
        columnItems={columnItems}
      />
    </PageCard>
  )
}

export default YourSupply
