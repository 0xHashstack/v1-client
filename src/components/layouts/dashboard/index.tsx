import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Wrap,
  Text,
  Box,
} from "@chakra-ui/react";

import BTCLogo from "@/assets/images/stakeIcon.svg";
import USDTLogo from "@/assets/images/stakeIcon.svg";
import Image from "next/image";

const Dashboard = ({
  width,
  columnItems,
  gap,
  rowItems,
}: {
  width: string;
  columnItems: Array<Array<string>>;
  gap: string;
  rowItems: any;
}) => {
  function numberFormat(str: string) {
    // Check if the input string contains numbers
    const regExp = /\d/;
    if (regExp.test(str)) {
      let num: any = parseFloat(str);
      let suffix = "";

      // Convert large numbers to condensed format
      if (num >= 1000000000) {
        num = num / 1000000000;
        suffix = "B";
      } else if (num >= 1000000) {
        num = num / 1000000;
        suffix = "M";
      } else if (num >= 1000) {
        num = num / 1000;
        suffix = "K";
      }

      // Handle cases when the number is less than 1, but greater than 0
      if (num < 1 && num > 0) {
        num = num.toFixed(2);
      } else {
        num = Math.floor(num);
      }

      // Add suffix to the converted number
      num = num.toString() + suffix;
      return num;
    } else {
      // Return the original string if it does not contain numbers
      return str;
    }
  }

  return (
    <TableContainer
      bg="#101216"
      border="1px"
      borderColor="#2B2F35"
      color="white"
      borderRadius="md"
      w={width}
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      // bgColor={"yellow"}
      height={"100%"}
      padding={"8px 8px"}
      overflowX="hidden"
    >
      <Table
        variant="unstyled"
        width="100%"
        // style={{ borderCollapse: "separate", borderSpacing: "0 10px" }}
      >
        <Thead width={"100%"} height={"5rem"}>
          <Tr width={"100%"} height="2rem">
            {columnItems.map((val, idx1) =>
              val.map((val, idx2) => (
                <Td
                  key={idx1}
                  width={`${gap}%`}
                  // maxWidth={`${gap[idx1][idx2]}%`}
                  fontSize={"12px"}
                  fontWeight={400}
                >
                  <Text
                    whiteSpace="pre-wrap"
                    overflowWrap="break-word"
                    // bgColor={"red"}
                    width={"100%"}
                    height={"2rem"}
                    textAlign="center"
                    color={"#BDBFC1"}
                  >
                    {val}
                  </Text>
                </Td>
              ))
            )}
          </Tr>
        </Thead>
        <Tbody position="relative" overflow="hidden">
          <Tr
            width={"100%"}
            height="1rem"
            borderBottom="0px solid #2b2f35"
            position="relative"
          >
            {rowItems.map((val: any, idx1: number) =>
              val.map((val: any, idx2: number) => (
                <Td
                  key={idx1}
                  // width={`${gap[idx1][idx2]}%`}
                  maxWidth={"3rem"}
                  fontSize={"14px"}
                  fontWeight={400}
                  // border="0.5px solid blue"
                  overflow={"hidden"}
                  // display={"flex"}
                  // flexDirection={"row"}
                  textAlign={"center"}
                  // bgColor={"red"}
                  // flexGrow={1}
                >
                  <Text
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    // bgColor={"blue"}
                  >
                    {/* {checkGap(idx1, idx2)} */}
                    {numberFormat(val)}
                  </Text>
                </Td>
              ))
            )}
          </Tr>
          <hr
            style={{
              position: "absolute",
              height: "1px",
              borderWidth: "0",
              backgroundColor: "#2b2f35",
              width: "96%",
              left: "2%",
            }}
          />
          <Tr
            width={"100%"}
            height="1rem"
            borderBottom="0px solid #2b2f35"
            position="relative"
          >
            {rowItems.map((val: any, idx1: number) =>
              val.map((val: any, idx2: number) => (
                <Td
                  key={idx1}
                  maxWidth={"3rem"}
                  fontSize={"14px"}
                  fontWeight={400}
                  overflow={"hidden"}
                  textAlign={"center"}
                >
                  <Text
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="400"
                    // bgColor={"blue"}
                  >
                    {/* {checkGap(idx1, idx2)} */}
                    {val}
                  </Text>
                </Td>
              ))
            )}
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default Dashboard;
