import React from "react";
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
} from "@chakra-ui/react";
import BTCLogo from "@/assets/icons/coins/btc";
import USDTLogo from "./tableIcons/usdt";
const SupplyTable = () => {
  const coins = ["BTC", "USDT", "USDC", "ETH", "DAI"];
  return (
    <TableContainer
      bg="#101216"
      border="1px"
      borderColor="#2B2F35"
      p="4"
      color="white"
      borderRadius="md"
      w="full"
    >
      <Table variant="unstyled">
        {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
        <Thead>
          <Tr>
            <Th fontWeight="thin">Market</Th>
            <Th fontWeight="thin" textAlign="center">
              Price
            </Th>
            <Th fontWeight="thin" textAlign="center">
              Total Supply
            </Th>
            <Th fontWeight="thin" textAlign="center">
              Supply APR
            </Th>
            <Th fontWeight="thin" textAlign="center">
              Supply
            </Th>
            <Th fontWeight="thin" textAlign="center">
              Details
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          <Tr>
            <Td>
              <Box display="flex" gap="2">
                <Box p="1">
                  <USDTLogo />
                </Box>
                <Box display="flex" flexDirection="column" gap="1">
                  <Text>USDT</Text>
                  <Text color="#8C8C8C" fontSize="10px">
                    Wallet Bal. $900
                  </Text>
                </Box>
              </Box>
            </Td>
            <Td textAlign="center">00000</Td>
            <Td textAlign="center">00000</Td>
            <Td textAlign="center">7.8%</Td>
            <Td textAlign="center">
              <Box
                as="button"
                border="1px"
                borderColor="#2B2F35"
                p="2"
                color="#6E6E6E"
              >
                Supply
              </Box>
            </Td>
            <Td textAlign="center">Details</Td>
          </Tr>
        </Tbody>

        {/* <Tbody>
          <Tr>
            <Td>inches</Td>
            <Td>millimetres (mm)</Td>
            <Td isNumeric>25.4</Td>
          </Tr>
          <Tr>
            <Td>feet</Td>
            <Td>centimetres (cm)</Td>
            <Td isNumeric>30.48</Td>
          </Tr>
          <Tr>
            <Td>yards</Td>
            <Td>metres (m)</Td>
            <Td isNumeric>0.91444</Td>
          </Tr>
        </Tbody> */}
        {/* <Tfoot>
          <Tr>
            <Th>To convert</Th>
            <Th>into</Th>
            <Th isNumeric>multiply by</Th>
          </Tr>
        </Tfoot> */}
      </Table>
    </TableContainer>
  );
};

export default SupplyTable;
