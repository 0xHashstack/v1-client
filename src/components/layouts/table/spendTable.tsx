import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserLoans,
  setCurrentPage,
} from "@/store/slices/userAccountSlice";
import HazardIcon from "@/assets/icons/hazardIcon";
import LiquidityProvisionModal from "@/components/modals/LiquidityProvision";
import TableYagiLogoDull from "./tableIcons/yagiLogoDull";
import TableMySwapDull from "./tableIcons/mySwapDull";
import TableJediswapLogoDull from "./tableIcons/jediswapLogoDull";
import Image from "next/image";
import StakeModal from "@/components/modals/StakeModal";
import SwapModal from "@/components/modals/SwapModal";
import { setSpendBorrowSelectedDapp } from "@/store/slices/userAccountSlice";
import { useRouter } from "next/router";
import SmallEth from "@/assets/icons/coins/smallEth";
import Pagination from "@/components/uiElements/pagination";
import BorrowModal from "../../modals/borrowModal";
const SpendTable = () => {
  const [showWarning, setShowWarning] = useState(true);
  const [currentBorrow, setCurrentBorrow] = useState(-1);
  const [selectedDapp, setSelectedDapp] = useState("");
  const [tradeNote, setTradeNote] = useState(false);
  const handleClick = () => {
    //   onClick={setShowWarning(() => false)}
    setShowWarning(false);
  };

  // const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];

  const columnItems = [
    "Borrow ID",
    "Borrowed",
    "Effective APR",
    "LTV",
    "Health factor",
  ];
  const userLoans: any = useSelector(selectUserLoans);
  console.log(userLoans, "user loans in spend table");
  const rows: any[] = [
    // ["Borrow ID 12345", "rUSDT", "7%", "BTC", "00.00%"],
    // ["Borrow ID 12346", "rBTC", "7%", "BTC", "00.00%"],
    // ["Borrow ID 12347", "rETH", "7%", "BTC", "00.00%"],
    // ["Borrow ID 12348", "rUSDT", "7%", "BTC", "00.00%"],
    // ["Borrow ID 12349", "rBTC", "7%", "BTC", "00.00%"],
    // ["Borrow ID 12350", "rETH", "10,324.556", "BTC", "00.00%"],
  ];

  const dispatch = useDispatch();

  const router = useRouter();
  function handleRouteChange(url: string) {
    dispatch(setSpendBorrowSelectedDapp(""));
  }

  const [borrowIDCoinMap, setBorrowIDCoinMap] = useState([]);
  const [borrowIds, setBorrowIds] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [currentMarketCoin, setCurrentMarketCoin] = useState("");
  const [borrowAmount, setBorrowAmount] = useState<number>(0);
  const [coins, setCoins] = useState([]);
  const [currentPagination, setCurrentPagination] = useState<number>(1);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedIndex, setselectedIndex] = useState(0);
  let lower_bound = 3 * (currentPagination - 1);
  let upper_bound = lower_bound + 2;
  upper_bound = Math.min(userLoans.length - 1, upper_bound);
  useEffect(() => {
    let temp1: any = [];
    let temp2: any = [];
    let temp3: any = [];
    if (userLoans.length != 0) {
      for (let i = 0; i < userLoans.length; i++) {
        temp1.push({
          id: userLoans[i].loanId,
          name: userLoans[i].loanMarket,
        });
        temp2.push(userLoans[i].loanId);
        temp3.push(userLoans[i].loanMarket);
      }
    }
    setBorrowIDCoinMap(temp1);
    setBorrowIds(temp2);
    setCoins(temp3);
    console.log("faisal coin mapping", borrowIDCoinMap);
  }, [userLoans]);

  useEffect(() => {
    setCurrentBorrow(-1);
    setSelectedDapp("");
    setTabIndex(0);
    dispatch(setSpendBorrowSelectedDapp(""));
  }, [currentPagination]);
  useEffect(() => {
    const handleRouteChangeComplete = (url: string) => {
      handleRouteChange(url);
    };

    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [handleRouteChange, router.events]);
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
            borderRadius="6px"
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
                localStorage.setItem("currentPage", "your borrow");
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
      {upper_bound >= lower_bound && userLoans.length > 0 ? (
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
                    // bgColor="red"
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
                      pl={idx1 == 0 ? "3rem" : 0}
                      pr={idx1 == columnItems.length - 1 ? 35 : 0}
                      color={"#BDBFC1"}
                    >
                      {val}
                    </Text>
                  </Td>
                ))}
              </Tr>
            </Thead>

            <Tbody bg="inherit" position="relative">
              {userLoans
                .slice(lower_bound, upper_bound + 1)
                .filter((borrow: any) => borrow.spendType === "UNSPENT")
                .map((borrow: any) => {
                  return (
                    <>
                      <Tr
                        _hover={{
                          // backgroundColor: "#2B2F35",
                          // width: "80%",
                          borderRadius: "0px",
                        }}
                        position="relative"
                        height="4rem"
                        key={borrow.idx}
                        cursor="pointer"
                        bgColor={
                          currentBorrow == borrow.loanId ? "#2B2F35" : "none "
                        }
                        // bgColor="green"
                        onClick={() => {
                          setSelectedDapp("trade");
                          setCurrentBorrow(borrow.loanId);
                          setBorrowAmount(borrow.currentLoanAmountParsed);
                          setCurrentId("ID - " + borrow.loanId);
                          setCurrentMarketCoin(borrow.currentLoanMarket);
                          dispatch(setSpendBorrowSelectedDapp("trade"));
                        }}
                      >
                        <Td borderLeftRadius="6px" pl="3rem">
                          <Box
                            position="absolute"
                            height="24px"
                            width="4px"
                            // borderRadius="6px"
                            bgColor="#2B2F35"
                            left={-2}
                            display={
                              currentBorrow == borrow.loanId ? "block" : "none"
                            }
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
                              BORROW ID {borrow.loanId}
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
                              <Image
                                src={`./${borrow.currentLoanMarket}.svg`}
                                alt="Picture of the author"
                                width={16}
                                height={16}
                              />
                            </Box>
                            <Text
                              fontSize="14px"
                              fontWeight="400"
                              fontStyle="normal"
                              lineHeight="22px"
                              color="#E6EDF3"
                            >
                              {borrow.currentLoanMarket}
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
                          7%
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
                              BTC
                            </Text>
                          </Box>
                        </Td>
                        <Td p={0} borderRightRadius="6px">
                          <Box
                            display="flex"
                            // gap="2"
                            // bgColor="blue"
                            justifyContent="flex-end"
                            pr="40px"
                            // pl="30px"
                          >
                            <Text
                              width="40%"
                              fontSize="14px"
                              fontWeight="400"
                              fontStyle="normal"
                              lineHeight="22px"
                              color="#E6EDF3"
                              textAlign="right"
                            >
                              00.00%
                            </Text>
                          </Box>
                        </Td>
                      </Tr>
                    </>
                  );
                })}
              {(() => {
                const rows2 = [];
                for (
                  let i: number = 0;
                  i < 3 - (upper_bound - lower_bound + 1);
                  i++
                ) {
                  rows2.push(<Tr height="4rem"></Tr>);
                }
                return rows2;
              })()}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <>
          <Box
            border="1px"
            borderColor="#2B2F35"
            // py="6"
            color="white"
            borderRadius="md"
            w="94%"
            // px="3"
            p="2rem 1rem 24px"
            h="283px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            gap="4px"
          >
            <Text color="#FFFFFF">You do not have outstanding borrows</Text>
            <BorrowModal
              buttonText="Borrow assets"
              variant="link"
              fontSize="16px"
              fontWeight="400"
              display="inline"
              color="#0969DA"
              cursor="pointer"
              ml="0.4rem"
              lineHeight="24px"
            />
          </Box>
        </>
      )}

      <Box
        paddingY="1rem"
        width="95%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Pagination
          currentPagination={currentPagination}
          setCurrentPagination={(x: any) => setCurrentPagination(x)}
          max={userLoans.length}
          rows={3}
        />
      </Box>
      <Box
        display="flex"
        justifyContent="left"
        w="94%"
        height="16rem"

        // bgColor="pink"
      >
        <Tabs
          variant="unstyled"
          defaultIndex={selectedIndex}
          pt="2rem"
          display="flex"
          flexDirection="column"
          width="45%"
          gap="2rem"
          index={tabIndex}
          onChange={(index) => setTabIndex(index)}
        >
          <TabList
            // borderRadius="26px"
            color={selectedDapp == "" ? "#2B2F35" : "white"}
            h="2rem"
            width="100%"
            display="flex"
            // bgColor="red"
          >
            <Tab
              // padding="6px 16px"
              //   color="#6E7681"
              fontSize="14px"
              fontStyle="normal"
              border="1px"
              borderColor="#2B2F35"
              lineHeight="20px"
              // borderLeftRadius="md"
              fontWeight="500"
              borderLeftRadius="6px"
              _selected={{
                // color: "white",
                bg: selectedDapp != "" ? "#0969DA" : "none",
                // border: "none",
              }}
              _disabled={{
                background: "#101216",
              }}
              isDisabled={selectedDapp == ""}
            >
              Liquidity provision
            </Tab>
            <Tab
              // padding="6px 16px"
              //   color="#6E7681"
              fontSize="14px"
              fontStyle="normal"
              border="1px"
              borderColor="#2B2F35"
              lineHeight="20px"
              // borderLeftRadius="md"
              fontWeight="500"
              borderRadius="0px"
              _selected={{
                // color: "white",
                bg: selectedDapp != "" ? "#0969DA" : "none",
                // border: "none",
              }}
              _disabled={{
                background: "#101216",
              }}
              isDisabled={selectedDapp == ""}
              // isDisabled={selectedDapp == ""}
            >
              swap
            </Tab>
            <Tab
              // padding="0px 16px"
              //   color="#6E7681"
              fontSize="14px"
              fontStyle="normal"
              border="1px"
              borderColor="#2B2F35"
              lineHeight="20px"
              fontWeight="500"
              // borderRadius="0px"
              _selected={{
                // color: "white",
                bg: selectedDapp != "" ? "#0969DA" : "none",
                // border: "none",
              }}
              _disabled={{
                background: "#101216",
              }}
              isDisabled={selectedDapp == ""}
            >
              stake
            </Tab>

            <Tab
              // padding="6px 16px"
              //   color="#6E7681"
              fontSize="14px"
              fontStyle="normal"
              border="1px"
              borderColor="#2B2F35"
              lineHeight="20px"
              // borderLeftRadius="md"
              fontWeight="500"
              borderRadius="0px"
              borderRightRadius="6px"
              _selected={{
                // color: "white",
                bg: selectedDapp != "" ? "#0969DA" : "none",
                // border: "none",
              }}
              _disabled={{
                background: "#101216",
              }}
              onClick={() => setTradeNote(true)}
              isDisabled={selectedDapp == ""}
            >
              Trade
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <Box display="flex" flexDirection="column">
                <Text
                  color={selectedDapp != "" ? "white" : "#2B2F35"}
                  fontSize="sm"
                >
                  Select a Dapp to begin with the spend
                </Text>
                <LiquidityProvisionModal
                  borrowIDCoinMap={borrowIDCoinMap}
                  coins={coins}
                  borrowIds={borrowIds}
                  currentId={currentId}
                  currentMarketCoin={currentMarketCoin}
                  BorrowBalance={borrowAmount}
                />
              </Box>
            </TabPanel>
            <TabPanel padding="0">
              <Box>
                <Text
                  color={selectedDapp != "" ? "white" : "#2B2F35"}
                  fontSize="sm"
                >
                  Select a Dapp to begin with the spend
                </Text>
                <SwapModal
                  borrowIDCoinMap={borrowIDCoinMap}
                  coins={coins}
                  borrowIds={borrowIds}
                  currentId={currentId}
                  currentMarketCoin={currentMarketCoin}
                  BorrowBalance={borrowAmount}
                />
              </Box>
            </TabPanel>
            <TabPanel p={0}>
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
                      <StakeModal
                        borrowIDCoinMap={borrowIDCoinMap}
                        borrowIds={borrowIds}
                        currentId={currentId}
                        currentMarketCoin={currentMarketCoin}
                        BorrowBalance={borrowAmount}
                      />
                    ) : (
                      <TableYagiLogoDull />
                    )}
                  </Box>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel p={0}>
              <Box
                display={tradeNote ? "flex" : "none"}
                bg="#DDF4FF"
                fontSize="14px"
                p="8px"
                fontStyle="normal"
                fontWeight="400"
                borderRadius="6px"
                justifyContent="center"
                alignItems="flex-start"
                bgColor="#fff8c5"
                // textAlign="center"
                // bgColor="red"
              >
                <Box
                  cursor="pointer"
                  // bgColor="blue"
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  pt="1px"
                >
                  <Image
                    src="./alertTrade.svg"
                    alt="Picture of the author"
                    width="46"
                    height="46"
                  />
                </Box>
                <Box p="6px 2px" display="flex">
                  We are evaluating few promising DEXes to integrate. Please
                  check back at a late time.
                  <Box
                    p="2px 0px"
                    cursor="pointer"
                    // bgColor="pink"
                    onClick={() => setTradeNote(false)}
                  >
                    <TableClose />
                  </Box>
                </Box>
              </Box>
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
          {/* <LatestSyncedBlock width="16rem" height="100%" block={83207} /> */}
        </Box>
      </Box>
    </>
  );
};

export default SpendTable;
