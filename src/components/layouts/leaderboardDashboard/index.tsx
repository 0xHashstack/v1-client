import {
  Box,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import Link from "next/link";
import React, { useState } from "react";

import numberFormatter from "@/utils/functions/numberFormatter";

const tooltips = [
  "",
  "",
  "Liquidity (Supply/Borrow,Referrals)",
  "Points earned for rewards",
  "Allocated $HASH",
];

interface LeaderboardDashboardProps {
  leaderBoardData: any;
  personalData: any;
  columnItems: any;
  currentSelectedDrop: string;
  airdropCampaignUserRank: any;
  userHashCCP:any;
  userPointsCCP:any;
}

const LeaderboardDashboard: React.FC<LeaderboardDashboardProps> = ({
  leaderBoardData,
  personalData,
  columnItems,
  currentSelectedDrop,
  airdropCampaignUserRank,
  userHashCCP,
  userPointsCCP,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { address } = useAccount();

  return loading ? (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="95%"
      height={"37rem"}
      bgColor="#101216"
      borderRadius="8px"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="#010409"
        size="xl"
      />
    </Box>
  ) : (
    <TableContainer
      color="white"
      borderRadius="md"
      w="100%"
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      height={"34rem"}
      padding={"1rem 2rem 0rem"}
      overflowY="scroll"
    >
      <Table variant="unstyled" width="100%">
        <Thead width={"100%"} height={"5rem"}>
          <Tr width={"100%"} height="2rem">
            {columnItems.map((val: any, idx1: any) => (
              <Td
                key={idx1}
                width={"16.6%"}
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
                      : idx1 == columnItems?.length - 1
                        ? "right"
                        : "center"
                  }
                  pl={idx1 == 0 ? 2 : 0}
                  pr={idx1 == columnItems.length - 1 ? 10 : 0}
                  color={"#BDBFC1"}
                  cursor="context-menu"
                >
                  <Tooltip
                    hasArrow
                    label={
                      currentSelectedDrop === "Airdrop 1"
                        ? tooltips[idx1]
                        : tooltips.filter((item) => item !== tooltips[2])[idx1]
                    }
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
                  >
                    {val}
                  </Tooltip>
                </Text>
              </Td>
            ))}
          </Tr>
        </Thead>

        <Tbody position="relative" overflowX="hidden" alignContent={"center"}>
          {personalData.map((member: any, idx: any) => {
            return (
              <>
                <Tr
                  key={idx}
                  width={"100%"}
                  height="4rem"
                  position="relative"
                  p={0}
                  background="#676D9A48"
                >
                  <Td
                    width={"16.6%"}
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
                    >
                      {currentSelectedDrop === "Airdrop 1" ?airdropCampaignUserRank:"-"}
                    </Text>
                  </Td>

                  <Td
                    width={"16.6%"}
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
                    >
                      {address?.substring(0, 5)}...
                      {address?.substring(address?.length - 5, address?.length)}
                    </Text>
                  </Td>

                  <Td
                    width={"16.6%"}
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
                    >
                      <Tooltip
                        hasArrow
                        label={
                          <Box>
                            {currentSelectedDrop === "Airdrop 1" ? (
                              <>
                                Supply/Borrow: $
                                {numberFormatter(
                                  member.supplyliq + member.borrowliq
                                )}
                                <br />
                                Referrals: $
                                {numberFormatter(member.referredliq)}
                              </>
                            ) : (
                              <>
                                Points Allocated:{" "}
                                {numberFormatter(userPointsCCP)}
                                <br />
                                Points Estimated: {numberFormatter(member.pts)}
                              </>
                            )}
                          </Box>
                        }
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
                      >
                        <Text>
                          {currentSelectedDrop === "Airdrop 1"
                            ? numberFormatter(
                              Number(member.liq) + Number(member.referredliq)
                            )
                            : numberFormatter(userPointsCCP)}
                        </Text>
                      </Tooltip>
                    </Text>
                  </Td>

                  <Td
                    width={"16.6%"}
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
                    >
                      <Tooltip
                        hasArrow
                        label={
                          currentSelectedDrop === "Airdrop 1" ? (
                            <Box>
                              Points Allocated:{" "}
                              {numberFormatter(member.ptsAllocated)}
                              <br />
                              Points Estimated: {numberFormatter(member.pts)}
                            </Box>
                          ) : (
                            <Box>
                              HASH Allocated:{" "}
                              {member.hashAllocated
                                ? numberFormatter(userHashCCP)
                                : 0}
                              <br />
                              HASH Estimated:{" "}
                              {member.estimatedHash
                                ? numberFormatter(member?.estimatedHash)
                                : 0}
                            </Box>
                          )
                        }
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
                      >
                        <Text>
                          {currentSelectedDrop === "Airdrop 1"
                            ? numberFormatter(member.pts + member.ptsAllocated)
                            : numberFormatter(userHashCCP)}
                        </Text>
                      </Tooltip>
                    </Text>
                  </Td>

                  {currentSelectedDrop === "Airdrop 1" ? (
                    <Td
                      width={"16.6%"}
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
                      >
                        <Tooltip
                          hasArrow
                          label={
                            <Box>
                              HASH Allocated:{" "}
                              {member.hashAllocated
                                ? numberFormatter(member?.hashAllocated)
                                : 0}
                              <br />
                              HASH Estimated:{" "}
                              {member.est ? numberFormatter(member?.est) : 0}
                            </Box>
                          }
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
                        >
                          {numberFormatter(member.est + member.hashAllocated)}
                        </Tooltip>
                      </Text>
                    </Td>
                  ) : (
                    <Td
                      width={"16.6%"}
                      fontSize={"14px"}
                      fontWeight={400}
                      padding={2}
                      textAlign="end"
                    >
                      <Link
                        href={`/v1/airdrop_leaderboard/submissions/${address}`}
                        target="_blank"
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
                          textDecoration="underline"
                          cursor="pointer"
                        >
                          Submission
                        </Text>
                      </Link>
                    </Td>
                  )}
                </Tr>

                <Tr
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "1px",
                    borderBottom: "1px solid #2b2f35",
                    display: `${member.id == 5 ? "none" : "block"}`,
                  }}
                />
              </>
            );
          })
          }
          {leaderBoardData.map((member: any, idx: any) => {
            return (
              <>
                <Tr
                  key={idx}
                  width={"100%"}
                  height="4rem"
                  position="relative"
                  p={0}
                >
                  <Td
                    width={"16.6%"}
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
                    >
                      {idx + 1}
                    </Text>
                  </Td>

                  <Td
                    width={"16.6%"}
                    fontSize={"14px"}
                    fontWeight={400}
                    padding={2}
                    textAlign="center"
                  >
                    {currentSelectedDrop == "Airdrop 1" ?
                      <Text
                        width="100%"
                        height="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="400"
                        fontSize="14px"
                        color="#E6EDF3"
                      >
                        {member.walletAddress.substring(0, 5)}...
                        {member.walletAddress.substring(
                          member.walletAddress.length - 5,
                          member.walletAddress.length
                        )}
                      </Text> : <Text
                        width="100%"
                        height="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="400"
                        fontSize="14px"
                        color="#E6EDF3"
                      >
                        {member["Wallet Address (StarkNet)"].substring(0, 5)}...
                        {member["Wallet Address (StarkNet)"].substring(
                          member["Wallet Address (StarkNet)"].length - 5, member["Wallet Address (StarkNet)"].length)}
                      </Text>
                    }
                  </Td>

                  <Td
                    width={"16.6%"}
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
                    >
                      <Tooltip
                        hasArrow
                        label={
                          <Box>
                            {currentSelectedDrop === "Airdrop 1" ? (
                              <>
                                Supply/Borrow: $
                                {numberFormatter(member.selfValue)}
                                <br />
                                Referrals: $
                                {numberFormatter(member.referralValue)}
                                <br />
                              </>
                            ) : (
                              <>
                                Points Allocated:{" "}
                                {numberFormatter(member["Recommended (Community Team)"])
                                  ? numberFormatter(member["Recommended (Community Team)"])
                                  : 0}
                              </>
                            )}
                          </Box>
                        }
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
                      >
                        <Text>
                          {currentSelectedDrop=="Airdrop 1" ?numberFormatter(
                            Number(member.selfValue) +
                            Number(member.referralValue)
                          ):numberFormatter(member["Recommended (Community Team)"])}
                        </Text>
                      </Tooltip>
                    </Text>
                  </Td>

                  <Td
                    width={"16.6%"}
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
                    >
                      <Tooltip
                        hasArrow
                        label={
                          currentSelectedDrop === "Airdrop 1" ? (
                            <Box>
                              Points Allocated:{" "}
                              {member.pointsAllocated
                                ? numberFormatter(member?.pointsAllocated)
                                : 0}
                              <br />
                              Points Estimated:{" "}
                              {member.pointsEstimated
                                ? numberFormatter(member?.pointsEstimated)
                                : 0}
                            </Box>
                          ) : (
                            <Box>
                              HASH Allocated:{" "}
                              {member["Hash Allocated"]
                                ? numberFormatter(member["Hash Allocated"])
                                : 0}
                              <br />
                              HASH Estimated:{" "}
                              {member.estimatedHash
                                ? numberFormatter(member?.estimatedHash)
                                : 0}
                            </Box>
                          )
                        }
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
                      >
                        <Text>
                          {currentSelectedDrop === "Airdrop 1"
                            ? numberFormatter(member.netPoints)
                            : numberFormatter(member["Hash Allocated"]
                            )}
                        </Text>
                      </Tooltip>
                    </Text>
                  </Td>

                  {currentSelectedDrop === "Airdrop 1" ? (
                    <Td
                      width={"16.6%"}
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
                      >
                        <Tooltip
                          hasArrow
                          label={
                            <Box>
                              HASH Allocated:{" "}
                              {member.hashAllocated
                                ? numberFormatter(member?.hashAllocated)
                                : 0}
                              <br />
                              HASH Estimated:{" "}
                              {member.estimatedHash
                                ? numberFormatter(member?.estimatedHash)
                                : 0}
                            </Box>
                          }
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
                        >
                          {numberFormatter(
                            Number(member.estimatedHash) + member.hashAllocated
                          )}
                        </Tooltip>
                      </Text>
                    </Td>
                  ) : (
                    <Td
                      width={"16.6%"}
                      fontSize={"14px"}
                      fontWeight={400}
                      padding={2}
                      textAlign="end"
                    >
                      <Link
                        href={`/v1/airdrop_leaderboard/submissions/${member["Wallet Address (StarkNet)"]}`}
                        target="_blank"
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
                          textDecoration="underline"
                          cursor="pointer"
                        >
                          Submission
                        </Text>
                      </Link>
                    </Td>
                  )}
                </Tr>

                <Tr
                  style={{
                    position: "absolute",
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
  );
};

export default LeaderboardDashboard;
