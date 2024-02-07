import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Text,
  Box,
  Spinner,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import { selectModalDropDowns, setModalDropdown } from '@/store/slices/dropdownsSlice';
import { useDispatch, useSelector } from 'react-redux';
import ArrowUp from '@/assets/icons/arrowup';
import DropdownUp from '@/assets/icons/dropdownUpIcon';
import numberFormatter from "@/utils/functions/numberFormatter";
import CircularDropDown from "@/assets/icons/circularDropDown";
import CircularDropDownActive from "@/assets/icons/circularDropDownActive";
import ExternalLink from "@/assets/icons/externalLink";
import CircularDropDownClose from "@/assets/icons/circularDropDownClose";
const UserCampaignData = ({
  width,
  currentPagination,
  setCurrentPagination,
  leaderBoardData,
  columnItems,
}: // userLoans,
  {
    width: string;
    currentPagination: any;
    setCurrentPagination: any;
    leaderBoardData: any,
    columnItems: any;

    // columnItems: Array<Array<string>>;
    // gap: string;
    // rowItems: any;
  }) => {
  let lower_bound = 6 * (currentPagination - 1);
  let upper_bound = lower_bound + 5;
  const [loading, setLoading] = useState<boolean>(false);
  const [currentSelectedTenure, setcurrentSelectedTenure] = useState(
    "Day"
  );
  const dispatch = useDispatch();
  const handleDropdownClick = (dropdownName: any) => {
    // Dispatches an action called setModalDropdown with the dropdownName as the payload
    dispatch(setModalDropdown(dropdownName));
  };
  const [epochDropdownSelected, setepochDropdownSelected] = useState(false)
  const tenure = ["Day", "Week", "Month"];
  const modalDropdowns = useSelector(selectModalDropDowns);
  const tooltips = [
    "Number of traders you have referred",
    "Liquidity (Supply/Borrow,Referrals)",
    "Points earned for rewards",
    "Allocated $HASH",
  ];
  const [openEpochs, setOpenEpochs] = useState<any>([]);

  // Function to toggle the open state of an epoch
  const toggleEpochSelection = (idxEpoch: any) => {
    setOpenEpochs((prevOpenEpochs: any[]) => {
      if (prevOpenEpochs.includes(idxEpoch)) {
        // Remove the index if it's already open
        return prevOpenEpochs.filter((index: any) => index !== idxEpoch);
      } else {
        // Add the index if it's not open
        return [...prevOpenEpochs, idxEpoch];
      }
    });
  };
  const [hoverEpochDrop, sethoverEpochDrop] = useState(false)

  // Function to check whether an epoch is open
  const isEpochOpen = (idxEpoch: any) => {
    return openEpochs.includes(idxEpoch);
  };
  const epochData = [
    {
      Date: "27/11/2023 - 10/12/23",
      Points: 359,
      Hash: 559
    },
    {
      Date: "27/11/2023 - 10/12/23",
      Points: 359,
      Hash: 559
    },
    {
      Date: "27/11/2023 - 10/12/23",
      Points: 359,
      Hash: 559
    },
    {
      Date: "27/11/2023 - 10/12/23",
      Points: 359,
      Hash: 559
    },
  ]
  const snapshotData = [
    {
      Date: "27/11/2023 - 10/12/23",
      Liq: 330,
      Points: 359,
      Hash: 559
    },
    {
      Date: "27/11/2023 - 10/12/23",
      Liq: 330,
      Points: 359,
      Hash: 559
    },
    {
      Date: "27/11/2023 - 10/12/23",
      Liq: 330,
      Points: 359,
      Hash: 559
    },
    {
      Date: "27/11/2023 - 10/12/23",
      Liq: 330,
      Points: 359,
      Hash: 559
    },
    {
      Date: "27/11/2023 - 10/12/23",
      Liq: 330,
      Points: 359,
      Hash: 559
    },
    {
      Date: "27/11/2023 - 10/12/23",
      Liq: 330,
      Points: 359,
      Hash: 559
    },
  ]
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  );
  return (
    loading ? (
      <>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="95%"
          height={"37rem"}
          // height="552px"
          bgColor="#101216"
          borderRadius="8px"
        >
          {/* <Text color="#FFFFFF" fontSize="20px">
                  Loading...
                </Text> */}
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="#010409"
            size="xl"
          />
          {/* <YourBorrowModal
                  buttonText="Borrow assets"
                  variant="link"
                  fontSize="16px"
                  fontWeight="400"
                  display="inline"
                  color="#0969DA"
                  cursor="pointer"
                  ml="0.4rem"
                  lineHeight="24px"
                /> */}
        </Box>
      </>
    ) : (
      <>
        <TableContainer
          //   border="1px"
          //   borderColor="#2B2F35"
          color="white"
          borderRadius="md"
          w="100%"
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-start"

          // bgColor={"red"}
          // height={"100%"}
          height={"34rem"}
          padding={"1rem 2rem 0rem"}
          overflowY="scroll"
        // overflowX="hidden"
        // mt={"3rem"}
        >
          <Table
            variant="unstyled"
            width="100%"
          // bgColor={"blue"}
          // p={0}
          >
            <Thead width={"100%"} height={"5rem"}>
              <Tr width={"100%"} height="2rem">
                {/* <Td
                width={"16.6%"}
                // maxWidth={`${gap[idx1][idx2]}%`}
                fontSize={"12px"}
                fontWeight={400}
                // textAlign={"left"}
                p={0}
                // bgColor={"pink"}
                // border="1px solid red"
              >
                    <Box
                  display="flex"
                  border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
                  justifyContent="space-between"
                  py="2"
                  pl="3"
                  pr="3"
                  mb="1rem"
                  mt="0.3rem"
                  width="40%"
                  borderRadius="md"
                  className="navbar"
                  cursor="pointer"
                  onClick={() => {
                    handleDropdownClick("liquidityMiningTenureDropDown")
                  }}
                >
                  <Box display="flex" gap="1">
                    <Text color="white" mt="0.8">{currentSelectedTenure}</Text>
                  </Box>
                  <Box pt="1" className="navbar-button">
                    {activeModal ? <ArrowUp /> : <DropdownUp />}
                  </Box>
                  {modalDropdowns.liquidityMiningTenureDropDown && (
                    <Box
                      w="full"
                      left="0"
                      bg="#03060B"
                      border="1px solid #30363D"
                      py="2"
                      className="dropdown-container"
                      boxShadow="dark-lg"
                    >
                      {tenure?.map((coin, index: number) => {
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
                              setcurrentSelectedTenure(coin);
                              ////console.log(coin,"coin in supply modal")
                            }}
                          >
                            {coin === currentSelectedTenure && (
                              <Box
                                w="3px"
                                h="28px"
                                bg="#4D59E8"
                                borderRightRadius="md"
                              ></Box>
                            )}
                            <Box
                              w="full"
                              display="flex"
                              py="5px"
                              pl={`${coin === currentSelectedTenure ? "2" : "5"}`}
                              pr="3px"
                              gap="1"
                              justifyContent="space-between"
                              bg={`${
                                coin === currentSelectedTenure
                                  ? "#4D59E8"
                                  : "inherit"
                              }`}
                              borderRadius="md"
                            >
                              <Box display="flex">
                                <Text color="white">{coin}</Text>
                              </Box>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                  </Box>
              </Td> */}
                {columnItems.map((val: any, idx1: any) => (

                  <Td
                    key={idx1}
                    width={"16.6%"}
                    // maxWidth={`${gap[idx1][idx2]}%`}
                    fontSize={"12px"}
                    fontWeight={400}
                    // textAlign={"left"}
                    p={0}
                    cursor="pointer"

                  // bgColor={"pink"}
                  // border="1px solid red"
                  >
                    <Text
                      whiteSpace="pre-wrap"
                      overflowWrap="break-word"
                      width={"100%"}
                      height={"2rem"}
                      fontSize="12px"
                      textAlign={
                        idx1 == columnItems?.length - 1 ? "right" : idx1 == 0 ? "left" : "center"
                      }
                      pl={idx1 == 0 ? 2 : 0}
                      pr={idx1 == columnItems.length - 1 ? 10 : 0}
                      color={"#BDBFC1"}
                      cursor="context-menu"
                    >
                      <Tooltip
                        hasArrow
                        label={tooltips[idx1]}
                        // arrowPadding={-5420}
                        placement={
                          (idx1 === 0 && "bottom-start") ||
                          (idx1 === columnItems.length - 1 && "bottom-end") ||
                          "bottom"
                        }
                        rounded="md"
                        boxShadow="dark-lg"
                        bg="#02010F"
                        fontSize={"13px"}
                        fontWeight={"400"}
                        borderRadius={"lg"}
                        padding={"2"}
                        color="#F0F0F5"
                        border="1px solid"
                        borderColor="#23233D"
                        arrowShadowColor="#2B2F35"
                      // cursor="context-menu"
                      // marginRight={idx1 === 1 ? "52px" : ""}
                      // maxW="222px"
                      // mt="28px"
                      >
                        {val}
                      </Tooltip>
                    </Text>
                  </Td>
                ))}
              </Tr>
            </Thead>
            <Tbody
              position="relative"
              overflowX="hidden"
              alignContent={"center"}
            //   display="flex"
            //   flexDirection="column"
            //   gap={"1rem"}
            >
              {leaderBoardData
                .map((member: any, idx: any) => {
                  ////console.log("faisal coin check", coin);
                  // borrowIDCoinMap.push([coin.id, coin?.name]);
                  return (
                    <>
                      <Tr
                        key={idx}
                        width={"100%"}
                        height="4rem"
                        bg="#676D9A48"
                        // height={"5rem"}
                        // bgColor="green"
                        // borderBottom="1px solid #2b2f35"
                        position="relative"
                        cursor="pointer"
                        onClick={() => {
                          setepochDropdownSelected(!epochDropdownSelected)
                        }}
                        p={0}
                        style={{ borderRadius: "6px" }}
                      >
                        {/* <Td
                          width={"16.6%"}
                          // maxWidth={`${gap[idx1][idx2]}%`}
                          fontSize={"14px"}
                          fontWeight={400}
                          padding={2}
                          textAlign="center"
                        >
                          <Text
                            width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent={"start"}
                            fontWeight="400"
                            fontSize="14px"
                            color="#E6EDF3"
                          // bgColor={"blue"}
                          >
                            {member.start} - {member.end}
                          </Text>
                        </Td> */}
                        {/* <Td
                          width={"16.6%"}
                          // maxWidth={`${gap[idx1][idx2]}%`}
                          fontSize={"14px"}
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
                          // bgColor={"blue"}
                          >
                            {member.epoch}
                          </Text>
                        </Td> */}
                        <Td
                          width={"16.6%"}
                          // maxWidth={`${gap[idx1][idx2]}%`}
                          fontSize={"14px"}
                          fontWeight={400}
                          padding={2}
                          textAlign="center"
                        >
                          <Text
                            width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            // justifyContent="center"
                            fontWeight="400"
                            fontSize="14px"
                            ml="10"
                            color="#E6EDF3"
                          // bgColor={"blue"}
                          >
                            {member.tradders}
                          </Text>
                        </Td>
                        <Td
                          width={"16.6%"}
                          // maxWidth={`${gap[idx1][idx2]}%`}
                          fontSize={"14px"}
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
                          // bgColor={"blue"}
                          >
                            <Tooltip
                              hasArrow
                              label={
                                <Box>
                                  Supply/Borrow: ${member.supplyliq + member.borrowliq}
                                  <br />
                                  Referrals: ${member.referredliq}
                                </Box>
                              }
                              // arrowPadding={-5420}
                              placement="right"
                              rounded="md"
                              boxShadow="dark-lg"
                              bg="#02010F"
                              fontSize={"13px"}
                              fontWeight={"400"}
                              borderRadius={"lg"}
                              padding={"2"}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                              arrowShadowColor="#2B2F35"
                            // cursor="context-menu"
                            // marginRight={idx1 === 1 ? "52px" : ""}
                            // maxW="222px"
                            // mt="28px"
                            >
                              <Text>
                                {numberFormatter(Number(member.liq) + Number(member.referredliq))}
                              </Text>
                            </Tooltip>
                          </Text>
                        </Td>
                        <Td
                          width={"16.6%"}
                          // maxWidth={`${gap[idx1][idx2]}%`}
                          fontSize={"14px"}
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
                          // bgColor={"blue"}
                          >
                            <Tooltip
                              hasArrow
                              label={
                                <Box>
                                  Points Allocated: {numberFormatter(member.ptsAllocated)}
                                  <br />
                                  Points Estimated: {numberFormatter(member.pts)}
                                </Box>
                              }
                              // arrowPadding={-5420}
                              placement="right"
                              rounded="md"
                              boxShadow="dark-lg"
                              bg="#02010F"
                              fontSize={"13px"}
                              fontWeight={"400"}
                              borderRadius={"lg"}
                              padding={"2"}
                              color="#F0F0F5"
                              border="1px solid"
                              borderColor="#23233D"
                              arrowShadowColor="#2B2F35"
                            // cursor="context-menu"
                            // marginRight={idx1 === 1 ? "52px" : ""}
                            // maxW="222px"
                            // mt="28px"
                            >
                              <Text>
                                {numberFormatter(member.pts + member.ptsAllocated)}
                              </Text>
                            </Tooltip>
                          </Text>
                        </Td>
                        <Td
                          width={"16.6%"}
                          // maxWidth={`${gap[idx1][idx2]}%`}
                          fontSize={"14px"}
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
                          // bgColor={"blue"}
                          >
                            <Text textDecoration="underline" cursor="pointer">
                              Claim
                            </Text>
                            <Box cursor="pointer" onMouseEnter={()=>{sethoverEpochDrop(true)}} onMouseLeave={()=>{sethoverEpochDrop(false)}}>
                              {epochDropdownSelected ? <CircularDropDownClose /> : hoverEpochDrop ?<CircularDropDownActive/>: <CircularDropDown />}

                            </Box>
                          </Box>
                        </Td>
                      </Tr>
                      {/* <Tr
                        style={{
                          position: "absolute",
                          // left: "0%",
                          width: "100%",
                          height: "1px",
                          borderBottom: "1px solid rgba(103, 109, 154, 0.30)",
                          display: `${member.id == 5 ? "none" : "block"}`,
                        }}
                      /> */}
                      <Tr key={idx}
                        width={"100%"}
                        height="4rem"
                        // height={"5rem"}
                        // bgColor="green"
                        // borderBottom="1px solid #2b2f35"
                        position="absolute"
                        // position="relative"
                        cursor="pointer"
                        pl="1rem"  >
                        {epochDropdownSelected && <Box borderRadius="6px" mt="1rem" mr="2rem" ml="2rem" border={openEpochs.length > 0 ? "" : "1px solid #676D9A48"} borderBottom={openEpochs.length > 0 ? "1px solid #676D9A48" : ""}>
                          {epochData.map((epochs: any, idxEpoch: any) => (

                            <Box key={idxEpoch} >
                              <Box display="flex" borderTop={openEpochs.length > 0 ? "1px solid #676D9A48" : ""} borderLeft={openEpochs.length > 0 ? "1px solid #676D9A48" : ""} borderBottom={openEpochs.length > 0 ? isEpochOpen(idxEpoch) ? "1px solid #676D9A48" : "" : ""} borderBottomRadius={openEpochs.length > 0 ? isEpochOpen(idxEpoch) ? "6px" : "" : "6px"} borderRight={openEpochs.length > 0 ? "1px solid #676D9A48" : ""} borderRadius={openEpochs.length > 0 ? isEpochOpen(idxEpoch) ? "6px" : "" : "6px"} justifyContent="space-between" cursor="pointer" padding="24px 48px 24px 48px" color="#F0F0F5" fontSize="14px" fontWeight="400" lineHeight="20px" onClick={() => {
                                // setsnapshotDropdownSelected(!snapshotDropdownSelected)
                                toggleEpochSelection(idxEpoch)
                              }}>
                                <Text>
                                  Epoch {idxEpoch + 1}
                                </Text>
                                <Text>
                                  {epochs.Date}
                                </Text>
                                <Text>
                                  {epochs?.Points} points
                                </Text>
                                <Box display="flex" gap="1.5rem">
                                  <Text>
                                    {epochs?.Hash} Hash tokens earned
                                  </Text>
                                  {isEpochOpen(idxEpoch) ? <CircularDropDownClose /> : <CircularDropDownActive />}

                                </Box>
                              </Box>
                              <Box borderBottom={idxEpoch != 3 ? isEpochOpen(idxEpoch) ? "" : "1px solid #676D9A48" : ""} >
                              </Box>
                              {isEpochOpen(idxEpoch) &&
                                <Box mb="1rem">
                                  {snapshotData?.map((snapshot: any, idxSnap: any) => (
                                    <Box key={idxSnap} bg={idxSnap % 2 == 0 ? "#676D9A16" : "#676D9A32"} mr="4rem" ml="4rem" borderRadius="6px">
                                      <Box borderRadius="6px" mt="0.5" display="flex" justifyContent="space-between" cursor="pointer" ml="2rem" mr="2rem" padding="24px 24px 24px 24px" color="#F0F0F5" fontSize="14px" fontWeight="400" lineHeight="20px">
                                        <Text>
                                          Snapshot {idxSnap + 1}
                                        </Text>
                                        <Text>
                                          {snapshot.Date}
                                        </Text>
                                        <Text>
                                          ${snapshot?.Liq} Liquidity generated
                                        </Text>
                                        <Text>
                                          {snapshot?.Points} points
                                        </Text>
                                        <Box display="flex" gap="1.5rem">
                                          <Text>
                                            {snapshot?.Hash} Hash tokens earned
                                          </Text>
                                          <ExternalLink />
                                        </Box>
                                      </Box>
                                    </Box>
                                  ))}
                                </Box>
                              }



                            </Box>
                          ))}
                        </Box>}


                      </Tr>
                    </>
                  );

                })}
            </Tbody>
          </Table>

        </TableContainer>

      </>

    )
  )
};

export default UserCampaignData;