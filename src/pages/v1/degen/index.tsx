import { Box, HStack, Text, useMediaQuery } from '@chakra-ui/react'
import axios from 'axios'
import { NextPage } from 'next'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { IDeposit } from '@/Blockchain/interfaces/interfaces'
import DegenDashboard from '@/components/layouts/degenDashboard'
import NavButtons from '@/components/layouts/navButtons'
import PageCard from '@/components/layouts/pageCard'
import Pagination from '@/components/uiElements/pagination'
import useDataLoader from '@/hooks/useDataLoader'
import {
  selectJediswapPoolAprs,
  selectOraclePrices,
  selectProtocolStats,
  selectUserDeposits,
  selectYourSupply,
} from '@/store/slices/readDataSlice'
import { Coins } from '@/utils/constants/coin'
import { selectJedistrkTokenAllocation, selectStrkAprData, selectnetSpendBalance } from '@/store/slices/userAccountSlice'

const data = [
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDT',
    maxLeverage: 2,
    maxApr: 28,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDC',
    maxLeverage: 3,
    maxApr: 18,
    actionType: 'Liquidity provision',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Myswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'DAI',
    maxLeverage: 4,
    maxApr: 10,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'BTC',
    maxLeverage: 5,
    maxApr: 180,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Myswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'ETH',
    maxLeverage: 2,
    maxApr: 18,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'STRK',
    maxLeverage: 3,
    maxApr: 18,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Myswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDT',
    maxLeverage: 1,
    maxApr: 18,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDT',
    maxLeverage: 1,
    maxApr: 18,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDT',
    maxLeverage: 2,
    maxApr: 28,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDC',
    maxLeverage: 3,
    maxApr: 18,
    actionType: 'Liquidity provision',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Myswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'DAI',
    maxLeverage: 4,
    maxApr: 10,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'BTC',
    maxLeverage: 5,
    maxApr: 180,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Myswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'ETH',
    maxLeverage: 2,
    maxApr: 18,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'STRK',
    maxLeverage: 3,
    maxApr: 18,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Myswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDT',
    maxLeverage: 1,
    maxApr: 18,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDT',
    maxLeverage: 1,
    maxApr: 18,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDT',
    maxLeverage: 2,
    maxApr: 28,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDC',
    maxLeverage: 3,
    maxApr: 18,
    actionType: 'Liquidity provision',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Myswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'DAI',
    maxLeverage: 4,
    maxApr: 10,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'BTC',
    maxLeverage: 5,
    maxApr: 180,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Myswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'ETH',
    maxLeverage: 2,
    maxApr: 18,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'STRK',
    maxLeverage: 3,
    maxApr: 18,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Myswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDT',
    maxLeverage: 1,
    maxApr: 18,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDT',
    maxLeverage: 1,
    maxApr: 18,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDT',
    maxLeverage: 2,
    maxApr: 28,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDT',
    maxLeverage: 2,
    maxApr: 28,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDC',
    maxLeverage: 3,
    maxApr: 18,
    actionType: 'Liquidity provision',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Myswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'DAI',
    maxLeverage: 4,
    maxApr: 10,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'BTC',
    maxLeverage: 5,
    maxApr: 180,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Myswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'ETH',
    maxLeverage: 2,
    maxApr: 18,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'STRK',
    maxLeverage: 3,
    maxApr: 18,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Myswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDT',
    maxLeverage: 1,
    maxApr: 18,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
  {
    protocol: 'Jediswap',
    stratergy: 'USDC-BTC LP BTC+ETH',
    collateralCoin: 'USDT',
    maxLeverage: 1,
    maxApr: 18,
    actionType: 'Swap',
    collateralSuggestedAmount: 5000,
  },
]

const columnItems = [
  'Strategy Name',
  'Type',
  'Collateral',
  'Collateral Amount',
  'Suggested Leverage',
  'Borrowed Amount',
  'Max APR',
  '',
  ''
]

const Degen: NextPage = () => {
  useDataLoader()

  const [supplyAPRs, setSupplyAPRs]: any = useState<(undefined | number)[]>([])
  const [borrowAPRs, setBorrowAPRs]: any = useState<(undefined | number)[]>([])
  const [currentPagination, setCurrentPagination] = useState<number>(1)
  const [supplies, setSupplies] = useState<IDeposit[]>([])
  const [strategies, setstrategies] = useState<any>([])

  const totalSupply = useSelector(selectYourSupply)
  const stats = useSelector(selectProtocolStats)
  const strkData = useSelector(selectStrkAprData)
  const netSpendBalance = useSelector(selectnetSpendBalance)
  const oraclePrices = useSelector(selectOraclePrices)
  const [netStrkBorrow, setnetStrkBorrow] = useState(0)
  let userDeposits = useSelector(selectUserDeposits)
  const strkTokenAlloactionData: any = useSelector(
    selectJedistrkTokenAllocation
  )
  const getAprByPool = (dataArray: any[], pool: string, l3App: string) => {
    const matchedObject = dataArray.find((item) => {
      if (item.name === 'USDT/USDC') {
        return item.amm === 'jedi' && 'USDC/USDT' === pool
      } else if (item.name == 'ETH/STRK') {
        return item.amm === 'jedi' && 'STRK/ETH' === pool
      } else if (item.name === 'ETH/DAI') {
        return item.amm === 'jedi' && 'DAI/ETH' === pool
      } else {
        return (
          item.name === pool &&
          item.amm ===
            (l3App == 'Jediswap'
              ? 'jedi'
              : l3App == 'ZKlend'
                ? 'zklend'
                : 'myswap')
        )
      }
    })
    return matchedObject ? matchedObject.apr * 100 : 0
  }
  const getBoostedApr = (coin: any) => {
    if (strkData == null) {
      return 0
    } else {
      if (strkData?.[coin]) {
        if (oraclePrices == null) {
          return 0
        } else {
          if (netStrkBorrow != 0) {
            if (netSpendBalance) {
              let value =
                (365 *
                  100 *
                  netStrkBorrow *
                  oraclePrices?.find((curr: any) => curr.name === 'STRK')
                    ?.price) /
                netSpendBalance
              return value
            } else {
              return 0
            }
          } else {
            return 0
          }
        }
      } else {
        return 0
      }
    }
  }
  const getStrkAlloaction = (pool: any) => {
    try {
      if (strkTokenAlloactionData[pool]) {
        return strkTokenAlloactionData[pool][
          strkTokenAlloactionData[pool].length - 1
        ]?.allocation
      } else {
        return 0
      }
    } catch (err) {
      return 0
    }
  }

  const getTvlByPool = (dataArray: any[], pool: string, l3App: string) => {
    const matchedObject = dataArray.find((item) => {
      if (item.name === 'USDT/USDC') {
        return item.amm === 'jedi' && 'USDC/USDT' === pool
      } else if (item.name == 'ETH/STRK') {
        return item.amm === 'jedi' && 'STRK/ETH' === pool
      } else if (item.name === 'ETH/DAI') {
        return item.amm === 'jedi' && 'DAI/ETH' === pool
      } else {
        return (
          item.name === pool &&
          item.amm ===
            (l3App == 'Jediswap'
              ? 'jedi'
              : l3App == 'ZKlend'
                ? 'zklend'
                : 'myswap')
        )
      }
    })
    return matchedObject ? matchedObject.tvl : 1
  }
  const getBoostedAprSupply = (coin: any) => {
    if (strkData == null) {
      return 0
    } else {
      if (strkData?.[coin]) {
        if (oraclePrices == null) {
          return 0
        } else {
          let value = strkData?.[coin]
            ? (365 *
                100 *
                strkData?.[coin][strkData[coin]?.length - 1]?.allocation *
                0.7 *
                oraclePrices?.find((curr: any) => curr.name === 'STRK')
                  ?.price) /
              strkData?.[coin][strkData[coin].length - 1]?.supply_usd
            : 0
          return value
        }
      } else {
        return 0
      }
    }
  }
  const poolAprs = useSelector(selectJediswapPoolAprs)
  const fetchProtocolStats = async () => {
    try {
      setBorrowAPRs([
        stats?.[5].borrowRate,
        stats?.[2].borrowRate,
        stats?.[3].borrowRate,
        stats?.[1].borrowRate,
        stats?.[0].borrowRate,
        stats?.[4].borrowRate,
      ])
      setSupplyAPRs([
        stats?.[5].supplyRate,
        stats?.[2].supplyRate,
        stats?.[3].supplyRate,
        stats?.[1].supplyRate,
        stats?.[0].supplyRate,
        stats?.[4].supplyRate,
      ])
    } catch (error) {}
  }

  useEffect(() => {
    try {
      const fetchStrats = async () => {
        const [res, res3] = await Promise.all([
          axios.get(`https://metricsapimainnet.hashstack.finance/api/degen/strategy`),
          axios.get(`https://metricsapimainnet.hashstack.finance/api/degen/strategy/zklend`)
      ]);
      const concatenatedArray = res.data.concat(res3.data);
        if (concatenatedArray) {
          setstrategies(concatenatedArray.filter((borrow:any)=>{
            return Number(
              borrow?.leverage *
                (-stats?.find(
                  (stat: any) =>
                    stat?.token === borrow?.debt
                )?.borrowRate +
                  getAprByPool(
                    poolAprs,
                    borrow?.secondary,
                    borrow?.dappName
                  ) +
                  getBoostedApr(borrow?.debt) +
                  (100 *
                    365 *
                    (getStrkAlloaction(borrow?.secondary) *
                      oraclePrices?.find(
                        (curr: any) => curr.name === 'STRK'
                      )?.price)) /
                    getTvlByPool(
                      poolAprs,
                      borrow?.secondary,
                      borrow?.dappName
                    )) +
                (stats?.find(
                  (stat: any) =>
                    stat?.token === borrow?.collateral
                )?.supplyRate +
                  getBoostedAprSupply(borrow?.collateral))
            )>0
          }))
        }
      }
      if(poolAprs && strkData && strkTokenAlloactionData && netSpendBalance){
        fetchStrats()
      }
    } catch (err) {
      console.log(err, 'err in fetching strategies')
    }
  }, [poolAprs,strkData,strkTokenAlloactionData,netSpendBalance])

  useEffect(() => {
    if (userDeposits) {
      const supply = userDeposits
      if (!supply) return
      let data: any = []
      let indexes: any = [5, 2, 3, 1, 0, 4]
      let count = 0

      indexes.forEach((index: number) => {
        if (
          supply?.[index]?.rTokenAmountParsed !== 0 ||
          supply?.[index]?.rTokenFreeParsed !== 0 ||
          supply?.[index]?.rTokenLockedParsed !== 0 ||
          supply?.[index]?.rTokenStakedParsed !== 0
        ) {
          if (index == 2 || index == 3) {
            if (
              supply?.[index]?.rTokenAmountParsed > 0.00001 ||
              supply?.[index]?.rTokenFreeParsed > 0.00001 ||
              supply?.[index]?.rTokenLockedParsed > 0.00001 ||
              supply?.[index]?.rTokenStakedParsed > 0.00001
            ) {
              data[index] = supply[index]
              count++
            }
          } else {
            data[index] = supply[index]
            count++
          }
        }
      })
      setSupplies(data)
    }
  }, [userDeposits])

  useEffect(() => {
    if (data) {
      if (data?.length <= (currentPagination - 1) * 6) {
        if (currentPagination > 1) {
          setCurrentPagination(currentPagination - 1)
        }
      }
    }
  }, [data])

  useEffect(() => {
    fetchProtocolStats()
  }, [stats])
  const [isLessThan1350] = useMediaQuery('(max-width: 1350px)')

  return (
    <PageCard pt="6.5rem">
      {totalSupply >= 0 && (
        <Box
          position="relative"
          width={'95%'}
          height={'200px'}
          marginTop="0"
          marginBottom="8"
          paddingX="20"
        >
          <Image
            src="/degen_mode_banner.svg"
            alt="Degen Mode Banner"
            fill
            style={{ objectFit: 'cover', borderRadius: '8px' }}
          />
          <Image
            src="/degen_mode_banner2.svg"
            alt="Degen Mode Banner"
            width={765}
            height={129}
            style={{
              position: 'absolute',
              top: '25px',
              right: '0rem',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
          <Box
            position="absolute"
            top="4"
            left="7"
            maxWidth={{
              md:'25rem',
              xl: '30rem',
              '2xl': '40rem',
            }}
            width="full"
            mt="0.4rem"
            ml="0.4rem"
          >
            <Box
              color="#E6EDF3"
              fontSize={"2.1rem"}
              display="flex"
              alignItems="center"
              gap="2"
              fontWeight="semibold"
            >
              What Is Degen mode?
            </Box>
            <Box>
              <Text
                color="#E6EDF3"
                width="full"
                pt="8px"
                fontSize={isLessThan1350 ?"0.8rem": "1rem"}
                letterSpacing="-0.15px"
                lineHeight="20px"
              >
                These are the tailored strategies based on your supplied assets.
                The protocol provides a default leverage of 5x, which can be
                reduced by increasing the collateral. With this 1-click feature,
                provide the amount and collateral, and the protocol executes
                your chosen strategy, making your capital efficient.
              </Text>
            </Box>
          </Box>
        </Box>
      )}
      <HStack
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        width="95%"
        pr="3rem"
        mb="1rem"
      >
        <NavButtons width={70} marginBottom={'0rem'} />
      </HStack>
      {totalSupply >= 0 && (
        <Box
          display="flex"
          justifyContent="left"
          w="94%"
          mt="0.5rem"
          mb="0.8rem"
          color="#F0F0F5"
          fontSize="sm"
        >
          The borrowing amount is fixed to $5000 worth of assets.
        </Box>
      )}
      <DegenDashboard
        width={'95%'}
        currentPagination={currentPagination}
        setCurrentPagination={setCurrentPagination}
        Coins={Coins}
        columnItems={columnItems}
        Borrows={strategies}
        userLoans={strategies}
        borrowAPRs={borrowAPRs}
        supplyAPRs={supplyAPRs}
        supplies={supplies}
      />
      <Box
        paddingY="1rem"
        width="95%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {totalSupply >= 0 && (
          <Box>
            <Pagination
              currentPagination={currentPagination}
              setCurrentPagination={(x: any) => setCurrentPagination(x)}
              max={strategies?.length || 0}
              rows={6}
            />
          </Box>
        )}
      </Box>
    </PageCard>
  )
}

export default Degen
