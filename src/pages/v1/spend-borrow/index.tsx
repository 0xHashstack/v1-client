import InfoIconBig from '@/assets/icons/infoIconBig'
import MarketDashboard from '@/components/layouts/marketDashboard'
import NavButtons from '@/components/layouts/navButtons'
import Navbar from '@/components/layouts/navbar/Navbar'
import PageCard from '@/components/layouts/pageCard'
import StatsBoard from '@/components/layouts/statsBoard'
import SpendTable from '@/components/layouts/table/spendTable'
import YourBorrowModal from '@/components/modals/yourBorrowModal'
import YourSupplyModal from '@/components/modals/yourSupply'
import LatestSyncedBlock from '@/components/uiElements/latestSyncedBlock'
import Pagination from '@/components/uiElements/pagination'
import useDataLoader from '@/hooks/useDataLoader'
import {
  selectNetAPR,
  selectYourBorrow,
  selectnetAprLoans,
} from '@/store/slices/readDataSlice'
import { selectUserUnspentLoans } from '@/store/slices/userAccountSlice'
import numberFormatter from '@/utils/functions/numberFormatter'
import {
  Box,
  HStack,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
// import WalletConnectModal from "@/components/modals/WalletConnectModal";
const SpendBorrow = () => {
  useDataLoader()
  const totalBorrow = useSelector(selectYourBorrow)
  const netAPR = useSelector(selectnetAprLoans)
  const userLoans = useSelector(selectUserUnspentLoans)
  ////console.log(totalBorrow, "total borrow spend borrow");
  ////console.log(netAPR, "netapr in spend borrow");
  return (
    <PageCard pt="6.5rem">
      <HStack
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        width="95%"
        // bgColor="green"
        // mt="3rem"
        pr="3rem"
        mb="1rem"
      >
        <NavButtons width={70} marginBottom={'0rem'} />
        <HStack
          width="13.5rem"
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          // bgColor="blue"
        >
          <VStack
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={'3px'}
          >
            <Text color="#6e7681" fontSize="14px" alignItems="center">
              Total Borrow
            </Text>
            {totalBorrow == null ? (
              <Skeleton
                width="6rem"
                height="1.9rem"
                startColor="#101216"
                endColor="#2B2F35"
                borderRadius="6px"
              />
            ) : (
              <Text color="#e6edf3" fontSize="20px">
                {totalBorrow ? `$${numberFormatter(totalBorrow)}` : 'NA'}
              </Text>
            )}
          </VStack>
          <VStack gap={'3px'}>
            <Box
              color="#6e7681"
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
                label="Net APR on your borrow is calculated based on the effective APR of each assets, and the collateral amount."
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
              <Text color="#e6edf3" fontSize="20px">
                {netAPR && !Number.isNaN(netAPR) ? `${netAPR}%` : 'NA'}
              </Text>
            )}
          </VStack>
        </HStack>
      </HStack>
      <SpendTable />
      {/* <ToastContainer theme="dark"/> */}

      {/* <WalletConnectModal/> */}
    </PageCard>
  )
}

export default SpendBorrow
