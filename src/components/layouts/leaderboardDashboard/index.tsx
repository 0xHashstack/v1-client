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
    leaderBoardData:any,
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
const dispatch=useDispatch();
const handleDropdownClick = (dropdownName: any) => {
  // Dispatches an action called setModalDropdown with the dropdownName as the payload
  dispatch(setModalDropdown(dropdownName));
};
const tenure = ["Day","Week","Month"];
const modalDropdowns = useSelector(selectModalDropDowns);
const tooltips = [
    "Number of traders you have referred",
    "",
    "",
    "Points earned for rewards",
    "Estimated $HASH earned",
    
  ];
  const activeModal = Object.keys(modalDropdowns).find(
    (key) => modalDropdowns[key] === true
  );
    return(
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
          <Td
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
              </Td>
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
                    idx1 == columnItems?.length - 1 ? "right" : "center"
                  }
                  pl={idx1 == 0 ? 2 : 0}
                  pr={idx1 == columnItems.length - 1 ? 5 : 0}
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
                    bg="#010409"
                    fontSize={"13px"}
                    fontWeight={"thin"}
                    borderRadius={"lg"}
                    padding={"2"}
                    border="1px solid"
                    borderColor="#2B2F35"
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
                        {member.start} - {member.end}
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
                        {member.rank}
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
                        {member.wallet}
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
                        {member.liq}
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
                        {member.pts}
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
                        {member.est}
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
