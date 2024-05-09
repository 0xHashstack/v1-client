import {
  Box,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import CircularDropDown from '@/assets/icons/circularDropDown'
import CircularDropDownActive from '@/assets/icons/circularDropDownActive'
import CircularDropDownClose from '@/assets/icons/circularDropDownClose'
import ExternalLink from '@/assets/icons/externalLink'
import numberFormatter from '@/utils/functions/numberFormatter'
import Link from 'next/link'

const snapshotsDates = [
  '30 Nov 2023',
  '2 Nov 2023',
  '4 Dec 2023',
  '6 Dec 2023',
  '8 Dec 2023',
  '10 Dec 2023',
  '14 Dec 2023',
  '16 Dec 2023',
  '18 Dec 2023',
  '20 Dec 2023',
  '22 Dec 2023',
  '24 Dec 2023',
  '28 Dec 2023',
  '30 Dec 2023',
  '1 Jan 2024',
  '3 Jan 2024',
  '5 Jan 2024',
  '7 Jan 2024',
  '11 Jan 2024',
  '13 Jan 2024',
  '15 Jan 2024',
  '17 Jan 2024',
  '19 Jan 2024',
  '21 jan 2024',
]
const Months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
]
const tooltips = ['', '', 'Allocated $HASH']

interface UserCampaignDataProps {
  leaderBoardData: any
  columnItems: any
  epochsData: any
  ccpUserData: any
  snapshotsData: any
  campaignDetails: any
  userHashCCP: any
  userPointsCCP: any
}

const UserCampaignData: React.FC<UserCampaignDataProps> = ({
  leaderBoardData,
  columnItems,
  epochsData,
  ccpUserData,
  snapshotsData,
  campaignDetails,
  userHashCCP,
  userPointsCCP,
}) => {
  const [epochDropdownSelected, setepochDropdownSelected] = useState(false)
  const [groupedSnapshots, setGroupedSnapshots] = useState([[], [], [], []])
  const [loading, setLoading] = useState<boolean>(false)
  const [openEpochs, setOpenEpochs] = useState<any>([])
  const [ccpDropdownSelected, setccpDropdownSelected] = useState(false)
  const [hoverEpochDrop, sethoverEpochDrop] = useState(false)
  const [hoverccpDrop, sethoverccpDrop] = useState(false)
  let topLength = ccpUserData.length * 5.15

  // Function to toggle the open state of an epoch
  const toggleEpochSelection = (idxEpoch: any) => {
    setOpenEpochs((prevOpenEpochs: any[]) => {
      if (prevOpenEpochs.includes(idxEpoch)) {
        // Remove the index if it's already open
        return prevOpenEpochs.filter((index: any) => index !== idxEpoch)
      } else {
        // Add the index if it's not open
        return [...prevOpenEpochs, idxEpoch]
      }
    })
  }

  // Function to check whether an epoch is open
  const isEpochOpen = (idxEpoch: any) => {
    return openEpochs.includes(idxEpoch)
  }

  useEffect(() => {
    const groupSize = 6

    // Calculate the number of groups needed
    const numGroups = Math.ceil(snapshotsData.length / groupSize)

    // Initialize groupedSnapshots array
    const newGroupedSnapshots = Array.from(
      { length: numGroups },
      (_, groupIndex) =>
        snapshotsData
          .slice(groupIndex * groupSize, (groupIndex + 1) * groupSize)
          .sort((a: any, b: any) => a.snapshot_number - b.snapshot_number)
    )

    setGroupedSnapshots(newGroupedSnapshots)
  }, [snapshotsData])

  return loading ? (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="95%"
      height={'37rem'}
      bgColor="#101216"
      borderRadius="8px"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="#010409"
        size="xl"
      />
    </Box>
  ) : (
    <TableContainer
      color="white"
      borderRadius="md"
      w="100%"
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      height={'36rem'}
      padding={'1rem 2rem 0rem'}
      overflowY="scroll"
    >
      <Table variant="unstyled" width="100%">
        <Thead width={'100%'} height={'56px'}>
          <Tr width={'100%'} height="56px">
            {columnItems.map((val: any, idx1: any) => (
              <Td
                key={idx1}
                width={'16.6%'}
                fontSize={'12px'}
                fontWeight={400}
                p={0}
                cursor="pointer"
              >
                <Text
                  whiteSpace="pre-wrap"
                  overflowWrap="break-word"
                  width={'100%'}
                  height={'2rem'}
                  fontSize="12px"
                  textAlign={
                    idx1 == columnItems?.length - 1
                      ? 'right'
                      : idx1 == 0
                        ? 'left'
                        : 'center'
                  }
                  pl={idx1 == 0 ? 2 : 0}
                  pr={idx1 == columnItems.length - 1 ? 10 : 0}
                  color={'#BDBFC1'}
                  cursor="context-menu"
                >
                  <Tooltip
                    hasArrow
                    label={tooltips[idx1]}
                    placement={
                      (idx1 === 0 && 'bottom-start') ||
                      (idx1 === columnItems.length - 1 && 'bottom-end') ||
                      'bottom'
                    }
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

        <Tbody position="relative" alignContent={'center'}>
          {leaderBoardData.map((member: any, idx: any) => {
            return (
              <>
                <Tr
                  key={idx}
                  width={'100%'}
                  height="56px"
                  position="relative"
                  cursor="pointer"
                  p={0}
                  onClick={() => {
                    if (ccpUserData.length == 0) {
                    } else {
                      setccpDropdownSelected(!ccpDropdownSelected)
                    }
                  }}
                >
                  <Td
                    width={'16.6%'}
                    fontSize={'14px'}
                    fontWeight={400}
                    padding={2}
                    textAlign="center"
                    bg={'#676D9A48'}
                    borderRadius="6px 0 0 6px"
                  >
                    <Text
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      fontWeight="400"
                      fontSize="14px"
                      ml="10"
                      color="#E6EDF3"
                    >
                      <Image
                        src="/latestSyncedBlockGreenDot.svg"
                        alt="Picture of the author"
                        width="8"
                        height="8"
                        style={{
                          marginRight: '0.5rem',
                          marginBottom: '0.1rem',
                        }}
                      />
                      {campaignDetails[idx + 1]?.campaignName}
                    </Text>
                  </Td>

                  <Td
                    width={'16.6%'}
                    fontSize={'14px'}
                    fontWeight={400}
                    padding={2}
                    textAlign="center"
                    bg={'#676D9A48'}
                  >
                    <Text
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="400"
                      fontSize="14px"
                      color="#E6EDF3"
                    >
                      <Tooltip
                        hasArrow
                        label={''}
                        placement="right"
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
                        <Text>{campaignDetails[idx + 1]?.timeline}</Text>
                      </Tooltip>
                    </Text>
                  </Td>

                  <Td
                    width={'16.6%'}
                    fontSize={'14px'}
                    fontWeight={400}
                    padding={2}
                    textAlign="center"
                    bg={'#676D9A48'}
                  >
                    <Text
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="400"
                      fontSize="14px"
                      color="#E6EDF3"
                    >
                      <Tooltip
                        hasArrow
                        label={
                          <Box>
                            HASH Allocated:{' '}
                            {userHashCCP ? numberFormatter(userHashCCP) : 0}
                            <br />
                            HASH Estimated:{' '}
                            {member.est ? numberFormatter(member?.est) : 0}
                          </Box>
                        }
                        placement="right"
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
                        <Text>{numberFormatter(userHashCCP)}</Text>
                      </Tooltip>
                    </Text>
                  </Td>

                  <Td
                    width={'16.6%'}
                    fontSize={'14px'}
                    fontWeight={400}
                    padding={2}
                    textAlign="end"
                    bg={'#676D9A48'}
                    borderRadius="0 6px 6px 0"
                  >
                    <Box
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="end"
                      fontWeight="400"
                      fontSize="14px"
                      color="#E6EDF3"
                      pr="10"
                      gap="1rem"
                    >
                      <Text
                        textDecoration="underline"
                        cursor="pointer"
                        color="#3E415C"
                      >
                        Claim
                      </Text>
                      <Box
                        cursor="pointer"
                        onMouseEnter={() => {
                          sethoverccpDrop(true)
                        }}
                        onMouseLeave={() => {
                          sethoverccpDrop(false)
                        }}
                      >
                        {ccpDropdownSelected ? (
                          <CircularDropDownClose />
                        ) : hoverccpDrop ? (
                          <CircularDropDownActive />
                        ) : (
                          <CircularDropDown />
                        )}
                      </Box>
                    </Box>
                  </Td>
                </Tr>

                <Tr
                  key={idx}
                  width={'100%'}
                  height="4rem"
                  position="absolute"
                  cursor="pointer"
                  pl="1rem"
                >
                  {ccpDropdownSelected && (
                    <Box
                      borderRadius="6px"
                      mt="1rem"
                      mr="2rem"
                      ml="2rem"
                      border={'1px solid #676D9A48'}
                    >
                      {ccpUserData.map((data: any, idxccp: any) => (
                        <Box key={idxccp}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            cursor="pointer"
                            padding="24px 48px 24px 48px"
                            color="#F0F0F5"
                            fontSize="14px"
                            fontWeight="400"
                            lineHeight="20px"
                          >
                            <Text width={'10%'} textAlign="left">
                              {' '}
                              {data['Content Platform']}
                            </Text>
                            <Text textAlign="center">{data.Timestamp}</Text>
                            <Text>
                              {numberFormatter(
                                data['Recommended (Community Team)']
                                  ? data['Recommended (Community Team)']
                                  : 0
                              )}{' '}
                              points allocated
                            </Text>
                            {/* <Box display="flex" gap="1.5rem">
                              <Text>
                                {numberFormatter(data["Allocated (Product Team)"] ? data["Allocated (Product Team)"]:0 )} Hash tokens earned
                              </Text>
                            </Box> */}
                          </Box>
                          <Box
                            borderBottom={
                              idxccp == ccpUserData.length - 1
                                ? '0'
                                : '1px solid #676D9A48'
                            }
                          ></Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Tr>

                <Tr
                  key={idx}
                  width={'100%'}
                  height="4rem"
                  bg={epochDropdownSelected ? '#676D9A48' : ''}
                  cursor="pointer"
                  position="relative"
                  onClick={() => {
                    epochsData.length > 0 &&
                      setepochDropdownSelected(!epochDropdownSelected)
                  }}
                  p={0}
                  top={
                    ccpDropdownSelected
                      ? `${ccpUserData.length * 68 + 34}px`
                      : '4px'
                  }
                  style={{ borderRadius: '6px' }}
                >
                  <Td
                    width={'16.6%'}
                    fontSize={'14px'}
                    fontWeight={400}
                    padding={2}
                    textAlign="center"
                  >
                    <Text
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      fontWeight="400"
                      fontSize="14px"
                      ml="10"
                      color="#E6EDF3"
                    >
                      {campaignDetails[idx]?.campaignName}
                    </Text>
                  </Td>
                  <Td
                    width={'16.6%'}
                    fontSize={'14px'}
                    fontWeight={400}
                    padding={2}
                    textAlign="center"
                  >
                    <Text
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="400"
                      fontSize="14px"
                      color="#E6EDF3"
                    >
                      <Tooltip
                        hasArrow
                        label={''}
                        placement="right"
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
                        <Text>{campaignDetails[idx]?.timeline}</Text>
                      </Tooltip>
                    </Text>
                  </Td>
                  <Td
                    width={'16.6%'}
                    fontSize={'14px'}
                    fontWeight={400}
                    padding={2}
                    textAlign="center"
                  >
                    <Text
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="400"
                      fontSize="14px"
                      color="#E6EDF3"
                    >
                      <Tooltip
                        hasArrow
                        label={
                          <Box>
                            HASH Allocated:{' '}
                            {member.hashAllocated
                              ? numberFormatter(member?.hashAllocated)
                              : 0}
                            <br />
                            HASH Estimated:{' '}
                            {member.est ? numberFormatter(member?.est) : 0}
                          </Box>
                        }
                        placement="right"
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
                        <Text>
                          {numberFormatter(member.est + member.hashAllocated)}
                        </Text>
                      </Tooltip>
                    </Text>
                  </Td>
                  <Td
                    width={'16.6%'}
                    fontSize={'14px'}
                    fontWeight={400}
                    padding={2}
                    textAlign="end"
                  >
                    <Box
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="end"
                      fontWeight="400"
                      fontSize="14px"
                      color="#E6EDF3"
                      pr="10"
                      gap="1rem"
                    >
                      <Text
                        textDecoration="underline"
                        cursor="pointer"
                        color="#3E415C"
                      >
                        Claim
                      </Text>
                      <Box
                        cursor="pointer"
                        onMouseEnter={() => {
                          sethoverEpochDrop(true)
                        }}
                        onMouseLeave={() => {
                          sethoverEpochDrop(false)
                        }}
                      >
                        {epochDropdownSelected ? (
                          <CircularDropDownClose />
                        ) : hoverEpochDrop ? (
                          <CircularDropDownActive />
                        ) : (
                          <CircularDropDown />
                        )}
                      </Box>
                    </Box>
                  </Td>
                </Tr>

                <Tr
                  key={idx}
                  width={'100%'}
                  height="4rem"
                  position="absolute"
                  cursor="pointer"
                  pl="1rem"
                  top={
                    ccpDropdownSelected
                      ? epochDropdownSelected
                        ? `${ccpUserData.length * 68 + 64 * 2 + 34}px`
                        : `${ccpUserData.length * 68}px`
                      : ''
                  }
                >
                  {epochDropdownSelected && (
                    <Box
                      borderRadius="6px"
                      mt="1rem"
                      mr="2rem"
                      ml="2rem"
                      border={
                        openEpochs.length > 0 ? '' : '1px solid #676D9A48'
                      }
                      borderBottom={
                        openEpochs.length > 0 ? '1px solid #676D9A48' : ''
                      }
                    >
                      {epochsData.map((epochs: any, idxEpoch: any) => (
                        <Box key={idxEpoch}>
                          <Box
                            display="flex"
                            borderTop={
                              openEpochs.length > 0 ? '1px solid #676D9A48' : ''
                            }
                            borderLeft={
                              openEpochs.length > 0 ? '1px solid #676D9A48' : ''
                            }
                            borderBottom={
                              openEpochs.length > 0
                                ? isEpochOpen(idxEpoch)
                                  ? '1px solid #676D9A48'
                                  : ''
                                : ''
                            }
                            borderBottomRadius={
                              openEpochs.length > 0
                                ? isEpochOpen(idxEpoch)
                                  ? '6px'
                                  : ''
                                : '6px'
                            }
                            borderRight={
                              openEpochs.length > 0 ? '1px solid #676D9A48' : ''
                            }
                            borderRadius={
                              openEpochs.length > 0
                                ? isEpochOpen(idxEpoch)
                                  ? '6px'
                                  : ''
                                : '6px'
                            }
                            justifyContent="space-between"
                            cursor="pointer"
                            padding="24px 48px 24px 48px"
                            color="#F0F0F5"
                            fontSize="14px"
                            fontWeight="400"
                            lineHeight="20px"
                            onClick={() => {
                              toggleEpochSelection(idxEpoch)
                            }}
                          >
                            <Text>Epoch {epochs.epoch}</Text>
                            <Text>
                              {epochs.epoch == 1
                                ? '27 Nov 2023 - 11 Dec 2023'
                                : epochs.epoch == 2
                                  ? '12 Dec 2023 - 25 Dec 2023'
                                  : epochs.epoch == 3
                                    ? '26 Dec 2023 - 8 Jan 2024'
                                    : '9 Jan 2024 - 22 Jan 2024'}
                            </Text>
                            <Text>
                              {numberFormatter(epochs?.pointsAllocated)} points
                            </Text>
                            <Box display="flex" gap="1.5rem">
                              <Text>
                                {numberFormatter(epochs?.hashAllocated)} Hash
                                tokens earned
                              </Text>
                              {isEpochOpen(idxEpoch) ? (
                                <CircularDropDownClose />
                              ) : (
                                <CircularDropDownActive />
                              )}
                            </Box>
                          </Box>
                          <Box
                            borderBottom={
                              idxEpoch != 3
                                ? isEpochOpen(idxEpoch)
                                  ? ''
                                  : '1px solid #676D9A48'
                                : ''
                            }
                          ></Box>
                          {isEpochOpen(idxEpoch) && (
                            <Box>
                              {groupedSnapshots[idxEpoch]?.map(
                                (snapshot: any, idxSnap: any) => (
                                  <Box
                                    key={idxSnap}
                                    bg={
                                      idxSnap % 2 == 0
                                        ? '#676D9A16'
                                        : '#676D9A32'
                                    }
                                    mr="4rem"
                                    ml="4rem"
                                    borderRadius="6px"
                                  >
                                    <Box
                                      borderRadius="6px"
                                      mt="0.5"
                                      display="flex"
                                      justifyContent="space-between"
                                      cursor="pointer"
                                      ml="2rem"
                                      mr="2rem"
                                      padding="24px 24px 24px 24px"
                                      color="#F0F0F5"
                                      fontSize="14px"
                                      fontWeight="400"
                                      lineHeight="20px"
                                    >
                                      <Text>Snapshot {idxSnap + 1}</Text>
                                      <Text>
                                        {
                                          snapshotsDates[
                                            idxSnap + (epochs.epoch - 1) * 6
                                          ]
                                        }
                                      </Text>
                                      <Text>
                                        $
                                        {numberFormatter(
                                          snapshot?.supplyValue +
                                            snapshot?.borrowValue +
                                            snapshot?.referralValue
                                        )}{' '}
                                        Liquidity generated
                                      </Text>
                                      <Text>
                                        {numberFormatter(snapshot?.totalPoints)}{' '}
                                        points
                                      </Text>
                                      <Box display="flex" gap="1.5rem">
                                        <Text>
                                          {numberFormatter(
                                            snapshot?.estimatedHashTokensUser
                                          )}{' '}
                                          Hash tokens earned
                                        </Text>
                                        <Link
                                          href="https://github.com/0xHashstack/airdrop-snapshots"
                                          target="_blank"
                                        >
                                          <ExternalLink />
                                        </Link>
                                      </Box>
                                    </Box>
                                  </Box>
                                )
                              )}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Tr>

                {!epochDropdownSelected && (
                  <Tr
                    position="absolute"
                    width="100%"
                    height="1px"
                    borderTop="1px solid rgba(103, 109, 154, 0.30)"
                    top={
                      ccpDropdownSelected
                        ? `${ccpUserData.length * 68 + 64 * 2.5}px`
                        : ''
                    }
                  />
                )}
              </>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default UserCampaignData
