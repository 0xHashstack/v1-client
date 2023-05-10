import React, { useState } from "react";
import {
  Box,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Text,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
  Td,
} from "@chakra-ui/react";
import LatestSyncedBlock from "@/components/uiElements/latestSyncedBlock";
import TableUsdtLogo from "./usdtLogo";
import TableBtcLogo from "./btcLogo";
import TableJediswapLogo from "./tableIcons/jediswapLogo";
import TableYagiLogo from "./tableIcons/yagiLogo";
import TableMySwap from "./tableIcons/mySwap";
import InfoIcon from "@/assets/icons/infoIcon";
import TableClose from "./tableIcons/close";
import TableInfoIcon from "./tableIcons/infoIcon";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setCurrentPage } from "@/store/slices/userAccountSlice";
import TableYagiLogoDull from "./tableIcons/yagiLogoDull";
import TableMySwapDull from "./tableIcons/mySwapDull";
import TableJediswapLogoDull from "./tableIcons/jediswapLogoDull";
const SpendTable = () => {
  const [showWarning, setShowWarning] = useState(true);
  const [currentBorrow, setCurrentBorrow] = useState(-1);
  const [selectedDapp, setSelectedDapp] = useState("");
  const handleClick = () => {
    //   onClick={setShowWarning(() => false)}
    setShowWarning(false);
  };

  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];

  const columnItems = [
    "Borrow ID",
    "Borrowed",
    "Effective APR",
    "LTV",
    "Health factor",
  ];
  const rows = [
    ["Borrow ID 12345", "rUSDT", "10,324.556", "BTC", "00.00%"],
    ["Borrow ID 12345", "rUSDT", "10,324.556", "BTC", "00.00%"],
    ["Borrow ID 12345", "rUSDT", "10,324.556", "BTC", "00.00%"],
  ];

  const dispatch = useDispatch();
  return (
    <>
      {showWarning && (
        <Box display="flex" justifyContent="left" w="94%" pb="2">
          <Box
            display="flex"
            bg="#DDF4FF"
            fontSize="14px"
            p="4"
            fontStyle="normal"
            fontWeight="400"
            borderRadius="md"
            // textAlign="center"
          >
            <Box mt="0.1rem" mr="0.7rem" cursor="pointer">
              <TableInfoIcon />
            </Box>
            Only unspent loans are displayed here. For comprehensive list of
            active loans go to
            <Link
              href="/your-borrow"
              onClick={() => {
                dispatch(setCurrentPage("your borrow"));
              }}
            >
              <Box
                ml="1"
                as="span"
                textDecoration="underline"
                color="#0C6AD9"
                cursor="pointer"
              >
                your borrow
              </Box>
            </Link>
            <Box py="1" pl="4" cursor="pointer" onClick={handleClick}>
              <TableClose />
            </Box>
          </Box>
        </Box>
      )}
      <TableContainer
        //   bg="#101216"
        border="1px"
        borderColor="#2B2F35"
        // py="6"
        color="white"
        borderRadius="md"
        w="94%"
        // px="3"
        p="2rem 1rem 24px"
      >
        <Table variant="unstyled">
          {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
          <Thead width={"100%"}>
            <Tr width={"100%"} height="2rem">
              {columnItems.map((val: any, idx1: any) => (
                <Td
                  key={idx1}
                  width={"12.5%"}
                  fontSize={"12px"}
                  fontWeight={400}
                  p={0}
                >
                  <Text
                    whiteSpace="pre-wrap"
                    overflowWrap="break-word"
                    width={"100%"}
                    height={"2rem"}
                    fontSize="12px"
                    textAlign={
                      idx1 == 0
                        ? "left"
                        : idx1 == columnItems.length - 1
                        ? "right"
                        : "center"
                    }
                    pl={idx1 == 0 ? 6 : 0}
                    pr={idx1 == columnItems.length - 1 ? 45 : 0}
                    color={"#BDBFC1"}
                  >
                    {val}
                  </Text>
                </Td>
              ))}
            </Tr>
          </Thead>

          <Tbody bg="inherit" position="relative">
            {rows.map((currentRow, index) => {
              return (
                <>
                  <Tr
                    _hover={{
                      backgroundColor: "#2B2F35",
                      // width: "80%",
                      borderRadius: "6px",
                    }}
                    position="relative"
                    height="4rem"
                    key={index}
                    cursor="pointer"
                    bgColor={currentBorrow == index ? "#2B2F35" : "none "}
                    onClick={() => {
                      setSelectedDapp("trade");
                      setCurrentBorrow(index);
                    }}
                  >
                    <Td>
                      <Box
                        position="absolute"
                        height="24px"
                        width="4px"
                        borderRadius="6px"
                        bgColor="#2B2F35"
                        left={-2}
                        display={currentBorrow == index ? "blcok" : "none"}
                      />
                      <Box
                        display="flex"
                        gap="2"
                        // bgColor="blue"
                        justifyContent="flex-start"
                      >
                        <Text
                          fontSize="14px"
                          fontWeight="400"
                          fontStyle="normal"
                          lineHeight="22px"
                          color="#E6EDF3"
                          textAlign="left"
                        >
                          {currentRow[0]}
                        </Text>
                      </Box>
                    </Td>
                    <Td textAlign="center">
                      <Box
                        display="flex"
                        gap="1"
                        justifyContent="center"
                        h="full"
                        alignItems="center"
                      >
                        <Box my="1">
                          <TableUsdtLogo />
                        </Box>
                        <Text
                          fontSize="14px"
                          fontWeight="400"
                          fontStyle="normal"
                          lineHeight="22px"
                          color="#E6EDF3"
                        >
                          {currentRow[1]}
                        </Text>
                      </Box>
                    </Td>
                    <Td
                      textAlign="center"
                      color="#E6EDF3"
                      fontSize="14px"
                      fontWeight="400"
                      fontStyle="normal"
                      lineHeight="22px"
                    >
                      {currentRow[2]}
                    </Td>
                    <Td textAlign="center">
                      <Box
                        display="flex"
                        gap="1"
                        justifyContent="center"
                        h="full"
                        alignItems="center"
                      >
                        <Box my="1">
                          <TableBtcLogo />
                        </Box>
                        <Text
                          fontSize="14px"
                          fontWeight="400"
                          fontStyle="normal"
                          lineHeight="22px"
                          color="#E6EDF3"
                        >
                          {currentRow[3]}
                        </Text>
                      </Box>
                    </Td>
                    <Td p={0}>
                      <Box
                        display="flex"
                        // gap="2"
                        // bgColor="blue"
                        justifyContent="flex-end"
                        pr={5}
                      >
                        <Text
                          width="40%"
                          fontSize="14px"
                          fontWeight="400"
                          fontStyle="normal"
                          lineHeight="22px"
                          color="#E6EDF3"
                          textAlign="center"
                        >
                          {currentRow[4]}
                        </Text>
                      </Box>
                    </Td>
                  </Tr>
                </>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="left" w="94%" height="16rem">
        <Tabs variant="unstyled" defaultIndex={1} pt="0rem">
          <TabList
            borderRadius="26px"
            color={selectedDapp == "" ? "#2B2F35" : "white"}
          >
            <Tab
              padding="0px 16px"
              //   color="#6E7681"
              fontSize="14px"
              fontStyle="normal"
              border="1px"
              borderColor="#2B2F35"
              lineHeight="20px"
              borderLeftRadius="6px"
              fontWeight="500"
              // borderRadius="0px"
              _selected={{
                // color: "white",
                bg: selectedDapp != "" ? "#0969DA" : "none",
                // border: "none",
              }}
            >
              stake
            </Tab>
            <Tab
              padding="6px 16px"
              //   color="#6E7681"
              fontSize="14px"
              fontStyle="normal"
              border="1px"
              borderColor="#2B2F35"
              lineHeight="20px"
              borderLeftRadius="md"
              fontWeight="500"
              borderRadius="0px"
              _selected={{
                // color: "white",
                bg: selectedDapp != "" ? "#0969DA" : "none",
                // border: "none",
              }}
            >
              swap
            </Tab>
            <Tab
              padding="6px 16px"
              //   color="#6E7681"
              fontSize="14px"
              fontStyle="normal"
              border="1px"
              borderColor="#2B2F35"
              lineHeight="20px"
              borderLeftRadius="md"
              fontWeight="500"
              borderRadius="0px"
              _selected={{
                // color: "white",
                bg: selectedDapp != "" ? "#0969DA" : "none",
                // border: "none",
              }}
            >
              trade
            </Tab>
            <Tab
              padding="6px 16px"
              //   color="#6E7681"
              fontSize="14px"
              fontStyle="normal"
              border="1px"
              borderColor="#2B2F35"
              lineHeight="20px"
              borderRightRadius="6px"
              fontWeight="500"
              _selected={{
                // color: "white",
                bg: "#0969DA",
                // border: "none",
              }}
            >
              Liquidity provision
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>stake</p>
            </TabPanel>
            <TabPanel padding="0" mt="1.5rem">
              <Box>
                <Text
                  color={selectedDapp != "" ? "white" : "#2B2F35"}
                  fontSize="sm"
                >
                  Select a Dapp to begin with the spend
                </Text>
                <Box display="flex" gap="14" mt="1rem">
                  <Box cursor="pointer">
                    {selectedDapp != "" ? (
                      <TableYagiLogo />
                    ) : (
                      <TableYagiLogoDull />
                    )}
                  </Box>
                  <Box cursor="pointer">
                    {selectedDapp != "" ? <TableMySwap /> : <TableMySwapDull />}
                  </Box>
                  <Box cursor="pointer">
                    {selectedDapp != "" ? (
                      <TableJediswapLogo />
                    ) : (
                      <TableJediswapLogoDull />
                    )}
                  </Box>
                </Box>
              </Box>
            </TabPanel>
            <TabPanel>
              <p>trade</p>
            </TabPanel>
            <TabPanel>
              <p>Liquidity provision</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Box
          // mt="1rem"
          // height="100%"
          // bgColor={"blue"}
          width="95%"
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <LatestSyncedBlock width="16rem" height="100%" block={83207} />
        </Box>
      </Box>
    </>
  );
};

export default SpendTable;
