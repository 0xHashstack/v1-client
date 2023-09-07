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
  HStack,
  VStack,
  useTimeout,
  Spinner,
  Skeleton,
  Tooltip,
  Select,
} from "@chakra-ui/react";
import Pagination from "@/components/uiElements/pagination";
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
  leaderBoardData: any;
  columnItems: any;

  // columnItems: Array<Array<string>>;
  // gap: string;
  // rowItems: any;
}) => {
  let lower_bound = 6 * (currentPagination - 1);
  let upper_bound = lower_bound + 5;
  const [loading, setLoading] = useState<boolean>(false);
  const [duration, setDuration] = useState<int>(1);
  const tooltips = [
    "Number of traders you have referred",
    "How much liquidity your referees hold with us",
    "Points earned for rewards",
    "Estimated token earning with us ",
  ];
  return loading ? (
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
      w={width}
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
              <Text
                whiteSpace="pre-wrap"
                overflowWrap="break-word"
                width={"100%"}
                height={"2rem"}
                fontSize="12px"
                textAlign="start"
                pl={0}
                pr={0}
                color={"#BDBFC1"}
                cursor="context-menu"
              >
                <Tooltip
                  hasArrow
                  label={"Select Date"}
                  // arrowPadding={-5420}
                  placement={"bottom"}
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
                  <Select
                    variant={"filled"}
                    bg="#010409"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    width={"70%"}
                    fontSize="sm"
                  >
                    <option
                      style={{ backgroundColor: "#010409", color: "white" }}
                      value="1"
                    >
                      Day
                    </option>
                    <option
                      style={{ backgroundColor: "#010409", color: "white" }}
                      value="2"
                    >
                      Month{" "}
                    </option>
                    <option
                      style={{ backgroundColor: "#010409", color: "white" }}
                      value="3"
                    >
                      Year{" "}
                    </option>
                  </Select>
                </Tooltip>
              </Text>
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
              // console.log("faisal coin check", coin);
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
                        {member.ref}
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
                        justifyContent="end"
                        fontWeight="400"
                        fontSize="14px"
                        color="#E6EDF3"

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
    <Pagination
          currentPagination={currentPagination}
          setCurrentPagination={(x: any) => setCurrentPagination(x)}
          max={leaderBoardData?.length || 0}
          rows={6}
        />
        <br/>
    </>
    
  );
};

export default LeaderboardDashboard;
