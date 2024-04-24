import { Box,HStack,Table,TableContainer,Tbody,Td,Text, Thead, Tr } from '@chakra-ui/react'
import Image from 'next/image'

import ExpandedCoinIcon from '@/assets/expanded/ExpandedCoins'
import ExpandedMarketIcon from '@/assets/expanded/ExpandedMarket'

export const DataBlue: any = [
    { name: 'Blue', value: 'darker', sample: '#222766' },
    { name: 'Blue', value: 'dark', sample: '#3841AA' },
    { name: 'USDC', value: 'default', sample: '#4D59E8' },
    { name: 'ETH', value: 'light', sample: '#C7CBF6' },
    { name: 'BTC', value: 'lighter', sample: '#EDEEFC' },
  ]

export const DataTeal: any = [
    { name: 'Blue', value: 'darker', sample: '#004A35' },
    { name: 'Blue', value: 'dark', sample: '#019E71' },
    { name: 'USDC', value: 'default', sample: '#00D395' },
    { name: 'ETH', value: 'light', sample: '#B0F1DE' },
    { name: 'BTC', value: 'lighter', sample: '#E6FBF4' },
  ]

  export const DataPurple: any = [
    { name: 'Blue', value: 'darker', sample: '#281152' },
    { name: 'Blue', value: 'dark', sample: '#5625B0' },
    { name: 'USDC', value: 'default', sample: '#7331EA' },
    { name: 'ETH', value: 'light', sample: '#D4BFF8' },
    { name: 'BTC', value: 'lighter', sample: '#F1EAFD' },
  ]

  export const DataGrey: any = [
    { name: 'Blue', value: 'darker', sample: '#071F41' },
    { name: 'Blue', value: 'dark', sample: '#465670' },
    { name: 'USDC', value: 'default', sample: '#758195' },
    { name: 'ETH', value: 'light', sample: '#8490A1' },
    { name: 'BTC', value: 'lighter', sample: '#DCDFE3' },
  ]

  export const DataRed: any = [
    { name: 'Blue', value: 'darker', sample: '#480C10' },
    { name: 'Blue', value: 'dark', sample: '#9B1A23' },
    { name: 'USDC', value: 'default', sample: '#CF222E' },
    { name: 'ETH', value: 'light', sample: '#F0BABE' },
    { name: 'BTC', value: 'lighter', sample: '#FAE9EA' },
  ]
  export const DataGreen: any = [
    { name: 'Blue', value: 'darker', sample: '#10391B' },
    { name: 'Blue', value: 'dark', sample: '#227B3B' },
    { name: 'USDC', value: 'default', sample: '#2DA44E' },
    { name: 'ETH', value: 'light', sample: '#BEE3C8' },
    { name: 'BTC', value: 'lighter', sample: '#EAF6ED' },
  ]
  export const DataYellow: any = [
    { name: 'Blue', value: 'darker', sample: '#4D3C03' },
    { name: 'Blue', value: 'dark', sample: '#A48007' },
    { name: 'USDC', value: 'default', sample: '#DBAB09' },
    { name: 'ETH', value: 'light', sample: '#F4E5B3' },
    { name: 'BTC', value: 'lighter', sample: '#FBF7E6' },
  ]
  export const DataOrange: any = [
    { name: 'Blue', value: 'default', sample: '#D97008' },
  ]
  
export const Colors = () => {
    const columnItems = ['Brand name', 'Value', 'Sample']
  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <Box display="flex" flexDirection="column" gap="1rem" >
        <Text color="#fff">
            Core Brand Colors
        </Text>
        <Box display='flex' gap="2rem">
            <Box padding='24px 96px 24px 24px' display='flex' flexDirection="column" gap="0.5rem" borderRadius="6px" border="1px solid #758195">
                <Box bg="#4D59E8" height="67px" width="67px" borderRadius="6px">                   
                </Box>
                <Text color='#fff' fontWeight="500">
                    Blue
                </Text>
                <Text color='#fff' fontWeight="300">
                    #4D59E8
                </Text>
            </Box>
            <Box padding='24px 96px 24px 24px' display='flex' flexDirection="column" gap="0.5rem" borderRadius="6px" border="1px solid #758195">
                <Box bg="#00D395" height="67px" width="67px" borderRadius="6px">                   
                </Box>
                <Text color='#fff' fontWeight="500">
                    Teal
                </Text>
                <Text color='#fff' fontWeight="300">
                #00D395
                </Text>
            </Box>
            <Box padding='24px 96px 24px 24px' display='flex' flexDirection="column" gap="0.5rem" borderRadius="6px" border="1px solid #758195">
                <Box bg="#7331EA" height="67px" width="67px" borderRadius="6px">                   
                </Box>
                <Text color='#fff' fontWeight="500">
                    Purple
                </Text>
                <Text color='#fff' fontWeight="300">
                #7331EA
                </Text>
            </Box>
            <Box padding='24px 96px 24px 24px' display='flex' flexDirection="column" gap="0.5rem" borderRadius="6px" border="1px solid #758195">
                <Box bg="#758195" height="67px" width="67px" borderRadius="6px">                   
                </Box>
                <Text color='#fff' fontWeight="500">
                    Grey
                </Text>
                <Text color='#fff' fontWeight="300">
                #758195
                </Text>
            </Box>

        </Box>
        <Text color="#fff" mt="1rem">
            Root tokens
        </Text>
        <Box display='flex' gap="4rem">
            <Box display='flex' flexDirection="column" gap='0.5rem'>
                <Text color="#fff">
                    Blue
                </Text>
                <Box>
                <TableContainer
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
      color="white"
      borderRadius="md"
      w={'35rem'}
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      height={'100%'}
    //   paddingX={'2rem'}
      pt={'1.7rem'}
      overflowX="hidden"
    >
      <Table variant="unstyled" width="100%" height="100%">
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
                  color={'white'}
                  fontWeight="600"
                  padding={0}
                  pl="2rem"
                >
                    {val}
                </Text>
              </Td>
            ))}
          </Tr>
        </Thead>

        <Tbody position="relative" overflowX="hidden">
          {DataBlue.map((coin: any, idx: any) => (
            <>
                          <Tr
                style={{
                  position: 'absolute',
                  height: '1px',
                  borderWidth: '0',
                  backgroundColor: '#2b2f35',
                  width: '100%',
                }}
              />
              <Tr
                key={idx}
                width={'100%'}
                height={'5rem'}
                position="relative"
                color={'white'}
                // bg={
                //   coin?.name === 'STRK'
                //     ? 'linear-gradient(90deg, #34345600 0%, #34345688 50%, #34345600 100%, #34345600 100%)'
                //     : ''
                // }
              >
                <Td
                  width={'17%'}
                  fontSize={'12px'}
                  fontWeight={400}
                  padding={0}
                  pl="2.5rem"
                >
                  <HStack
                    gap="10px"
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
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
                            Blue
                        </Text>
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
                  textAlign={'right'}
                  pl="6rem"
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    // justifyContent="center"
                    fontWeight="400"
                    
                  >
                    {coin.value}
                  </Box>
                </Td>

                <Td
                  width={'18%'}
                  maxWidth={'3rem'}
                  fontSize={'14px'}
                  fontWeight={400}
                  overflow={'hidden'}
                  textAlign={'center'}
                  pl="3rem"
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    
                  >
                    <Box bg={coin.sample} height="16px" width="16px" borderRadius="4px" mr="0.4rem">
                    </Box>
                    <Text>
                        {coin.sample}
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
      </Table>
    </TableContainer>
                </Box>
            </Box>
            <Box display='flex' flexDirection="column" gap='0.5rem'>
                <Text color="#fff">
                    Teal
                </Text>
                <Box>
                <TableContainer
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
      color="white"
      borderRadius="md"
      w={'35rem'}
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      height={'100%'}
    //   paddingX={'2rem'}
      pt={'1.7rem'}
      overflowX="hidden"
    >
      <Table variant="unstyled" width="100%" height="100%">
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
                  color={'white'}
                  fontWeight="600"
                  padding={0}
                  pl="2rem"
                >
                    {val}
                </Text>
              </Td>
            ))}
          </Tr>
        </Thead>

        <Tbody position="relative" overflowX="hidden">
          {DataTeal.map((coin: any, idx: any) => (
            <>
                          <Tr
                style={{
                  position: 'absolute',
                  height: '1px',
                  borderWidth: '0',
                  backgroundColor: '#2b2f35',
                  width: '100%',
                }}
              />
              <Tr
                key={idx}
                width={'100%'}
                height={'5rem'}
                position="relative"
                color={'white'}
                // bg={
                //   coin?.name === 'STRK'
                //     ? 'linear-gradient(90deg, #34345600 0%, #34345688 50%, #34345600 100%, #34345600 100%)'
                //     : ''
                // }
              >
                <Td
                  width={'17%'}
                  fontSize={'12px'}
                  fontWeight={400}
                  padding={0}
                  pl="2.5rem"
                >
                  <HStack
                    gap="10px"
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
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
                            Teal
                        </Text>
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
                  textAlign={'right'}
                  pl="6rem"
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    // justifyContent="center"
                    fontWeight="400"
                    
                  >
                    {coin.value}
                  </Box>
                </Td>

                <Td
                  width={'18%'}
                  maxWidth={'3rem'}
                  fontSize={'14px'}
                  fontWeight={400}
                  overflow={'hidden'}
                  textAlign={'center'}
                  pl="3rem"
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    
                  >
                    <Box bg={coin.sample} height="16px" width="16px" borderRadius="4px" mr="0.4rem">
                    </Box>
                    <Text>
                        {coin.sample}
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
      </Table>
    </TableContainer>
                </Box>
            </Box>
        </Box>
        <Box display='flex' gap="4rem" mt="2rem">
            <Box display='flex' flexDirection="column" gap='0.5rem'>
                <Text color="#fff">
                    Purple
                </Text>
                <Box>
                <TableContainer
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
      color="white"
      borderRadius="md"
      w={'35rem'}
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      height={'100%'}
    //   paddingX={'2rem'}
      pt={'1.7rem'}
      overflowX="hidden"
    >
      <Table variant="unstyled" width="100%" height="100%">
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
                  color={'white'}
                  fontWeight="600"
                  padding={0}
                  pl="2rem"
                >
                    {val}
                </Text>
              </Td>
            ))}
          </Tr>
        </Thead>

        <Tbody position="relative" overflowX="hidden">
          {DataPurple.map((coin: any, idx: any) => (
            <>
                          <Tr
                style={{
                  position: 'absolute',
                  height: '1px',
                  borderWidth: '0',
                  backgroundColor: '#2b2f35',
                  width: '100%',
                }}
              />
              <Tr
                key={idx}
                width={'100%'}
                height={'5rem'}
                position="relative"
                color={'white'}
                // bg={
                //   coin?.name === 'STRK'
                //     ? 'linear-gradient(90deg, #34345600 0%, #34345688 50%, #34345600 100%, #34345600 100%)'
                //     : ''
                // }
              >
                <Td
                  width={'17%'}
                  fontSize={'12px'}
                  fontWeight={400}
                  padding={0}
                  pl="2.5rem"
                >
                  <HStack
                    gap="10px"
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
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
                            Purple
                        </Text>
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
                  textAlign={'right'}
                  pl="6rem"
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    // justifyContent="center"
                    fontWeight="400"
                    
                  >
                    {coin.value}
                  </Box>
                </Td>

                <Td
                  width={'18%'}
                  maxWidth={'3rem'}
                  fontSize={'14px'}
                  fontWeight={400}
                  overflow={'hidden'}
                  textAlign={'center'}
                  pl="3rem"
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    
                  >
                    <Box bg={coin.sample} height="16px" width="16px" borderRadius="4px" mr="0.4rem">
                    </Box>
                    <Text>
                        {coin.sample}
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
      </Table>
    </TableContainer>
                </Box>
            </Box>
            <Box display='flex' flexDirection="column" gap='0.5rem'>
                <Text color="#fff">
                    Grey
                </Text>
                <Box>
                <TableContainer
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
      color="white"
      borderRadius="md"
      w={'35rem'}
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      height={'100%'}
    //   paddingX={'2rem'}
      pt={'1.7rem'}
      overflowX="hidden"
    >
      <Table variant="unstyled" width="100%" height="100%">
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
                  color={'white'}
                  fontWeight="600"
                  padding={0}
                  pl="2rem"
                >
                    {val}
                </Text>
              </Td>
            ))}
          </Tr>
        </Thead>

        <Tbody position="relative" overflowX="hidden">
          {DataGrey.map((coin: any, idx: any) => (
            <>
                          <Tr
                style={{
                  position: 'absolute',
                  height: '1px',
                  borderWidth: '0',
                  backgroundColor: '#2b2f35',
                  width: '100%',
                }}
              />
              <Tr
                key={idx}
                width={'100%'}
                height={'5rem'}
                position="relative"
                color={'white'}
                // bg={
                //   coin?.name === 'STRK'
                //     ? 'linear-gradient(90deg, #34345600 0%, #34345688 50%, #34345600 100%, #34345600 100%)'
                //     : ''
                // }
              >
                <Td
                  width={'17%'}
                  fontSize={'12px'}
                  fontWeight={400}
                  padding={0}
                  pl="2.5rem"
                >
                  <HStack
                    gap="10px"
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
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
                            Grey
                        </Text>
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
                  textAlign={'right'}
                  pl="6rem"
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    // justifyContent="center"
                    fontWeight="400"
                    
                  >
                    {coin.value}
                  </Box>
                </Td>

                <Td
                  width={'18%'}
                  maxWidth={'3rem'}
                  fontSize={'14px'}
                  fontWeight={400}
                  overflow={'hidden'}
                  textAlign={'center'}
                  pl="3rem"
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    
                  >
                    <Box bg={coin.sample} height="16px" width="16px" borderRadius="4px" mr="0.4rem">
                    </Box>
                    <Text>
                        {coin.sample}
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
      </Table>
    </TableContainer>
                </Box>
            </Box>
        </Box>
        <Box display='flex' gap="4rem" mt="2rem">
            <Box display='flex' flexDirection="column" gap='0.5rem'>
                <Text color="#fff">
                    Red
                </Text>
                <Box>
                <TableContainer
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
      color="white"
      borderRadius="md"
      w={'35rem'}
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      height={'100%'}
    //   paddingX={'2rem'}
      pt={'1.7rem'}
      overflowX="hidden"
    >
      <Table variant="unstyled" width="100%" height="100%">
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
                  color={'white'}
                  fontWeight="600"
                  padding={0}
                  pl="2rem"
                >
                    {val}
                </Text>
              </Td>
            ))}
          </Tr>
        </Thead>

        <Tbody position="relative" overflowX="hidden">
          {DataRed.map((coin: any, idx: any) => (
            <>
                          <Tr
                style={{
                  position: 'absolute',
                  height: '1px',
                  borderWidth: '0',
                  backgroundColor: '#2b2f35',
                  width: '100%',
                }}
              />
              <Tr
                key={idx}
                width={'100%'}
                height={'5rem'}
                position="relative"
                color={'white'}
                // bg={
                //   coin?.name === 'STRK'
                //     ? 'linear-gradient(90deg, #34345600 0%, #34345688 50%, #34345600 100%, #34345600 100%)'
                //     : ''
                // }
              >
                <Td
                  width={'17%'}
                  fontSize={'12px'}
                  fontWeight={400}
                  padding={0}
                  pl="2.5rem"
                >
                  <HStack
                    gap="10px"
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
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
                            Red
                        </Text>
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
                  textAlign={'right'}
                  pl="6rem"
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    // justifyContent="center"
                    fontWeight="400"
                    
                  >
                    {coin.value}
                  </Box>
                </Td>

                <Td
                  width={'18%'}
                  maxWidth={'3rem'}
                  fontSize={'14px'}
                  fontWeight={400}
                  overflow={'hidden'}
                  textAlign={'center'}
                  pl="3rem"
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    
                  >
                    <Box bg={coin.sample} height="16px" width="16px" borderRadius="4px" mr="0.4rem">
                    </Box>
                    <Text>
                        {coin.sample}
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
      </Table>
    </TableContainer>
                </Box>
            </Box>
            <Box display='flex' flexDirection="column" gap='0.5rem'>
                <Text color="#fff">
                    Green
                </Text>
                <Box>
                <TableContainer
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
      color="white"
      borderRadius="md"
      w={'35rem'}
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      height={'100%'}
    //   paddingX={'2rem'}
      pt={'1.7rem'}
      overflowX="hidden"
    >
      <Table variant="unstyled" width="100%" height="100%">
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
                  color={'white'}
                  fontWeight="600"
                  padding={0}
                  pl="2rem"
                >
                    {val}
                </Text>
              </Td>
            ))}
          </Tr>
        </Thead>

        <Tbody position="relative" overflowX="hidden">
          {DataGreen.map((coin: any, idx: any) => (
            <>
                          <Tr
                style={{
                  position: 'absolute',
                  height: '1px',
                  borderWidth: '0',
                  backgroundColor: '#2b2f35',
                  width: '100%',
                }}
              />
              <Tr
                key={idx}
                width={'100%'}
                height={'5rem'}
                position="relative"
                color={'white'}
                // bg={
                //   coin?.name === 'STRK'
                //     ? 'linear-gradient(90deg, #34345600 0%, #34345688 50%, #34345600 100%, #34345600 100%)'
                //     : ''
                // }
              >
                <Td
                  width={'17%'}
                  fontSize={'12px'}
                  fontWeight={400}
                  padding={0}
                  pl="2.5rem"
                >
                  <HStack
                    gap="10px"
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
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
                            Green
                        </Text>
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
                  textAlign={'right'}
                  pl="6rem"
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    // justifyContent="center"
                    fontWeight="400"
                    
                  >
                    {coin.value}
                  </Box>
                </Td>

                <Td
                  width={'18%'}
                  maxWidth={'3rem'}
                  fontSize={'14px'}
                  fontWeight={400}
                  overflow={'hidden'}
                  textAlign={'center'}
                  pl="3rem"
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    
                  >
                    <Box bg={coin.sample} height="16px" width="16px" borderRadius="4px" mr="0.4rem">
                    </Box>
                    <Text>
                        {coin.sample}
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
      </Table>
    </TableContainer>
                </Box>
            </Box>
        </Box>
        <Box display='flex' gap="4rem" mt="2rem">
            <Box display='flex' flexDirection="column" gap='0.5rem'>
                <Text color="#fff">
                    Yellow
                </Text>
                <Box>
                <TableContainer
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
      color="white"
      borderRadius="md"
      w={'35rem'}
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      height={'100%'}
    //   paddingX={'2rem'}
      pt={'1.7rem'}
      overflowX="hidden"
    >
      <Table variant="unstyled" width="100%" height="100%">
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
                  color={'white'}
                  fontWeight="600"
                  padding={0}
                  pl="2rem"
                >
                    {val}
                </Text>
              </Td>
            ))}
          </Tr>
        </Thead>

        <Tbody position="relative" overflowX="hidden">
          {DataYellow.map((coin: any, idx: any) => (
            <>
                          <Tr
                style={{
                  position: 'absolute',
                  height: '1px',
                  borderWidth: '0',
                  backgroundColor: '#2b2f35',
                  width: '100%',
                }}
              />
              <Tr
                key={idx}
                width={'100%'}
                height={'5rem'}
                position="relative"
                color={'white'}
                // bg={
                //   coin?.name === 'STRK'
                //     ? 'linear-gradient(90deg, #34345600 0%, #34345688 50%, #34345600 100%, #34345600 100%)'
                //     : ''
                // }
              >
                <Td
                  width={'17%'}
                  fontSize={'12px'}
                  fontWeight={400}
                  padding={0}
                  pl="2.5rem"
                >
                  <HStack
                    gap="10px"
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
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
                            Yellow
                        </Text>
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
                  textAlign={'right'}
                  pl="6rem"
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    // justifyContent="center"
                    fontWeight="400"
                    
                  >
                    {coin.value}
                  </Box>
                </Td>

                <Td
                  width={'18%'}
                  maxWidth={'3rem'}
                  fontSize={'14px'}
                  fontWeight={400}
                  overflow={'hidden'}
                  textAlign={'center'}
                  pl="3rem"
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    
                  >
                    <Box bg={coin.sample} height="16px" width="16px" borderRadius="4px" mr="0.4rem">
                    </Box>
                    <Text>
                        {coin.sample}
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
      </Table>
    </TableContainer>
                </Box>
            </Box>
            <Box display='flex' flexDirection="column" gap='0.5rem'>
                <Text color="#fff">
                    Orange
                </Text>
                <Box>
                <TableContainer
      border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
      color="white"
      borderRadius="md"
      w={'35rem'}
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      height={'100%'}
    //   paddingX={'2rem'}
      pt={'1.7rem'}
      overflowX="hidden"
    >
      <Table variant="unstyled" width="100%" height="100%">
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
                  color={'white'}
                  fontWeight="600"
                  padding={0}
                  pl="2rem"
                >
                    {val}
                </Text>
              </Td>
            ))}
          </Tr>
        </Thead>

        <Tbody position="relative" overflowX="hidden">
          {DataOrange.map((coin: any, idx: any) => (
            <>
                          <Tr
                style={{
                  position: 'absolute',
                  height: '1px',
                  borderWidth: '0',
                  backgroundColor: '#2b2f35',
                  width: '100%',
                }}
              />
              <Tr
                key={idx}
                width={'100%'}
                height={'5rem'}
                position="relative"
                color={'white'}
                // bg={
                //   coin?.name === 'STRK'
                //     ? 'linear-gradient(90deg, #34345600 0%, #34345688 50%, #34345600 100%, #34345600 100%)'
                //     : ''
                // }
              >
                <Td
                  width={'17%'}
                  fontSize={'12px'}
                  fontWeight={400}
                  padding={0}
                  pl="2.5rem"
                >
                  <HStack
                    gap="10px"
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
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
                            Orange
                        </Text>
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
                  textAlign={'right'}
                  pl="6rem"
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    // justifyContent="center"
                    fontWeight="400"
                    
                  >
                    {coin.value}
                  </Box>
                </Td>

                <Td
                  width={'18%'}
                  maxWidth={'3rem'}
                  fontSize={'14px'}
                  fontWeight={400}
                  overflow={'hidden'}
                  textAlign={'center'}
                  pl="3rem"
                >
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    
                  >
                    <Box bg={coin.sample} height="16px" width="16px" borderRadius="4px" mr="0.4rem">
                    </Box>
                    <Text>
                        {coin.sample}
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
      </Table>
    </TableContainer>
                </Box>
            </Box>
        </Box>
      </Box>
    </Box>
  )
}
