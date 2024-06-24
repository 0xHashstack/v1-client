import { ILoan } from '@/Blockchain/interfaces/interfaces'
import { getUserLoans } from '@/Blockchain/scripts/Loans'
import InfoIconBig from '@/assets/icons/infoIconBig'
import BorrowDashboard from '@/components/layouts/borrowDashboard'
import MarketDashboard from '@/components/layouts/marketDashboard'
import NavButtons from '@/components/layouts/navButtons'
import Navbar from '@/components/layouts/navbar/Navbar'
import PageCard from '@/components/layouts/pageCard'
import StatsBoard from '@/components/layouts/statsBoard'
import YourBorrowModal from '@/components/modals/yourBorrowModal'
import LatestSyncedBlock from '@/components/uiElements/latestSyncedBlock'
import Pagination from '@/components/uiElements/pagination'
import useDataLoader from '@/hooks/useDataLoader'
import {
  selectNetAPR,
  selectUserLoans,
  selectYourBorrow,
  selectnetAprLoans,
  setUserLoans,
} from '@/store/slices/readDataSlice'
import { Coins } from '@/utils/constants/coin'
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
import { useAccount } from '@starknet-react/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const YourBorrow = () => {
  const [currentPagination, setCurrentPagination] = useState<number>(1)
  const columnItems = [
    'Borrow ID',
    'Borrowed',
    'Borrow APR',
    'Effective APR',
    'Collateral',
    'Spend status',
    'Current ROE',
    'Health Factor',
    '',
  ]

  const dispatch = useDispatch()
  const { account, address } = useAccount()
  useDataLoader()
  const UserLoans = useSelector(selectUserLoans)

  useEffect(() => {
    if (UserLoans) {
      if (UserLoans?.length <= (currentPagination - 1) * 6) {
        if (currentPagination > 1) {
          setCurrentPagination(currentPagination - 1)
        }
      }
    }
  }, [UserLoans])

  const totalBorrow = useSelector(selectYourBorrow)
  const netAPR = useSelector(selectnetAprLoans)

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
              <Text
                color={
                  Number(netAPR) < 0
                    ? 'rgb(255 94 94)'
                    : Number(netAPR) == 0
                      ? 'white'
                      : '#00D395'
                }
                fontSize="20px"
              >
                {netAPR && !Number.isNaN(netAPR) ? `${netAPR}%` : 'NA'}
              </Text>
            )}
          </VStack>
        </HStack>
      </HStack>

      <BorrowDashboard
        width={'95%'}
        currentPagination={currentPagination}
        setCurrentPagination={setCurrentPagination}
        Coins={Coins}
        columnItems={columnItems}
        Borrows={UserLoans}
        userLoans={UserLoans}
      />
      <Box
        paddingY="1rem"
        width="95%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Pagination
            currentPagination={currentPagination}
            setCurrentPagination={(x: any) => setCurrentPagination(x)}
            max={UserLoans?.length || 0}
            rows={6}
          />
        </Box>
      </Box>
    </PageCard>
  )
}

export default YourBorrow
