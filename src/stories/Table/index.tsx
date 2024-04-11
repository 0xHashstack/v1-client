import {
  Box,
  Table as ChakraTable,
  HStack,
  Spinner,
  Tab,
  TabList,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Text,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react'
import Image from 'next/image'
import React, { useState } from 'react'

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

const columnItems = ['Market', 'Price', 'Total Supply', 'Supply APR', '', '']

export const Coins: any = [
  { name: 'STRK', icon: 'mdi-strk', symbol: 'STRK' },
  { name: 'USDT', icon: 'mdi-bitcoin', symbol: 'USDT' },
  { name: 'USDC', icon: 'mdi-ethereum', symbol: 'USDC' },
  { name: 'ETH', icon: 'mdi-ethereum', symbol: 'WETH' },
  { name: 'BTC', icon: 'mdi-bitcoin', symbol: 'WBTC' },
  { name: 'DAI', icon: 'mdi-dai', symbol: 'DAI' },
]

export const Table = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: TabsProps) => {
  return (
    <TableContainer
      background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
      color="white"
      borderRadius="md"
      w={'55rem'}
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      height={'100%'}
      paddingX={'2rem'}
      pt={'1.7rem'}
      overflowX="hidden"
    >
      <ChakraTable variant="unstyled" width="100%" height="100%">
        <Thead width={'100%'} height={'2.7rem'}>
          <Tr width={'100%'}>
            {columnItems.map((val: any, idx: any) => (
              <Td key={idx} fontSize={'12px'} fontWeight={400} padding={0}>
                <Text
                  whiteSpace="pre-wrap"
                  overflowWrap="break-word"
                  width={'100%'}
                  height={'2rem'}
                  textAlign={idx == 0 ? 'left' : 'center'}
                  color={'#CBCBD1'}
                  padding={0}
                >
                  <Tooltip
                    hasArrow
                    label={val}
                    placement={'bottom-start'}
                    rounded="md"
                    boxShadow="dark-lg"
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
                    {val}
                  </Tooltip>
                </Text>
              </Td>
            ))}
          </Tr>
        </Thead>

        <Tbody position="relative" overflowX="hidden">
          {Coins.map((coin: any, idx: any) => (
            <>
              <Tr
                key={idx}
                width={'100%'}
                height={'5rem'}
                position="relative"
                bg={
                  coin?.name === 'STRK'
                    ? 'linear-gradient(90deg, #34345600 0%, #34345688 50%, #34345600 100%, #34345600 100%)'
                    : ''
                }
              >
                <Td
                  width={'17%'}
                  fontSize={'12px'}
                  fontWeight={400}
                  padding={0}
                >
                  <HStack
                    gap="10px"
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Box height="2rem" width="2rem">
                      <Image
                        src={
                          coin?.name == 'DAI'
                            ? `/${coin?.name}Disabled.svg`
                            : `/${coin?.name}.svg`
                        }
                        alt={`Picture of the coin that I want to access ${coin?.name}`}
                        width="32"
                        height="32"
                      />
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      gap="1px"
                      pt="3px"
                    >
                      <Box display="flex" gap="0.5rem">
                        <Text fontSize="14px" fontWeight="400">
                          {coin?.name == 'BTC' || coin?.name == 'ETH'
                            ? 'w' + coin?.name
                            : coin?.name}
                        </Text>
                        {coin?.name == 'DAI' && (
                          <Image
                            src={`/paused.svg`}
                            alt={`Picture of the coin that I want to access ${coin?.name}`}
                            width="48"
                            height="16"
                          />
                        )}
                        {coin?.name == 'STRK' && (
                          <Image
                            src={`/new.svg`}
                            alt={`Picture of the coin that I want to access ${coin?.name}`}
                            width="36"
                            height="16"
                          />
                        )}
                      </Box>
                    </Box>
                  </HStack>
                </Td>

                <Td
                  width={'18%'}
                  maxWidth={'3rem'}
                  fontSize={'14px'}
                  fontWeight={400}
                  overflow={'hidden'}
                  textAlign={'center'}
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    color={coin?.name == 'DAI' ? '#3E415C' : 'white'}
                  >
                    100.300
                  </Box>
                </Td>

                <Td
                  width={'18%'}
                  maxWidth={'3rem'}
                  fontSize={'14px'}
                  fontWeight={400}
                  overflow={'hidden'}
                  textAlign={'center'}
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    color={coin?.name == 'DAI' ? '#3E415C' : 'white'}
                  >
                    <Tooltip
                      hasArrow
                      arrowShadowColor="#2B2F35"
                      placement="right"
                      boxShadow="dark-lg"
                      label={'100.0082'}
                      bg="#02010F"
                      fontSize={'13px'}
                      fontWeight={'400'}
                      borderRadius={'lg'}
                      padding={'2'}
                      color="#F0F0F5"
                      border="1px solid"
                      borderColor="#23233D"
                    >
                      100k
                    </Tooltip>
                  </Box>
                </Td>

                <Td
                  width={'18%'}
                  maxWidth={'3rem'}
                  fontSize={'14px'}
                  fontWeight={400}
                  overflow={'hidden'}
                  textAlign={'center'}
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    color={
                      coin?.name == 'DAI'
                        ? '#3E415C'
                        : coin?.name == 'BTC'
                          ? 'white'
                          : '#00D395'
                    }
                  >
                    <Tooltip
                      hasArrow
                      arrowShadowColor="#2B2F35"
                      placement="bottom"
                      boxShadow="dark-lg"
                      label={
                        <Box>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            gap={10}
                          >
                            <Text>Supply APR:</Text>
                            <Text>10%</Text>
                          </Box>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            gap={10}
                            mb="2"
                          >
                            <Text>STRK APR:</Text>
                            <Text>20%</Text>
                          </Box>
                          <hr />
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            gap={10}
                            mt="2"
                          >
                            <Text>Effective APR:</Text>
                            <Text>30 %</Text>
                          </Box>
                        </Box>
                      }
                      bg="#02010F"
                      fontSize={'13px'}
                      fontWeight={'400'}
                      borderRadius={'lg'}
                      padding={'2'}
                      color="#F0F0F5"
                      border="1px solid"
                      borderColor="#23233D"
                    >
                      <Text
                        color={
                          coin?.name == 'DAI'
                            ? '#3E415C'
                            : coin?.name == 'BTC'
                              ? 'white'
                              : '#00D395'
                        }
                      >
                        40%
                      </Text>
                    </Tooltip>
                  </Box>
                </Td>

                <Td
                  width={'4%'}
                  maxWidth={'5rem'}
                  fontSize={'14px'}
                  fontWeight={400}
                  textAlign={'right'}
                  p={0}
                  pr={3}
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                  >
                    Supply
                  </Box>
                </Td>

                <Td
                  width={'7%'}
                  fontSize={'14px'}
                  fontWeight={400}
                  textAlign={'center'}
                  p={0}
                  pl={2}
                >
                  <Box position="relative" display="inline-block">
                    <Text
                      color="#3E415C"
                      borderBottom="1px solid #3E415C"
                      cursor="pointer"
                    >
                      Stake
                    </Text>
                  </Box>
                </Td>
              </Tr>

              <Tr
                style={{
                  position: 'absolute',
                  height: '1px',
                  borderWidth: '0',
                  backgroundColor: '#2b2f35',
                  width: '100%',
                }}
              />
            </>
          ))}
        </Tbody>
      </ChakraTable>
    </TableContainer>
  )
}
