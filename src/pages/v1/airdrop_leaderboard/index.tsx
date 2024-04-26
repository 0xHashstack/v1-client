import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { useAccount } from '@starknet-react/core'
import axios from 'axios'
import { NextPage } from 'next'
import { default as React, useEffect, useRef, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { processAddress } from '@/Blockchain/stark-constants'
import BlueInfoIcon from '@/assets/icons/blueinfoicon'
import CopyIcon from '@/assets/icons/copyIcon'
import DropdownUp from '@/assets/icons/dropdownUpIcon'
import { default as LeaderboardDashboard } from '@/components/layouts/leaderboardDashboard'
import { default as PageCard } from '@/components/layouts/pageCard'
import UserCampaignData from '@/components/layouts/userCampaignData'
import RegisterCCPModal from '@/components/modals/RegisterCCPModal'
import SubmissionCCPModal from '@/components/modals/SubmissionCCPModal'
import { default as useDataLoader } from '@/hooks/useDataLoader'
import {
  selectAirdropDropdowns,
  setAirdropDropdown,
} from '@/store/slices/dropdownsSlice'
import {
  selectExistingLink,
  selectYourBorrow,
  selectYourSupply,
} from '@/store/slices/readDataSlice'
import { default as numberFormatter } from '@/utils/functions/numberFormatter'
import ExternalLinkWhite from '@/assets/icons/externalLinkWhite'
import Link from 'next/link'

const columnItemsLeaderBoard = [
  'Rank',
  'Account',
  'Liquidity generated in ($)',
  'Points',
  'Hash Tokens',
]

const columnItemsLeaderBoardCCp = ['Rank', 'Account', 'Points', '']

const columnItemsPersonalStatsReferalCampaign = [
  'Campaign Name',
  'Duration',
  'Total Hash Earned',
  '',
]

const sampleDate: any = [
  {
    id: 0,
    start: '1 Mar',
    end: '1 April',
    rank: 28,
    account: 'Braavos',
    liq: 500,
    pts: 100,
    est: 232,
  },
  {
    id: 1,
    start: '1 Mar',
    end: '1 April',
    rank: 28,
    account: 'Braavos',
    liq: 500,
    pts: 100,
    est: 232,
  },
  {
    id: 2,
    start: '1 Mar',
    end: '1 April',
    rank: 28,
    account: 'Braavos',
    liq: 500,
    pts: 100,
    est: 232,
  },
  {
    id: 3,
    start: '1 Mar',
    end: '1 April',
    rank: 28,
    account: 'Braavos',
    liq: 500,
    pts: 100,
    est: 232,
  },
  {
    id: 4,
    start: '1 Mar',
    end: '1 April',
    rank: 28,
    account: 'Braavos',
    liq: 500,
    pts: 100,
    est: 232,
  },
  {
    id: 5,
    start: '1 Mar',
    end: '1 April',
    rank: 28,
    account: 'Braavos',
    liq: 500,
    pts: 100,
    est: 232,
  },
  {
    id: 6,
    start: '1 Mar',
    end: '1 April',
    rank: 28,
    account: 'Braavos',
    liq: 500,
    pts: 100,
    est: 232,
  },
  {
    id: 7,
    start: '1 Mar',
    end: '1 April',
    rank: 28,
    account: 'Braavos',
    liq: 500,
    pts: 100,
    est: 232,
  },
  {
    id: 8,
    start: '1 Mar',
    end: '1 April',
    rank: 28,
    account: 'Braavos',
    liq: 500,
    pts: 100,
    est: 232,
  },
  {
    id: 10,
    start: '1 Mar',
    end: '1 April',
    rank: 28,
    account: 'Braavos',
    liq: 500,
    pts: 100,
    est: 232,
  },
  {
    id: 20,
    start: '1 Mar',
    end: '1 April',
    rank: 28,
    account: 'Braavos',
    liq: 500,
    pts: 100,
    est: 232,
  },
  {
    id: 30,
    start: '1 Mar',
    end: '1 April',
    rank: 28,
    account: 'Braavos',
    liq: 500,
    pts: 100,
    est: 232,
  },
  {
    id: 40,
    start: '1 Mar',
    end: '1 April',
    rank: 28,
    account: 'Braavos',
    liq: 500,
    pts: 100,
    est: 232,
  },
  {
    id: 50,
    start: '1 Mar',
    end: '1 April',
    rank: 28,
    account: 'Braavos',
    liq: 500,
    pts: 100,
    est: 232,
  },
  {
    id: 60,
    start: '1 Mar',
    end: '1 April',
    rank: 28,
    account: 'Braavos',
    liq: 500,
    pts: 100,
    est: 232,
  },
]

const Campaign: NextPage = () => {
  const [currentPagination, setCurrentPagination] = useState<number>(1)
  const [daysLeft, setDaysLeft] = useState<number>(56)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [communityHash, setCommunityHash] = useState()
  const [communityPoints, setCommunityPoints] = useState()
  const [personalData, setPersonalData] = useState([])
  const [epoch, setEpoch] = useState(1)
  const [snapshotNumber, setSnapshotNumber] = useState(0)
  const [tabValue, setTabValue] = useState(1)
  const [refferal, setRefferal] = useState('xyz')
  const [currentSelectedDrop, setCurrentSelectedDrop] = useState('CCP 1')
  const [epochsData, setepochsData] = useState([])
  const [snapshotData, setsnapshotData] = useState([])
  const [userPointsAllocated, setuserPointsAllocated] = useState<any>()
  const [userHashAllocated, setuserHashAllocated] = useState<any>()
  const [userccpData, setUserccpData] = useState([])
  const [ccpLeaderBoardData, setccpLeaderBoardData] = useState([])
  const [userRank, setuserRank] = useState<any>()
  const [userPointsCCP, setuserPointsCCP] = useState<any>(0)
  const [userHashCCP, setuserHashCCP] = useState<any>(0)
  const [totalPointsCCP, settotalPointsCCP] = useState<any>(0)
  const [userRankCCP, setuserRankCCP] = useState<any>(0)
  const [campaignDetails, setCampaignDetails] = useState([
    {
      campaignName: 'Airdrop 01',
      timeline: '27 Nov 2023 - 22 Jan 2024',
    },
    {
      campaignName: 'CCP',
      timeline: '18 Apr 2024',
    },
  ])

  const totalBorrow = useSelector(selectYourBorrow)
  const totalSupply = useSelector(selectYourSupply)
  const exisitingLink = useSelector(selectExistingLink)
  const airdropDropdowns = useSelector(selectAirdropDropdowns)

  const dispatch = useDispatch()
  const { address } = useAccount()

  useDataLoader()

  const ddRef = useRef<HTMLDivElement>(null)

  const startDate = new Date('2023-11-27')
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 55)

  useEffect(() => {
    const fetchDetails = async () => {
      if (address) {
        const res = await axios.get(
          `https://hstk.fi/api/temp-allocation/${address}`
        )
        setCommunityHash(res?.data?.communityInfo?.estimatedHashTokensCommunity)
        setCommunityPoints(res?.data?.communityInfo?.totalInteractionPoints)
      }
    }
    fetchDetails()
  }, [])

  useEffect(() => {
    if (sampleDate) {
      if (sampleDate.length <= (currentPagination - 1) * 6) {
        if (currentPagination > 1) {
          setCurrentPagination(currentPagination - 1)
        }
      }
    }
  }, [])

  useEffect(() => {
    try {
      const fetchData = async () => {
        if (address) {
          const res = await axios.get(
            `https://hstk.fi/api/get-epoch-wise-data/${address}`
          )
          const data = res?.data
          let dataepoch=data?.finalSnapData.sort(
            (a: { epoch: number }, b: { epoch: number }) => a.epoch - b.epoch
          )
          setepochsData(dataepoch)
          if (data?.rank) {
            setuserRank(data?.rank)
          } else {
            setuserRank('-')
          }
          let snaps = data?.epochWise
          snaps.sort(
            (a: { epoch: number }, b: { epoch: number }) => a.epoch - b.epoch
          )
          setsnapshotData(data?.epochWise)
        }
      }
      fetchData()
    } catch (err) {
      console.log(err)
    }
  }, [address])

  useEffect(() => {
    try {
      const fetchUserCCPData = async () => {
        const res = await axios.get(
          `https://hstk.fi/api/ccp/submission/${address}`
        )
        setUserccpData(res?.data)
        let points = 0
        let hash = 0
        if (res?.data) {
          res?.data.map((data: any) => {
            points += Number(data['Recommended (Community Team)'])
              ? Number(data['Recommended (Community Team)'])
              : 0
            hash += Number(data['Allocated (Product Team)'])
              ? Number(data['Allocated (Product Team)'])
              : 0
          })
        }
        setuserPointsCCP(points)
        setuserHashCCP(hash)
      }
      if (address) {
        fetchUserCCPData()
      }
    } catch (err) {
      console.log(err)
    }
  }, [address])

  useEffect(() => {
    try {
      const fetchLeaderBoardDataCCP = async () => {
        const res = await axios.get('https://hstk.fi/api/ccp/submissions')
        let totalPoints = 0
        if (res?.data) {
          res?.data.map((data: any) => {
            if (address) {
              if (
                address === processAddress(data['Wallet Address (StarkNet)'])
              ) {
                setuserRankCCP(data?.Rank)
              }
            }
            totalPoints += Number(data['Recommended (Community Team)'])
          })
        }
        settotalPointsCCP(totalPoints)
        setccpLeaderBoardData(res?.data)
      }
      fetchLeaderBoardDataCCP()
    } catch (err) {
      console.log(err)
    }
  }, [address])

  useEffect(() => {
    const fetchDetails = async () => {
      if (address) {
        const res = await axios.get(
          `https://hstk.fi/api/temp-allocation/${address}`
        )
        setCommunityHash(res?.data?.communityInfo?.estimatedHashTokensCommunity)
        setCommunityPoints(res?.data?.communityInfo?.totalInteractionPoints)
        setEpoch(res?.data?.communityInfo?.latestEpoch)
        setSnapshotNumber(res?.data?.communityInfo.latestSnapshotNumber)
        let arr: any = []
        setSnapshotNumber(res?.data?.communityInfo.latestSnapshotNumber)
        arr.push({
          id: 0,
          start: '25th Nov',
          end: '8th Dec',
          epoch: res?.data?.userInfo?.epoch,
          tradders: res?.data?.userInfo?.totalReferredAddresses,
          liq: res?.data?.userInfo?.selfValue,
          supplyliq: res?.data?.userInfo?.supplyValue,
          borrowliq: res?.data?.userInfo?.borrowValue,
          referredliq: res?.data?.userInfo?.referralValue,
          pts: res?.data?.userInfo?.totalPoints,
          ptsAllocated: res?.data?.userInfo?.allocatedData?.pointsAllocated,
          selfpts: res?.data?.userInfo?.selfPoints,
          referredpts: res?.data?.userInfo?.referralPoints,
          hashAllocated: res?.data?.userInfo?.allocatedData?.hashAllocated,
          est: res?.data?.userInfo?.estimatedHashTokensUser,
        })
        if (res?.data?.userInfo?.allocatedData?.pointsAllocated == null) {
          setuserPointsAllocated(0)
        } else {
          setuserPointsAllocated(
            res?.data?.userInfo?.allocatedData?.pointsAllocated
          )
        }
        if (res?.data?.userInfo?.allocatedData?.hashAllocated == null) {
          setuserHashAllocated(0)
        } else {
          setuserHashAllocated(
            res?.data?.userInfo?.allocatedData?.hashAllocated
          )
        }

        setPersonalData(arr)
      }
    }
    fetchDetails()
  }, [address])

  useEffect(() => {
    try {
      const fetchLeaderBoardData = async () => {
        const res = await axios.get('https://hstk.fi/api/leaderboard')
        setLeaderboardData(res?.data)
      }
      fetchLeaderBoardData()
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  useEffect(() => {
    updateDaysLeft()
  }, [])

  // Update days left on page load and start an interval to update it daily
  useEffect(() => {
    setCurrentPagination(1)
  }, [tabValue])

  const handleClickOutside = (event: MouseEvent) => {
    if (ddRef.current && !ddRef.current.contains(event.target as Node)) {
      dispatch(setAirdropDropdown(''))
    }
  }

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      dispatch(setAirdropDropdown(''))
    }
  }

  const updateDaysLeft = () => {
    const now = new Date()
    const timeDiff = endDate.getTime() - now.getTime()
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24))
    setDaysLeft(daysLeft)
  }

  const handleChange = async (e: any) => {
    if (exisitingLink != null) {
    } else {
      if (totalBorrow == 0 && totalSupply == 0) {
      } else {
        if (totalBorrow == 0 && totalSupply == 0) {
          return
        } else {
          setRefferal(e.target.value)
        }
      }
    }
  }

  const handleCopyClick = async () => {
    try {
      if (exisitingLink) {
        await navigator.clipboard.writeText(
          (process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
            ? 'https://testnet.hstk.fi/'
            : 'https://hstk.fi/') + exisitingLink
        )
        toast.success('Copied', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      } else {
        if (totalBorrow > 0 || totalSupply > 0) {
          await navigator.clipboard.writeText(
            (process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
              ? 'https://testnet.hstk.fi/'
              : 'https://hstk.fi/') + refferal
          )
          axios
            .post(
              process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
                ? 'https://testnet.hstk.fi/shorten'
                : 'https://hstk.fi/shorten',
              { pseudo_name: refferal, address: address }
            )
            .then((response) => {
              toast.success('Copied', {
                position: toast.POSITION.BOTTOM_RIGHT,
              })
              //console.log(response, "response refer link"); // Log the response from the backend.
            })
            .catch((error) => {
              toast.error(error?.response?.data?.error, {
                position: toast.POSITION.BOTTOM_RIGHT,
              })
              console.error('Error:', error?.response?.data?.error)
            })
        }
      }
    } catch (error: any) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      console.error('Failed to copy text: ', error)
    }
  }

  return (
    <PageCard pt="4rem">
      <HStack
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        flexDirection="column"
        width="95%"
        pr="3rem"
        mb="1rem"
        zIndex="1"
      >
        <HStack
          mt="3rem"
          display="flex"
          // justifyContent="center"
          alignItems="center"
          width="full"
        >
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            gap="1rem"
          >
            <Button
              bg="transparent"
              fontStyle="normal"
              fontWeight="600"
              fontSize="14px"
              lineHeight="20px"
              alignItems="center"
              letterSpacing="-0.15px"
              padding="1.125rem 0.4rem"
              margin="2px"
              color={tabValue == 1 ? '#fff' : '#676D9A'}
              borderBottom={tabValue == 1 ? '2px solid #4D59E8' : ''}
              borderRadius="0px"
              _hover={{ bg: 'transparent', color: '#E6EDF3' }}
              onClick={() => {
                setTabValue(1)
              }}
            >
              Your dashboard
            </Button>

            <Button
              bg="transparent"
              fontStyle="normal"
              fontWeight="600"
              fontSize="14px"
              lineHeight="20px"
              alignItems="center"
              letterSpacing="-0.15px"
              padding="1.125rem 0.4rem"
              margin="2px"
              color={tabValue == 2 ? '#fff' : '#676D9A'}
              borderBottom={tabValue == 2 ? '2px solid #4D59E8' : ''}
              borderRadius="0px"
              _hover={{ bg: 'transparent', color: '#E6EDF3' }}
              onClick={() => {
                setTabValue(2)
              }}
            >
              LeaderBoard
            </Button>

            {/* Dropdown  */}
            {tabValue === 2 && (
              <Box
                display="flex"
                border="1px"
                borderColor="#2B2F35"
                justifyContent="space-between"
                ml="2rem"
                py="2"
                pl="3"
                pr="3"
                width="16rem"
                borderRadius="md"
                className="navbar"
                cursor="pointer"
                ref={ddRef}
                onClick={() =>
                  dispatch(setAirdropDropdown('airdropAndCcpDropdown'))
                }
              >
                <Box display="flex" gap="1">
                  <Text color="white">{currentSelectedDrop}</Text>
                </Box>

                <Box pt="1" className="navbar-button">
                  <DropdownUp />
                </Box>

                {airdropDropdowns.airdropAndCcpDropdown && (
                  <Box
                    w="full"
                    left="0"
                    bg="#03060B"
                    py="2"
                    className="dropdown-container"
                    boxShadow="dark-lg"
                  >
                    {['Airdrop 1', 'CCP 1'].map(
                      (item: string, index: number) => {
                        return (
                          <Box
                            key={index}
                            as="button"
                            w="full"
                            display="flex"
                            alignItems="center"
                            gap="1"
                            pr="2"
                            onClick={() => {
                              setCurrentSelectedDrop(item)
                            }}
                            _hover={{
                              bg: '#171026',
                            }}
                          >
                            {item === currentSelectedDrop && (
                              <Box
                                w="3px"
                                h="28px"
                                bg="#4954DC"
                                borderRightRadius="md"
                              ></Box>
                            )}
                            <Box
                              w="full"
                              display="flex"
                              py="5px"
                              px={`${item === currentSelectedDrop ? '3' : '5'}`}
                              gap="1"
                              borderRadius="md"
                            >
                              <Text color="white">{item}</Text>
                            </Box>
                          </Box>
                        )
                      }
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {!(tabValue==2 &&currentSelectedDrop=="Airdrop 1") &&<Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            gap="1rem"
            width="full"
          >
            <RegisterCCPModal />
            <SubmissionCCPModal />
          </Box>}
        </HStack>

        {tabValue == 1 ? (
          <HStack
            display="flex"
            width="100%"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <HStack
              mt="5rem"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
            >
              <HStack display="flex" justifyContent="space-between">
                <HStack
                  display="flex"
                  p="18px 26px"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                  borderRadius="8px"
                  gap="6.3rem"
                >
                  <VStack
                    display="flex"
                    justifyContent="center"
                    alignItems="flex-start"
                    gap={'6px'}
                  >
                    <Text color="#B1B0B5" fontSize="14px" alignItems="center">
                      Your Rank
                    </Text>
                    {userRankCCP !== null ? (
                      <Text color="#00D395" fontSize="20px" textAlign="center">
                        {userRankCCP === 0 ? '-' : userRankCCP}
                      </Text>
                    ) : (
                      <Skeleton
                        width="6rem"
                        height="1.4rem"
                        startColor="#101216"
                        endColor="#2B2F35"
                        borderRadius="6px"
                      />
                    )}
                  </VStack>
                  <VStack
                    gap={'6px'}
                    justifyContent="flex-start"
                    alignItems="flex-start"
                  >
                    <Text color="#B1B0B5" fontSize="14px" alignItems="center">
                      Total Points
                    </Text>
                    {userPointsCCP != null ? (
                      <Text color="#00D395" fontSize="20px">
                        {numberFormatter(userPointsCCP)}
                      </Text>
                    ) : (
                      <Skeleton
                        width="6rem"
                        height="1.4rem"
                        startColor="#101216"
                        endColor="#2B2F35"
                        borderRadius="6px"
                      />
                    )}
                  </VStack>
                  {/* <VStack
                    gap={"6px"}
                    justifyContent="flex-start"
                    alignItems="flex-start"
                  >
                    <Text color="#B1B0B5" fontSize="14px" alignItems="center">
                      <Tooltip
                        hasArrow
                        label=""
                        placement="bottom"
                        boxShadow="dark-lg"
                        bg="#010409"
                        fontSize={"13px"}
                        fontWeight={"thin"}
                        borderRadius={"lg"}
                        padding={"2"}
                        border="1px solid"
                        borderColor="#2B2F35"
                        arrowShadowColor="#2B2F35"
                      >
                        Hash tokens earned
                      </Tooltip>
                    </Text>
                    {userHashCCP == null ? (
                      <Skeleton
                        width="6rem"
                        height="1.4rem"
                        startColor="#101216"
                        endColor="#2B2F35"
                        borderRadius="6px"
                      />
                    ) : (
                      <Text color="#00D395" fontSize="20px">
                        {numberFormatter(userHashCCP)} HASH
                      </Text>
                    )}
                  </VStack> */}
                </HStack>
              </HStack>
            </HStack>

            <Box mt="3rem" display="flex" flexDirection="column">
              <Text
                color="#F0F0F5"
                fontSize="16px"
                fontWeight="400"
                lineHeight="20px"
                fontStyle="normal"
                mb="0.8rem"
              >
                Your Referral Link
              </Text>

              <Box display="flex" mt="0">
                <InputGroup
                  width="550px"
                  mt="0rem"
                  border="1px solid #676D9A"
                  borderRight="0px"
                  borderRadius="6px 0px 0px 6px"
                  height="5.3rem"
                >
                  <InputLeftAddon
                    height="80px"
                    fontSize="20px"
                    border="none"
                    bg="none"
                    color="#4D59E8"
                    paddingInlineEnd="0"
                  >
                    {process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
                      ? 'https://testnet.hstk.fi/'
                      : 'https://hstk.fi/'}
                  </InputLeftAddon>

                  {exisitingLink ? (
                    <Input
                      fontSize="20px"
                      height="80px"
                      border="none"
                      color="#F0F0F5"
                      value={exisitingLink}
                      paddingInlineStart="0"
                      _focus={{
                        outline: '0',
                        boxShadow: 'none',
                      }}
                      onChange={handleChange}
                    />
                  ) : (
                    <Input
                      fontSize="20px"
                      height="80px"
                      border="none"
                      color="#F0F0F5"
                      value={
                        totalBorrow == 0 && totalSupply == 0 ? '****' : refferal
                      }
                      paddingInlineStart="0"
                      _focus={{
                        outline: '0',
                        boxShadow: 'none',
                      }}
                      onChange={handleChange}
                    />
                  )}
                </InputGroup>
                <Box
                  cursor="pointer"
                  onClick={() => {
                    handleCopyClick()
                  }}
                >
                  <CopyToClipboard text="Works">
                    <CopyIcon />
                  </CopyToClipboard>
                </Box>
              </Box>

              {totalBorrow == 0 && totalSupply == 0 ? (
                <Box
                  display="flex"
                  bg="#222766"
                  p="4"
                  border="1px solid #3841AA"
                  fontStyle="normal"
                  fontWeight="400"
                  lineHeight="18px"
                  borderRadius="6px"
                  color="#B1B0B5"
                  fontSize="14px"
                  letterSpacing="-0.15px"
                  mt="0.3rem"
                >
                  <Box pr="3" mt="0.5" cursor="pointer">
                    <BlueInfoIcon />
                  </Box>
                  To generate your referral link, you must supply a min of $25,
                  or borrow $100.
                </Box>
              ) : (
                <Box
                  color="#676D9A"
                  fontSize="14px"
                  fontStyle="normal"
                  fontWeight="500"
                  lineHeight="20px"
                  letterSpacing="-0.15px"
                  mt="0.3rem"
                >
                  You can change this link only once
                </Box>
              )}
            </Box>
          </HStack>
        ) : (
          <HStack
            display="flex"
            width="100%"
            alignItems="flex-start"
            gap="5rem"
          >
            <HStack
              mt="5rem"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
            >
              <HStack display="flex" justifyContent="space-between">
                <HStack
                  display="flex"
                  p="28px 48px"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                  borderRadius="8px"
                  gap="6.3rem"
                  bg="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
                >
                  {currentSelectedDrop === 'Airdrop 1' && (
                    <VStack
                      display="flex"
                      justifyContent="center"
                      alignItems="flex-start"
                      gap={'6px'}
                    >
                      <Text color="#B1B0B5" fontSize="14px" alignItems="center">
                        Campaign pool
                      </Text>

                      <Text color="#00D395" fontSize="20px">
                        45M HASH
                      </Text>
                    </VStack>
                  )}

                  <VStack
                    gap={'6px'}
                    justifyContent="flex-start"
                    alignItems="flex-start"
                  >
                    <Text color="#B1B0B5" fontSize="14px" alignItems="center">
                      Points Accrued
                    </Text>

                    {communityPoints || totalPointsCCP ? (
                      <Text color="#00D395" fontSize="20px">
                        {currentSelectedDrop == 'Airdrop 1'
                          ? numberFormatter(communityPoints)
                          : numberFormatter(totalPointsCCP)}
                      </Text>
                    ) : (
                      <Skeleton
                        width="6rem"
                        height="1.4rem"
                        startColor="#101216"
                        endColor="#2B2F35"
                        borderRadius="6px"
                      />
                    )}
                  </VStack>
                  {currentSelectedDrop == 'Airdrop 1' && (
                    <VStack
                      gap={'6px'}
                      justifyContent="flex-start"
                      alignItems="flex-start"
                    >
                      <Text color="#B1B0B5" fontSize="14px" alignItems="center">
                        <Tooltip
                          hasArrow
                          label=""
                          placement="bottom"
                          boxShadow="dark-lg"
                          bg="#010409"
                          fontSize={'13px'}
                          fontWeight={'thin'}
                          borderRadius={'lg'}
                          padding={'2'}
                          border="1px solid"
                          borderColor="#2B2F35"
                          arrowShadowColor="#2B2F35"
                        >
                          Epoch Pool
                        </Tooltip>
                      </Text>

                      {!communityHash ? (
                        <Skeleton
                          width="6rem"
                          height="1.4rem"
                          startColor="#101216"
                          endColor="#2B2F35"
                          borderRadius="6px"
                        />
                      ) : (
                        <Text color="#00D395" fontSize="20px">
                          11.25M HASH
                        </Text>
                      )}
                    </VStack>
                  )}
                </HStack>
              </HStack>
            </HStack>

            <Box
              mt="6.5rem"
              display="flex"
              flexDirection="column"
              gap="1.8rem"
              color="#F0F0F5"
              fontSize="12px"
              lineHeight="20px"
              fontWeight="400"
            >
              {currentSelectedDrop=="Airdrop 1" ?
              <Box display="flex">
                <Link
                  href={"https://hashstack.medium.com/completed-airdrop-phase-1-c57ae0ff0251"}
                  style={{ display: "flex", gap: "1rem" }}
                  target="_blank"
                >
                  <Text fontSize="14px" fontWeight="500" color="#B1B0B5">Airdrop Campaign Complete</Text>
                  <ExternalLinkWhite />
                </Link>
              </Box>:<Box display="flex">
                <Link
                  href={"https://hashstack.medium.com/introducing-hashstacks-content-creator-program-ccp-435aea9c9d83"}
                  style={{ display: "flex", gap: "1rem" }}
                  target="_blank"
                >
                  <Text fontSize="14px" fontWeight="500" color="#B1B0B5">Read about Content Creator Program</Text>
                  <ExternalLinkWhite />
                </Link>
              </Box>
              }

              {currentSelectedDrop=="Airdrop 1"&&<Box display="flex">
                <Link
                  href={"https://hashstack.medium.com/launched-airdrop-for-hashstack-v1-d592ee7ff24e"}
                  style={{ display: "flex", gap: "1rem" }}
                  target="_blank"
                >
                  <Text fontSize="14px" fontWeight="500" color="#B1B0B5">Airdrop Launch</Text>
                  <ExternalLinkWhite />
                </Link>
              </Box>}
            </Box>
          </HStack>
        )}

        <Box
          borderRadius={'lg'}
          width={'100%'}
          background="var(--surface-of-10, rgba(103, 109, 154, 0.10))"
          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
          mt="1rem"
        >
          {tabValue == 1 ? (
            <UserCampaignData
              userHashCCP={userHashCCP}
              userPointsCCP={userPointsCCP}
              epochsData={epochsData}
              ccpUserData={userccpData}
              campaignDetails={campaignDetails}
              snapshotsData={snapshotData}
              leaderBoardData={personalData}
              columnItems={columnItemsPersonalStatsReferalCampaign}
            />
          ) : (
            <LeaderboardDashboard
              userRankCCP={userRankCCP}
              userHashCCP={userHashCCP}
              userPointsCCP={userPointsCCP}
              leaderBoardData={
                currentSelectedDrop == 'CCP 1'
                  ? ccpLeaderBoardData
                  : leaderboardData
              }
              currentSelectedDrop={currentSelectedDrop}
              airdropCampaignUserRank={userRank}
              personalData={personalData}
              columnItems={
                currentSelectedDrop == 'Airdrop 1'
                  ? columnItemsLeaderBoard
                  : columnItemsLeaderBoardCCp
              }
            />
          )}
        </Box>
      </HStack>
    </PageCard>
  )
}

export default Campaign
