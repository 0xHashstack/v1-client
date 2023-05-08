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
import LatestSyncedBlock from "@/components/uiElements/latestSyncedBlock";
import TableUsdtLogo from "./usdtLogo";
import TableBtcLogo from "./btcLogo";
import TableJediswapLogo from "./tableIcons/jediswapLogo";
import TableYagiLogo from "./tableIcons/yagiLogo";
import TableMySwap from "./tableIcons/mySwap";
import InfoIcon from "@/assets/icons/infoIcon";
import TableClose from "./tableIcons/close";
import TableInfoIcon from "./tableIcons/infoIcon";
import { useRouter } from "next/router";
import { px } from "framer-motion";
const SpendTable = () => {
  const [showWarning, setShowWarning] = useState(true);
  const router = useRouter();
  const { query } = router;
  console.log(query);

  const handleClick = () => {
    //   onClick={setShowWarning(() => false)}
    setShowWarning(false);
  };
  const handleBorrowChange = () => {
    router.push('/your-borrow')

  }

  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];

  const rows = [
    ["Borrow ID 12345", "rUSDT", "10,324.556", "BTC", "10,325.55367"],
    ["Borrow ID 12345", "rUSDT", "10,324.556", "BTC", "10,325.55367"],
    ["Borrow ID 12345", "rUSDT", "10,324.556", "BTC", "10,325.55367"],
  ];

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
            <Box
              ml="1"
              as="span"
              textDecoration="underline"
              color="#0C6AD9"
              cursor="pointer"
              onClick={handleBorrowChange}
            >
              your borrow
            </Box>
            <Box cursor="pointer" mt="0.1rem" ml="0.7rem" onClick={handleClick}>
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
              <Th fontWeight="400" fontSize="12px" fontStyle="normal" lineHeight="20px" textTransform="none">Borrow ID</Th>
              <Th fontWeight="400" fontSize="12px" fontStyle="normal" lineHeight="20px" textAlign="center" textTransform="none">
                Borrow market
              </Th>
              <Th fontWeight="400" fontSize="12px" fontStyle="normal" lineHeight="20px" textAlign="center" textTransform="none">
                Available borrow amount
              </Th>
              <Th fontWeight="400" fontSize="12px" fontStyle="normal" lineHeight="20px" textAlign="center" textTransform="none">
                Collateral market
              </Th>
              <Th fontWeight="400" fontSize="12px" fontStyle="normal" lineHeight="20px" textAlign="center" textTransform="none">
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
                    borderRadius: "10px",
                    borderRightRadius: "md",
                  }}
                  key={index}
                >
                  <Td>
                    <Box display="flex" gap="2">
                      <Text fontSize="14px" fontWeight="400" fontStyle="normal" lineHeight="22px" color="#E6EDF3">
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
                      <Text fontSize="14px" fontWeight="400" fontStyle="normal" lineHeight="22px" color="#E6EDF3">{currentRow[1]}</Text>
                    </Box>
                  </Td>
                  <Td textAlign="center" color="#E6EDF3" fontSize="14px" fontWeight="400" fontStyle="normal" lineHeight="22px">{currentRow[2]}</Td>
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
                      <Text fontSize="14px" fontWeight="400" fontStyle="normal" lineHeight="22px" color="#E6EDF3">{currentRow[3]}</Text>
                    </Box>
                  </Td>
                  <Td textAlign="center" fontSize="14px" fontWeight="400" fontStyle="normal" lineHeight="22px" color="#E6EDF3">{currentRow[4]}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="left" w="89%" pt="14" pb="6rem">
        <Tabs variant="unstyled">
          <TabList borderRadius="md" bg="#101216" color="white">
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
              _selected={{
                // color: "white",
                bg: "#0969DA",
                border: "none",
                borderRadius: "0px"
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
              _selected={{
                // color: "white",
                bg: "#0969DA",
                border: "none",
                borderRadius: "0px"
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
              _selected={{
                // color: "white",
                bg: "#0969DA",
                border: "none",
                borderRadius: "0px"
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
              borderLeftRadius="md"
              fontWeight="500"
              _selected={{
                // color: "white",
                bg: "#0969DA",
                border: "none",
                borderRadius: "0px"
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
                <Text color="white" fontSize="sm">
                  Select a Dapp to begin with the spend
                </Text>
                <Box display="flex" gap="14" mt="1rem" >
                  <Box cursor="pointer">
                    <TableYagiLogo />
                  </Box>
                  <Box cursor="pointer">

                    <TableJediswapLogo />
                  </Box>
                  <Box cursor="pointer">

                    <TableMySwap />
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
      </Box>
      

    </>
  );
};

export default SpendTable;
