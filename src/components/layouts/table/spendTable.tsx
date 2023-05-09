import React, { useState } from "react";
import {
  Box,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Text,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
} from "@chakra-ui/react";
import BTCLogo from "@/assets/icons/coins/btc";
import USDTLogo from "./tableIcons/usdt";
import SmallUsdt from "@/assets/icons/coins/smallUsdt";
import TableUsdtLogo from "./usdtLogo";
import TableBtcLogo from "./btcLogo";
import JediswapLogo from "@/assets/icons/dapps/jediswapLogo";
import TableJediswapLogo from "./tableIcons/jediswapLogo";
import TableYagiLogo from "./tableIcons/yagiLogo";
import TableMySwap from "./tableIcons/mySwap";
import InfoIcon from "@/assets/icons/infoIcon";
import TableClose from "./tableIcons/close";
import TableInfoIcon from "./tableIcons/infoIcon";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setCurrentPage } from "@/store/slices/userAccountSlice";
const SpendTable = () => {
  const [showWarning, setShowWarning] = useState(true);

  const handleClick = () => {
    //   onClick={setShowWarning(() => false)}
    setShowWarning(false);
  };

  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];

  const rows = [
    ["Borrow ID 12345", "rUSDT", "10,324.556", "BTC", "10,325.55367"],
    ["Borrow ID 12345", "rUSDT", "10,324.556", "BTC", "10,325.55367"],
    ["Borrow ID 12345", "rUSDT", "10,324.556", "BTC", "10,325.55367"],
  ];

  const dispatch = useDispatch();
  return (
    <>
      {showWarning && (
        <Box display="flex" justifyContent="left" w="94%" pb="2">
          <Box
            display="flex"
            bg="#DDF4FF"
            fontSize="sm"
            p="4"
            borderRadius="md"
          >
            <Box py="1" pr="4" cursor="pointer">
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
        py="6"
        color="white"
        borderRadius="md"
        w="94%"
        px="3"
      >
        <Table variant="unstyled">
          {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
          <Thead>
            <Tr className="font-inter" color="#BDBFC1">
              <Th fontWeight="thin">Borrow ID</Th>
              <Th fontWeight="thin" textAlign="center">
                Borrow market
              </Th>
              <Th fontWeight="thin" textAlign="center">
                Available borrow amount
              </Th>
              <Th fontWeight="thin" textAlign="center">
                Collateral market
              </Th>
              <Th fontWeight="thin" textAlign="center">
                Collateral amount
              </Th>
            </Tr>
          </Thead>

          <Tbody bg="inherit">
            {rows.map((currentRow, index) => {
              return (
                <Tr
                  _hover={{
                    backgroundColor: "#2B2F35",
                    width: "80%",
                    borderRadius: "4rem",
                  }}
                  key={index}
                >
                  <Td>
                    <Box display="flex" gap="2">
                      {currentRow[0]}
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
                      <Text>{currentRow[1]}</Text>
                    </Box>
                  </Td>
                  <Td textAlign="center">{currentRow[2]}</Td>
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
                      <Text>{currentRow[3]}</Text>
                    </Box>
                  </Td>
                  <Td textAlign="center">{currentRow[4]}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="left" w="89%" pt="14">
        <Tabs variant="unstyled">
          <TabList borderRadius="md" bg="#101216" color="white">
            <Tab
              py="1"
              px="3"
              //   color="#6E7681"
              fontSize="sm"
              border="1px"
              borderColor="#2B2F35"
              borderLeftRadius="md"
              fontWeight="normal"
              _selected={{
                // color: "white",
                bg: "#0969DA",
                border: "none",
              }}
            >
              stake
            </Tab>
            <Tab
              py="1"
              px="3"
              //   color="#6E7681"
              fontSize="sm"
              border="1px"
              borderColor="#2B2F35"
              //   borderRightRadius="md"
              fontWeight="normal"
              _selected={{
                // color: "white",
                bg: "#0969DA",
                border: "none",
              }}
            >
              swap
            </Tab>
            <Tab
              py="1"
              px="3"
              //   color="#6E7681"
              fontSize="sm"
              border="1px"
              borderColor="#2B2F35"
              //   borderRightRadius="md"
              fontWeight="normal"
              _selected={{
                // color: "white",
                bg: "#0969DA",
                border: "none",
              }}
            >
              trade
            </Tab>
            <Tab
              py="1"
              px="3"
              //   color="#6E7681"
              fontSize="sm"
              border="1px"
              borderColor="#2B2F35"
              borderRightRadius="md"
              fontWeight="normal"
              _selected={{
                // color: "white",
                bg: "#0969DA",
                border: "none",
              }}
            >
              Liquidity provision
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>stake</p>
            </TabPanel>
            <TabPanel px="0" pt="8">
              <Box>
                <Text color="white" fontSize="sm">
                  Select a Dapp to begin with the spend
                </Text>
                <Box display="flex" gap="14" mt="3">
                  <TableYagiLogo />
                  <TableJediswapLogo />
                  <TableMySwap />
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
      </Box>
    </>
  );
};

export default SpendTable;
