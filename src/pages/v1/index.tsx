import { Box, Button, Card, Skeleton, Text } from '@chakra-ui/react'
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import BTCLogo from '@/assets/icons/coins/btc'
import DAILogo from '@/assets/icons/coins/dai'
import ETHLogo from '@/assets/icons/coins/eth'
import EthWalletLogo from '@/assets/icons/coins/ethwallet'
import StarknetLogo from '@/assets/icons/coins/starknet'
import USDCLogo from '@/assets/icons/coins/usdc'
import USDTLogo from '@/assets/icons/coins/usdt'
import BravosIcon from '@/assets/icons/wallets/bravos'
import {
  cookieToInitialState,
  useAccount as useAccountWagmi,
  useConnect as useConnectWagmi,
  useDisconnect as useDisconnectWagmi,
} from 'wagmi'
import {
  setprotocolNetworkSelected,
  setReferral,
  setTransactionRefresh,
} from '@/store/slices/readDataSlice'
import { selectWalletBalance } from '@/store/slices/userAccountSlice'
import {
  selectNavDropdowns,
  setNavDropdown,
} from '@/store/slices/dropdownsSlice'
import ArrowUp from '@/assets/icons/arrowup'
import DropdownUp from '@/assets/icons/dropdownUpIcon'
import MetamaskIcon from '@/assets/icons/metamaskIcon'
import CoinbaseIcon from '@/assets/icons/coinbaseIcon'
import { GetServerSideProps } from 'next'
import { config } from '@/services/wagmi/config'
export default function Home() {
  const { account, address, status, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const [isWaitListed, setIsWaitListed] = useState(true)
  const [availableDataLoading, setAvailableDataLoading] = useState(true)
  const [network, setnetwork] = useState<string>('Base')
  const {
    connect: connectWagmi,
    connectors: wagmiConnectors,
    error,
  } = useConnectWagmi()
  const { address: addressbase } = useAccountWagmi()
  console.log(addressbase,"base")
  const router = useRouter()
  const waitlistHref = '/v1/waitlist'
  const marketHref2 = '/v1/market'
  const whitelistHref = '/v1/whitelist'
  const dispatch = useDispatch()
  const walletBalance = useSelector(selectWalletBalance)
  const navDropdowns = useSelector(selectNavDropdowns)
  const { disconnect: disconnectWagmi } = useDisconnectWagmi()
  const coins = ['BTC', 'USDT', 'USDC', 'ETH', 'DAI']
  const networks = [
    { name: 'Base', status: 'enable' },
    { name: 'Starknet', status: 'enable' },
  ]

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAvailableDataLoading(false)
    }, 600)

    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    localStorage.setItem('connected', '')
  }, [])

  const { ref } = router.query
  if (ref) {
    dispatch(setReferral(ref))
  }

  useEffect(() => {
    const hasVisited = localStorage.getItem('visited')
    const walletConnected = localStorage.getItem('lastUsedConnector')

    localStorage.setItem('transactionCheck', JSON.stringify([]))
    if (walletConnected == 'braavos') {
      disconnect()
      connectors.map((connector: any) => {
        if (connector.id == 'braavos') {
          connect(connector)
        }
      })

      if (!account) {
        return
      } else {
        if (!isWaitListed) {
          router.replace(waitlistHref)
        } else {
          router.replace(marketHref2)
        }
      }
    } else if (walletConnected == 'argentX') {
      disconnect()
      connectors.map((connector) => {
        if (connector.id == 'argentX') {
          connect({ connector })
        }
      })
      if (!account) {
        return
      } else {
        if (!isWaitListed) {
          router.replace(waitlistHref)
        } else {
          router.replace(marketHref2)
        }
      }
    } else if (walletConnected == 'MetaMask') {
      disconnectWagmi()
      dispatch(setprotocolNetworkSelected('Base'))
      wagmiConnectors.map((connector) => {
        if (connector.id == 'io.metamask') {
          connectWagmi({ connector })
        }
      })
      if (!addressbase) {
        return
      } else {
        if (!isWaitListed) {
          router.replace(waitlistHref)
        } else {
          router.replace(marketHref2)
        }
      }
    } else {
      return
    }
    if (walletConnected) {
      localStorage.setItem('connected', walletConnected)
      posthog.capture('Connect Wallet', {
        'Wallet address': address,
        'Wallet Connected': walletConnected,
      })
    }
    if (!hasVisited) {
      // Set a local storage item to indicate the user has visited
      localStorage.setItem('visited', 'true')
    }
  }, [status, isConnected])

  const [bravoosAvailable, setbravoosAvailable] = useState(true)
  const [argentAvailable, setargentAvailable] = useState(true)

  useEffect(() => {
    connectors.map((connector) => {
      if (connector.id == 'braavos') {
        setbravoosAvailable(connector.available())
      } else if (connector.id == 'argentX') {
        setargentAvailable(connector.available())
      }
      return true
    })
  }, [])

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor="#191922"
      height="100vh"
    >
      <Box
        display="flex"
        background="#02010F"
        flexDirection="column"
        alignItems="flex-start"
        padding="32px"
        width="462px"
        border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
        borderRadius="8px"
      >
        <Text color="#fff">Connect a wallet</Text>
        <Card
          p="1rem"
          background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
          width="400px"
          mt="8px"
        >
          <Box
            display="flex"
            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
            justifyContent="space-between"
            py="2"
            mt="0.3rem"
            borderRadius="md"
            className="navbar"
            cursor="pointer"
            onClick={() => {
              dispatch(setNavDropdown('networkDropdown'))
            }}
          >
            <Box ml="1rem" color="white">
              {network}
            </Box>
            <Box pt="1" className="navbar-button" mr="1rem">
              {navDropdowns.networkDropdown ? <ArrowUp /> : <DropdownUp />}
            </Box>
            {navDropdowns.networkDropdown && (
              <Box
                w="full"
                left="0"
                bg="#03060B"
                border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                py="2"
                className="dropdown-container"
                boxShadow="dark-lg"
              >
                <>
                  {networks.map((networkOptions: any, index) => (
                    <Box
                      key={index}
                      padding="4px 11px"
                      marginRight="8px"
                      borderRadius="6px"
                      color="white"
                      onClick={() => {
                        setnetwork(networkOptions?.name)
                        dispatch(
                          setprotocolNetworkSelected(networkOptions?.name)
                        )
                      }}
                      bg={`${
                        network === networkOptions?.name ? '#4D59E8' : 'inherit'
                      }`}
                    >
                      {network === networkOptions?.name && (
                        <Box
                          w="3px"
                          // h="12px"
                          bg="#4D59E8"
                          borderRightRadius="md"
                        ></Box>
                      )}
                      {networkOptions.name}
                    </Box>
                  ))}
                </>
              </Box>
            )}
          </Box>
          {network === 'Starknet' ? (
            <Box>
              {(connectors[0]?.id == 'braavos' ||
                connectors[1]?.id == 'braavos') &&
              bravoosAvailable ? (
                <Box
                  w="full"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                  py="2"
                  mt="1rem"
                  borderRadius="6px"
                  gap="3px"
                  display="flex"
                  justifyContent="space-between"
                  cursor="pointer"
                  onClick={() => {
                    localStorage.setItem('lastUsedConnector', 'braavos')
                    localStorage.setItem('connected', 'braavos')
                    dispatch(setprotocolNetworkSelected('Starknet'))
                    disconnect()
                    connectors.map((connector) => {
                      if (connector.id == 'braavos') {
                        connect({ connector })
                      }
                    })

                    dispatch(setTransactionRefresh('reset'))
                  }}
                >
                  <Box ml="1rem" color="white">
                    {availableDataLoading ? (
                      <Skeleton
                        width="6rem"
                        height="1.4rem"
                        startColor="#101216"
                        endColor="#2B2F35"
                        borderRadius="6px"
                      />
                    ) : (connectors[0]?.id == 'braavos' ||
                        connectors[1]?.id == 'braavos') &&
                      bravoosAvailable ? (
                      'Braavos Wallet'
                    ) : (
                      'Download Braavos Wallet'
                    )}
                  </Box>
                  <Box p="1" mr="16px">
                    <BravosIcon />
                  </Box>
                </Box>
              ) : (
                <Link href="https://braavos.app" target="_blank">
                  <Box
                    w="full"
                    border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                    py="2"
                    mt="1rem"
                    borderRadius="6px"
                    gap="3px"
                    display="flex"
                    justifyContent="space-between"
                    cursor="pointer"
                  >
                    <Box ml="1rem" color="white">
                      {availableDataLoading ? (
                        <Skeleton
                          width="6rem"
                          height="1.4rem"
                          startColor="#101216"
                          endColor="#2B2F35"
                          borderRadius="6px"
                        />
                      ) : (connectors[0]?.id == 'braavos' ||
                          connectors[1]?.id == 'braavos') &&
                        bravoosAvailable ? (
                        'Braavos Wallet'
                      ) : (
                        'Download Braavos Wallet'
                      )}
                    </Box>
                    <Box p="1" mr="16px">
                      <BravosIcon />
                    </Box>
                  </Box>
                </Link>
              )}

              {(connectors[1]?.id == 'argentX' ||
                connectors[0]?.id == 'argentX') &&
              argentAvailable ? (
                <Box
                  w="full"
                  py="2"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                  borderRadius="6px"
                  gap="3px"
                  mt="1rem"
                  display="flex"
                  justifyContent="space-between"
                  cursor="pointer"
                  onClick={() => {
                    localStorage.setItem('lastUsedConnector', 'argentX')
                    localStorage.setItem('connected', 'argentX')
                    dispatch(setprotocolNetworkSelected('Starknet'))
                    disconnect()
                    connectors.map((connector) => {
                      if (connector.id == 'argentX') {
                        connect({ connector })
                      }
                    })
                    dispatch(setTransactionRefresh('reset'))
                  }}
                >
                  <Box ml="1rem" color="white">
                    {availableDataLoading ? (
                      <Skeleton
                        width="6rem"
                        height="1.4rem"
                        startColor="#101216"
                        endColor="#2B2F35"
                        borderRadius="6px"
                      />
                    ) : connectors[0]?.id == 'argentX' ||
                      (connectors[1]?.id == 'argentX' && argentAvailable) ? (
                      'Argent X Wallet'
                    ) : (
                      'Download Argent X Wallet'
                    )}
                  </Box>
                  <Box p="1" mr="16px">
                    <Image
                      src="/ArgentXlogo.svg"
                      alt="Picture of the author"
                      width="15"
                      height="15"
                      style={{ cursor: 'pointer' }}
                    />
                  </Box>
                </Box>
              ) : (
                <Link href="https://www.argent.xyz/argent-x" target="_black">
                  <Box
                    w="full"
                    py="2"
                    border="1px solid #2B2F35"
                    borderRadius="6px"
                    gap="3px"
                    mt="1rem"
                    display="flex"
                    justifyContent="space-between"
                    cursor="pointer"
                  >
                    <Box ml="1rem" color="white">
                      {availableDataLoading ? (
                        <Skeleton
                          width="6rem"
                          height="1.4rem"
                          startColor="#101216"
                          endColor="#2B2F35"
                          borderRadius="6px"
                        />
                      ) : (connectors[1]?.id == 'argentX' ||
                          connectors[0]?.id == 'argentX') &&
                        argentAvailable ? (
                        'Argent X Wallet'
                      ) : (
                        'Download Argent X Wallet'
                      )}
                    </Box>
                    <Box p="1" mr="16px">
                      <Image
                        src="/ArgentXlogo.svg"
                        alt="Picture of the author"
                        width="15"
                        height="15"
                        style={{ cursor: 'pointer' }}
                      />
                    </Box>
                  </Box>
                </Link>
              )}
            </Box>
          ) : (
            <Box>
              {availableDataLoading ? (
                // Always render this loading state until data is fully loaded
                <></>
              ) : (
                wagmiConnectors.map((connector: any) => (
                  <Box
                    w="full"
                    border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                    py="2"
                    mt="1rem"
                    borderRadius="6px"
                    gap="3px"
                    display="flex"
                    justifyContent="space-between"
                    cursor="pointer"
                    // mb="16px"
                    // onClick={() => router.push("/market")}
                    key={connector.id}
                    onClick={() => {
                      localStorage.setItem(
                        'lastUsedConnector',
                        connector.id == 'io.metamask'
                          ? 'MetaMask'
                          : 'coinbaseWallet'
                      )
                      localStorage.setItem(
                        'connected',
                        connector.id == 'io.metamask'
                          ? 'MetaMask'
                          : 'coinbaseWallet'
                      )
                      connectWagmi({ connector })
                      router.replace(marketHref2)
                    }}
                  >
                    <Box ml="1rem" color="white">
                      {availableDataLoading ? (
                        <Skeleton
                          width="6rem"
                          height="1.4rem"
                          startColor="#101216"
                          endColor="#2B2F35"
                          borderRadius="6px"
                        />
                      ) : connector.id == 'io.metamask' ? (
                        'MetaMask'
                      ) : connector.id == 'coinbaseWalletSDK' ? (
                        'Coinbase'
                      ) : (
                        'Wallet Connect'
                      )}
                    </Box>
                    <Box p="1" mr="16px">
                      {connector.id == 'io.metamask' ? (
                        <MetamaskIcon />
                      ) : (
                        <CoinbaseIcon />
                      )}
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          )}
        </Card>
        <Box
          display="flex"
          flexDirection="row"
          fontSize="12px"
          lineHeight="30px"
          fontWeight="400"
          mt="16px"
        ></Box>
        <Box
          alignItems="center"
          fontSize="14px"
          lineHeight="22px"
          fontWeight="400"
          mt="8px"
        >
          <Text fontSize="14px" lineHeight="22px" fontWeight="400" color="#fff">
            By connecting your wallet, you agree to Hashstack&apos;s
          </Text>
          <Button
            variant="link"
            fontSize="14px"
            display="inline"
            color="#4D59E8"
            cursor="pointer"
            lineHeight="22px"
          >
            terms of service & disclaimer
          </Button>
        </Box>

        <Box mt="16px" display="flex" flexDirection="column">
          <Text
            fontSize="12px"
            lineHeight="18px"
            fontWeight="400"
            color="#3E415C"
          >
            Wallets are provided by External Providers and by selecting you
            agree to Terms of those Providers. Your access to the wallet might
            be reliant on the External Provider being operational.
          </Text>
          <Text
            fontSize="12px"
            lineHeight="18px"
            fontWeight="400"
            color="#3E415C"
            mt="1rem"
          >
            We urge the users to use the dapp with caution. Hashstack will not
            cover any accidental loss of user funds.
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let initialState: any = cookieToInitialState(config, context.req.headers.cookie);

  if (initialState) {
    // Handle connections Map serialization
    if (initialState.connections instanceof Map) {
      initialState.connections = Array.from(initialState.connections.entries());
    }

    // Replace undefined values with null for JSON serialization
    initialState = JSON.parse(JSON.stringify(initialState, (key, value) =>
      value === undefined ? null : value
    ));
  }

  return {
    props: {
      initialState: initialState || {},
    },
  };
};
