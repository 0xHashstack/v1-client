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
} from "@chakra-ui/react";
import { selectModalDropDowns, setModalDropdown } from '@/store/slices/dropdownsSlice';
import { useDispatch, useSelector } from 'react-redux';
import ArrowUp from '@/assets/icons/arrowup';
import DropdownUp from '@/assets/icons/dropdownUpIcon';
import numberFormatter from "@/utils/functions/numberFormatter";
const LeaderboardDashboard = ({
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
  const tenure = ["Day", "Week", "Month"];
  const modalDropdowns = useSelector(selectModalDropDowns);
  const tooltips = [
    "",
    "",
    "Liquidity (Supply/Borrow,Referrals)",
    "Points earned for rewards",
    "Estimated $HASH earned",

  ];
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
          overflowX="hidden"
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
                {columnItems.map((val: any, idx1: any) => (
                  <Td
                    key={idx1}
                    width={"16.6%"}
                    // maxWidth={`${gap[idx1][idx2]}%`}
                    fontSize={"12px"}
                    fontWeight={400}
                    // textAlign={"left"}
                    p={0}
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
                        idx1 == 0 ? "left" : idx1 == columnItems?.length - 1 ? "right" : "center"
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
                ?.slice(lower_bound, upper_bound + 1)
                .map((member: any, idx: any) => {
                  ////console.log("faisal coin check", coin);
                  // borrowIDCoinMap.push([coin.id, coin?.name]);
                  return (
                    <>
                      <Tr
                        key={lower_bound + idx}
                        width={"100%"}
                        height="4rem"
                        // height={"5rem"}
                        // bgColor="green"
                        // borderBottom="1px solid #2b2f35"
                        position="relative"
                        p={0}
                      >
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
                            justifyContent={"start"}
                            fontWeight="400"
                            fontSize="14px"
                            color="#E6EDF3"
                          // bgColor={"blue"}
                          >
                            {lower_bound + 1 + idx}
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
                            {member.walletAddress.substring(
                              0,
                              5
                            )}...{member.walletAddress.substring(
                              member.walletAddress.length - 5,
                              member.walletAddress.length
                            )}
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
                                  Self-Liquidity: ${member.selfValue}
                                  <br />
                                  Referred-Liqudity: ${member.referralValue}
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
                                {numberFormatter(Number(member.selfValue) + Number(member.referralValue))}
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
                                  Points Allocated: {member.pointsAllocated ? member?.pointsAllocated : 0}
                                  <br />
                                  Points Estimated: {member.pointsEstimated ? member?.pointsEstimated : 0}
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
                                {member.netPoints}
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
                          <Text
                            width="100%"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-end"
                            fontWeight="400"
                            fontSize="14px"
                            color="#E6EDF3"
                            pr="10"

                          // bgColor={"blue"}
                          >
                            <Tooltip
                              hasArrow
                              label={
                                <Box>
                                  HASH Allocated: {member.hashAllocated ? member?.hashAllocated:0}
                                  <br />
                                  HASH Estimated: {member.estimatedHash ? member?.estimatedHash :0}
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
                            {numberFormatter(member.estimatedHash)}
                            </Tooltip>
                          </Text>
                        </Td>
                      </Tr>
                      <Tr
                        style={{
                          position: "absolute",
                          // left: "0%",
                          width: "100%",
                          height: "1px",
                          borderBottom: "1px solid #2b2f35",
                          display: `${member.id == 5 ? "none" : "block"}`,
                        }}
                      />
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

export default LeaderboardDashboard;
