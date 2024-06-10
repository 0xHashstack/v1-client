import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { memo, useEffect, useRef, useState } from 'react'

import StakeUnstakeModal from '@/components/modals/StakeUnstakeModal'
import TransferDepositModal from '@/components/modals/TransferDepositModal'
import GetTokensModal from '@/components/modals/getTokens'
import {
  selectCurrentDropdown,
  selectNavDropdowns,
  setNavDropdown,
} from '@/store/slices/dropdownsSlice'
import {
  resetState,
  selectCurrentNetwork,
  selectInteractedAddress,
  selectNftBalance,
  selectUserType,
  selectWhiteListed,
  selectYourBorrow,
  selectYourSupply,
  setInteractedAddress,
} from '@/store/slices/readDataSlice'
import {
  selectAccountAddress,
  selectLanguage,
  setAccountReset,
  setLanguage,
} from '@/store/slices/userAccountSlice'
import { languages } from '@/utils/constants/languages'
import { Box, HStack, Skeleton, Text, useOutsideClick } from '@chakra-ui/react'
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'
import mixpanel from 'mixpanel-browser'
import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import { useDispatch, useSelector } from 'react-redux'
import { AccountInterface, ProviderInterface, number } from 'starknet'
import arrowNavLeft from '../../../assets/images/arrowNavLeft.svg'
import arrowNavRight from '../../../assets/images/arrowNavRight.svg'
import darkModeOff from '../../../assets/images/darkModeOff.svg'
import darkModeOn from '../../../assets/images/darkModeOn.svg'
import hoverContributeEarnIcon from '../../../assets/images/hoverContributeEarnIcon.svg'
import hoverDashboardIcon from '../../../assets/images/hoverDashboardIcon.svg'
import hoverStake from '../../../assets/images/hoverStakeIcon.svg'
import tickMark from '../../../assets/images/tickMark.svg'
import { Coins } from '../dashboardLeft'

interface ExtendedAccountInterface extends AccountInterface {
  provider?: {
    chainId: string
  }
}

const Navbar = ({ validRTokens }: any) => {
  const dispatch = useDispatch()
  const navDropdowns = useSelector(selectNavDropdowns)
  const language = useSelector(selectLanguage)
  const currentDropdown = useSelector(selectCurrentDropdown)
  const { account } = useAccount()
  const currentChainId = useSelector(selectCurrentNetwork)
  const [dashboardHover, setDashboardHover] = useState(false)
  const [campaignHover, setCampaignHover] = useState(false)
  const [contibutionHover, setContibutionHover] = useState(false)
  const [transferDepositHover, setTransferDepositHover] = useState(false)
  const [stakeHover, setStakeHover] = useState(false)
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const handleDropdownClick = (dropdownName: string) => {
    dispatch(setNavDropdown(dropdownName))
  }
  const [domainName, setDomainName] = useState('')
  const [justifyContent, setJustifyContent] = useState('flex-start')
  const [toggleDarkMode, setToggleDarkMode] = useState(true)
  const toggleMode = () => {
    setJustifyContent(
      justifyContent === 'flex-start' ? 'flex-end' : 'flex-start'
    )
  }
  const totalBorrow = useSelector(selectYourBorrow)
  const totalSupply = useSelector(selectYourSupply)

  const { connector } = useAccount()

  const router = useRouter()
  const { pathname } = router

  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const nftBalance: any = useSelector(selectNftBalance)

  useOutsideClick({
    ref: ref1,
    handler: (e) => {
      if (
        ref1.current &&
        ref2.current &&
        !ref1.current.contains(e.target as Node) &&
        !ref2.current.contains(e.target as Node) &&
        currentDropdown != ''
      ) {
        dispatch(setNavDropdown(''))
      }
    },
  })

  useOutsideClick({
    ref: ref2,
    handler: (e) => {
      if (
        ref1.current &&
        ref2.current &&
        !ref1.current.contains(e.target as Node) &&
        !ref2.current.contains(e.target as Node) &&
        currentDropdown != ''
      ) {
        dispatch(setNavDropdown(''))
      }
    },
  })

  const switchWallet = () => {
    if (connectors[0]?.id == 'braavos') {
      dispatch(resetState(null))
      dispatch(setAccountReset(null))
      localStorage.setItem('lastUsedConnector', 'argentX')
      localStorage.setItem('connected', 'argentX')
      connectors.map((connector: any) => {
        if (connector.id == 'argentX') {
          connect({ connector })
        }
      })
      router.push('/v1/market')
    } else {
      dispatch(resetState(null))
      dispatch(setAccountReset(null))
      localStorage.setItem('lastUsedConnector', 'braavos')
      localStorage.setItem('connected', 'braavos')
      connectors.map((connector: any) => {
        if (connector.id == 'braavos') {
          connect({ connector })
        }
      })
      router.push('/v1/market')
    }
  }

  useEffect(() => {
    async function fetchDomainName() {
      if (account?.address) {
        try {
          const res: any = await axios.get(
            `https://api.starknet.id/addr_to_domain?addr=${account?.address}`
          )
          setDomainName(res?.data?.domain)
        } catch (error) {
          console.log('address to domain error', error)
        }
      }
    }
    fetchDomainName()
  }, [account?.address, domainName])

  const extendedAccount = account as ExtendedAccountInterface
  const [isCorrectNetwork, setisCorrectNetwork] = useState(true)
  const { address, status, isConnected } = useAccount()

  const [whitelisted, setWhitelisted] = useState(true)
  const [uniqueToken, setUniqueToken] = useState('')
  const [referralLinked, setRefferalLinked] = useState(false)
  const userType = useSelector(selectUserType)
  const [Render, setRender] = useState(true)
  const userWhitelisted = useSelector(selectWhiteListed)

  useEffect(() => {
    function isCorrectNetwork() {
      const walletConnected = localStorage.getItem('lastUsedConnector')
      const network = process.env.NEXT_PUBLIC_NODE_ENV

      if (walletConnected == 'braavos') {
        if (network == 'testnet') {
          return (
            extendedAccount.provider?.chainId ==
            process.env.NEXT_PUBLIC_TESTNET_CHAINID
          )
        } else {
          return (
            extendedAccount.provider?.chainId ==
            process.env.NEXT_PUBLIC_MAINNET_CHAINID
          )
        }
      } else if (walletConnected == 'argentX') {
        // Your code here
        if (network == 'testnet') {
          return (
            extendedAccount.provider?.chainId ===
            process.env.NEXT_PUBLIC_TESTNET_CHAINID
          )
        } else {
          return (
            extendedAccount.provider?.chainId ===
            process.env.NEXT_PUBLIC_MAINNET_CHAINID
          )
        }
      }
    }

    const isWhiteListed = async () => {
      try {
        if (!address) {
          return
        }
        const url = `https://hstk.fi/is-whitelisted/${address}`
        const response = await axios.get(url)
        setWhitelisted(response.data?.isWhitelisted)
      } catch (err) {}
    }
    isWhiteListed()

    if (account && !isCorrectNetwork()) {
      setRender(false)
    } else {
      setRender(true)
    }
  }, [account, whitelisted, userWhitelisted, referralLinked])
  const [allowedReferral, setAllowedReferral] = useState(false)
  const interactedAddress = useSelector(selectInteractedAddress)

  return (
    <HStack
      zIndex="100"
      pt={'4px'}
      background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
      width="100vw"
      boxShadow="rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      color="#FFF"
      height="3.8125rem"
      className="navbar"
    >
      <HStack
        display="flex"
        justifyContent={'flex-start'}
        alignItems="center"
        width="60%"
        gap={'4px'}
        marginLeft="2rem"
      >
        <Link
          href={
            router.pathname != '/v1/waitlist' ? '/v1/market' : '/v1/waitlist'
          }
        >
          <Box
            height="100%"
            display="flex"
            alignItems="center"
            minWidth={'140px'}
            marginRight="1.4em"
          >
            <Image
              src="/hashstackLogo.svg"
              alt="Navbar Logo"
              height="32"
              width="140"
            />
          </Box>
        </Link>

        <Box
          padding="16px 12px"
          fontSize="14px"
          borderRadius="5px"
          cursor="pointer"
          marginBottom="0px"
          className="button"
          color={
            pathname !== '/v1/campaigns' && pathname !== '/v1/referral'
              ? '#00D395'
              : '#676D9A'
          }
          onClick={() => {
            if (router.pathname != '/waitlist') {
              router.push('/v1/market')
            }
          }}
          onMouseEnter={() => setDashboardHover(true)}
          onMouseLeave={() => setDashboardHover(false)}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={'8px'}
          >
            {router.pathname == '/v1/campaigns' ||
            router.pathname == '/v1/referral' ? (
              <Image
                src={hoverDashboardIcon}
                alt="Picture of the author"
                width="16"
                height="16"
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <Image
                src={'/dashboardIcon.svg'}
                alt="Picture of the author"
                width="16"
                height="16"
                style={{ cursor: 'pointer' }}
              />
            )}

            <Text fontSize="14px">Dashboard</Text>
          </Box>
        </Box>

        {
          <Box
            padding="16px 12px"
            fontSize="12px"
            borderRadius="5px"
            cursor={Render ? 'pointer' : 'not-allowed'}
            marginBottom="0px"
            _hover={{
              color: `${router.pathname != '/waitlist' ? '#6e7681' : ''}`,
            }}
            onMouseEnter={() => setStakeHover(true)}
            onMouseLeave={() => setStakeHover(false)}
            onClick={() => {
              posthog.capture('Stake Button Clicked Navbar', {
                Clicked: true,
              })
            }}
          >
            <StakeUnstakeModal
              coin={Coins}
              isCorrectNetwork={Render}
              nav={true}
              stakeHover={stakeHover}
              setStakeHover={setStakeHover}
              validRTokens={validRTokens}
            />
          </Box>
        }

        {process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' ? (
          <Box
            padding="16px 12px"
            fontSize="12px"
            borderRadius="5px"
            cursor="pointer"
            marginBottom="0px"
            color={`${pathname == '/v1/campaigns' ? '#00D395' : '#676D9A'}`}
            onMouseEnter={() => setCampaignHover(true)}
            onMouseLeave={() => setCampaignHover(false)}
            onClick={() => {
              posthog.capture('More Tab Clicked', {
                Clicked: true,
              })
              router.push('/v1/campaigns')
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap={'8px'}
            >
              {pathname == '/v1/campaigns' ? (
                <Image
                  src={hoverContributeEarnIcon}
                  alt="Picture of the author"
                  width="16"
                  height="16"
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <Image
                  src={'/contributeEarnIcon.svg'}
                  alt="Picture of the author"
                  width="16"
                  height="16"
                  style={{ cursor: 'pointer' }}
                />
              )}

              <Text fontSize="14px">More</Text>
            </Box>
          </Box>
        ) : (
          ''
        )}
      </HStack>
      <HStack
        width="50%"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <HStack
          display="flex"
          gap="8px"
          justifyContent="center"
          alignItems="center"
          marginRight="1.2rem"
        >
          {process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' ? (
            ''
          ) : (
            <GetTokensModal
              buttonText="Get Tokens"
              height={'2rem'}
              fontSize={'14px'}
              lineHeight="14px"
              padding="6px 12px"
              border="1px solid #676D9A"
              bgColor="transparent"
              _hover={{ bg: 'white', color: 'black' }}
              borderRadius={'6px'}
              color="#E6EDF3"
              backGroundOverLay="rgba(244, 242, 255, 0.5)"
            />
          )}
          <Box
            fontSize="12px"
            color="#FFF"
            height="2rem"
            cursor="pointer"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="1px"
            flexGrow="1"
            className="button navbar"
            ref={ref2}
          >
            <Box
              display="flex"
              border="1px solid #676D9A"
              borderRadius="6px"
              flexDirection="row"
              paddingY="6px"
              pr="2.2rem"
              pl="1rem"
              justifyContent="flex-start"
              alignItems="center"
              width="100%"
              height="100%"
              className="navbar-button"
              onClick={() => {
                dispatch(setNavDropdown('walletConnectionDropdown'))
              }}
            >
              {account ? (
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  gap={2.5}
                >
                  <Image
                    alt=""
                    src={'/starknetLogoBordered.svg'}
                    width="16"
                    height="16"
                    style={{ cursor: 'pointer' }}
                  />
                  <Text
                    fontSize="14px"
                    fontWeight="500"
                    color="#FFFFFF"
                    lineHeight="20px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {domainName
                      ? domainName
                      : `${account.address.substring(
                          0,
                          3
                        )}...${account.address.substring(
                          account.address.length - 9,
                          account.address.length
                        )}`}
                  </Text>
                </Box>
              ) : (
                <Skeleton width="7rem" height="100%" borderRadius="2px" />
              )}
              <Box position="absolute" right="0.7rem">
                {!navDropdowns.walletConnectionDropdown ? (
                  <Image
                    src={'/connectWalletArrowDown.svg'}
                    alt="arrow"
                    width="16"
                    height="16"
                    style={{
                      cursor: 'pointer',
                    }}
                  />
                ) : (
                  <Image
                    src={'/connectWalletArrowDown.svg'}
                    alt="arrow"
                    width="16"
                    height="16"
                    style={{
                      cursor: 'pointer',
                    }}
                  />
                )}
              </Box>
            </Box>
            {navDropdowns.walletConnectionDropdown && (
              <Box
                width="100%"
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="flex-end"
                gap="7px"
                padding="0.5rem 0"
                boxShadow="1px 2px 8px rgba(0, 0, 0, 0.5), 4px 8px 24px #010409"
                borderRadius="6px"
                background="var(--Base_surface, #02010F)"
                border="1px solid rgba(103, 109, 154, 0.30)"
                className="dropdown-container"
              >
                {account ? (
                  <>
                    <Box
                      padding="4px 11px"
                      marginRight="8px"
                      borderRadius="6px"
                      background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                      border="1px solid #2B2F35"
                      onClick={() => {
                        dispatch(resetState(null))
                        dispatch(setAccountReset(null))
                        localStorage.setItem('lastUsedConnector', '')
                        localStorage.setItem('connected', '')
                        dispatch(setNavDropdown(''))
                        router.push('./')
                        disconnect()
                      }}
                    >
                      Disconnect
                    </Box>
                    <Box
                      padding="4px 11px"
                      marginRight="8px"
                      borderRadius="6px"
                      border="1px solid #2B2F35"
                      background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                      onClick={() => {
                        dispatch(setNavDropdown(''))
                        switchWallet()
                      }}
                    >
                      Switch Wallet
                    </Box>
                  </>
                ) : (
                  <Box
                    padding="4px 11px"
                    marginRight="8px"
                    borderRadius="6px"
                    border="1px solid #2B2F35"
                    background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                    onClick={() => {
                      if (connectors[0]?.id == 'braavos') {
                        disconnect()
                        connectors.map((connector: any) => {
                          if (connector.id == 'braavos') {
                            connect(connector)
                          }
                        })
                      } else {
                        disconnect()
                        connectors.map((connector: any) => {
                          if (connector.id == 'argentX') {
                            connect({ connector })
                          }
                        })
                      }
                    }}
                  >
                    Connect
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Box
            borderRadius="6px"
            width="fit-content"
            padding="1px"
            cursor="pointer"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="8px"
            flexGrow="1"
            className="button navbar"
            ref={ref1}
            ml="0.4rem"
          >
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              className="navbar-button"
              mr="0.5rem"
              onClick={() => {
                dispatch(setNavDropdown('settingsDropdown'))
              }}
            >
              <Image
                src="/settingIcon.svg"
                alt="Picture of the author"
                width="18"
                height="18"
                style={{
                  cursor: 'pointer',
                }}
              />
            </Box>
            {navDropdowns.settingsDropdown && (
              <Box
                style={{}}
                width="10rem"
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="flex-start"
                gap="5px"
                padding="0.5rem 0"
                boxShadow="1px 2px 8px rgba(0, 0, 0, 0.5), 4px 8px 24px #010409"
                borderRadius="6px"
                background="var(--Base_surface, #02010F)"
                border="1px solid rgba(103, 109, 154, 0.30)"
                right="0px"
                top="150%"
                className="dropdown-container"
              >
                <Text color="#6e7681" fontSize="12px" paddingX="8px">
                  General settings
                </Text>
                <HStack
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width={'100%'}
                  paddingX="8px"
                ></HStack>
                <hr
                  style={{
                    height: '1px',
                    borderWidth: '0',
                    backgroundColor: '#2B2F35',
                    width: '96%',
                    marginRight: '5.1px',
                  }}
                />
                <HStack
                  display="flex"
                  justifyContent="space-around"
                  alignItems="center"
                  padding="2px 6px"
                  gap="1.5rem"
                >
                  <Text
                    fontStyle="normal"
                    fontWeight="400"
                    fontSize="14px"
                    lineHeight="20px"
                  >
                    Language
                  </Text>
                  <Text
                    fontSize={'12px'}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    onClick={() => {
                      dispatch(setNavDropdown('languagesDropdown'))
                    }}
                  >
                    {language}
                    <Image
                      src={arrowNavRight}
                      alt="Picture of the author"
                      width="16"
                      height="16"
                      style={{ cursor: 'pointer' }}
                    />
                  </Text>
                </HStack>
              </Box>
            )}
            {navDropdowns.languagesDropdown && (
              <Box
                width="16rem"
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="flex-start"
                gap="15px"
                boxShadow="1px 2px 8px rgba(0, 0, 0, 0.5), 4px 8px 24px #010409"
                borderRadius="6px"
                right="0px"
                top="150%"
                background="var(--Base_surface, #02010F)"
                border="1px solid rgba(103, 109, 154, 0.30)"
                padding="0.7rem 0.6rem"
                pb="1.5rem"
                className="dropdown-container"
              >
                <Text
                  fontSize={'12px'}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  onClick={() => {
                    dispatch(setNavDropdown('settingsDropdown'))
                  }}
                  gap="8px"
                  padding="0.5rem 0.7rem"
                  color="#B1B0B5"
                >
                  <Image
                    src={arrowNavLeft}
                    alt="Picture of the author"
                    width="7"
                    height="7"
                    style={{ cursor: 'pointer' }}
                  />
                  Select Language
                </Text>
                {languages.map((val, idx) => (
                  <>
                    <HStack
                      color="#6e7681"
                      fontSize="12px"
                      paddingX="8px"
                      key={idx}
                      justifyContent="space-between"
                      width="100%"
                      onClick={() => {
                        if (!val.name.includes('Coming soon'))
                          dispatch(setLanguage(`${val.name}`))
                      }}
                    >
                      <Box
                        display={'flex'}
                        justifyContent={'flex-start'}
                        gap={4}
                        alignItems={'center'}
                      >
                        <Image
                          src={val.icon}
                          alt="Picture of the author"
                          width="20"
                          height="20"
                          style={{ cursor: 'pointer' }}
                        />
                        <Text>{val.name}</Text>
                      </Box>
                      {language === val.name && (
                        <Image
                          src={tickMark}
                          alt="Picture of the author"
                          width="15"
                          height="15"
                          style={{ cursor: 'pointer' }}
                        />
                      )}
                    </HStack>
                    <hr
                      style={{
                        height: '1px',
                        borderWidth: '0',
                        backgroundColor: '#2B2F35',
                        width: '95%',
                        marginLeft: '6px',
                        color: '#2A2E3F',
                        display: `${
                          idx == languages.length - 1 ? 'none' : 'block'
                        }`,
                      }}
                    />
                  </>
                ))}
              </Box>
            )}
          </Box>
        </HStack>
      </HStack>
    </HStack>
  )
}

export default memo(Navbar)
