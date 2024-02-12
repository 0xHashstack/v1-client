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
import Image from "next/image";
import { useEffect, useState } from "react";

import CircularDropDown from "@/assets/icons/circularDropDown";
import CircularDropDownActive from "@/assets/icons/circularDropDownActive";
import CircularDropDownClose from "@/assets/icons/circularDropDownClose";
import ExternalLink from "@/assets/icons/externalLink";
import numberFormatter from "@/utils/functions/numberFormatter";

const snapshotsDates = [
  "30 Nov 23",
  "2 Nov 23",
  "4 Dec 23",
  "6 Dec 23",
  "8 Dec 23",
  "10 Dec 23",
  "14 Dec 23",
  "16 Dec 23",
  "18 Dec 23",
  "20 Dec 23",
  "22 Dec 23",
  "24 Dec 23",
  "28 Dec 23",
  "30 Dec 23",
  "1 Jan 24",
  "3 Jan 24",
  "5 Jan 24",
  "7 Jan 24",
  "11 Jan 24",
  "13 Jan 24",
  "15 Jan 24",
  "17 Jan 24",
  "19 Jan 24",
  "21 jan 24",
];
const tooltips = ["", "", "Allocated $HASH"];

interface UserCampaignDataProps {
  leaderBoardData: any;
  columnItems: any;
  epochsData: any;
  snapshotsData: any;
  campaignDetails: any;
}

const UserCampaignData: React.FC<UserCampaignDataProps> = ({
  leaderBoardData,
  columnItems,
  epochsData,
  snapshotsData,
  campaignDetails,
}) => {
  const [epochDropdownSelected, setepochDropdownSelected] = useState(false);
  const [groupedSnapshots, setGroupedSnapshots] = useState([[], [], [], []]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openEpochs, setOpenEpochs] = useState<any>([]);

  // Function to toggle the open state of an epoch
  const toggleEpochSelection = (idxEpoch: any) => {
    setOpenEpochs((prevOpenEpochs: any[]) => {
      if (prevOpenEpochs.includes(idxEpoch)) {
        // Remove the index if it's already open
        return prevOpenEpochs.filter((index: any) => index !== idxEpoch);
      } else {
        // Add the index if it's not open
        return [...prevOpenEpochs, idxEpoch];
      }
    });
  };
  const [hoverEpochDrop, sethoverEpochDrop] = useState(false);

  // Function to check whether an epoch is open
  const isEpochOpen = (idxEpoch: any) => {
    return openEpochs.includes(idxEpoch);
  };

  useEffect(() => {
    const groupSize = 6;

    // Calculate the number of groups needed
    const numGroups = Math.ceil(snapshotsData.length / groupSize);

    // Initialize groupedSnapshots array
    const newGroupedSnapshots = Array.from(
      { length: numGroups },
      (_, groupIndex) =>
        snapshotsData
          .slice(groupIndex * groupSize, (groupIndex + 1) * groupSize)
          .sort((a: any, b: any) => a.snapshot_number - b.snapshot_number)
    );

    setGroupedSnapshots(newGroupedSnapshots);
  }, [snapshotsData]);

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
      height={"36rem"}
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
                cursor="pointer"
              >
                <Text
                  whiteSpace="pre-wrap"
                  overflowWrap="break-word"
                  width={"100%"}
                  height={"2rem"}
                  fontSize="12px"
                  textAlign={
                    idx1 == columnItems?.length - 1
                      ? "right"
                      : idx1 == 0
                      ? "left"
                      : "center"
                  }
                  pl={idx1 == 0 ? 2 : 0}
                  pr={idx1 == columnItems.length - 1 ? 10 : 0}
                  color={"#BDBFC1"}
                  cursor="context-menu"
                >
                  <Tooltip
                    hasArrow
                    label={tooltips[idx1]}
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
        <Tbody position="relative" alignContent={"center"}>
          {leaderBoardData.map((member: any, idx: any) => {
            return (
              <>
                <Tr
                  key={idx}
                  width={"100%"}
                  height="4rem"
                  bg={epochDropdownSelected ? "#676D9A48" : ""}
                  cursor="pointer"
                  onClick={() => {
                    setepochDropdownSelected(!epochDropdownSelected);
                  }}
                  p={0}
                  style={{ borderRadius: "6px" }}
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
                      fontWeight="400"
                      fontSize="14px"
                      ml="10"
                      color="#E6EDF3"
                    >
                      {campaignDetails[idx]?.campaignName}
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
                        label={""}
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
                        <Text>{campaignDetails[idx]?.timeline}</Text>
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
                        <Text>
                          {numberFormatter(member.est + member.hashAllocated)}
                        </Text>
                      </Tooltip>
                    </Text>
                  </Td>
                  <Td
                    width={"16.6%"}
                    fontSize={"14px"}
                    fontWeight={400}
                    padding={2}
                    textAlign="end"
                  >
                    <Box
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="end"
                      fontWeight="400"
                      fontSize="14px"
                      color="#E6EDF3"
                      pr="10"
                      gap="1rem"
                    >
                      <Text
                        textDecoration="underline"
                        cursor="pointer"
                        color="#3E415C"
                      >
                        Claim
                      </Text>
                      <Box
                        cursor="pointer"
                        onMouseEnter={() => {
                          sethoverEpochDrop(true);
                        }}
                        onMouseLeave={() => {
                          sethoverEpochDrop(false);
                        }}
                      >
                        {epochDropdownSelected ? (
                          <CircularDropDownClose />
                        ) : hoverEpochDrop ? (
                          <CircularDropDownActive />
                        ) : (
                          <CircularDropDown />
                        )}
                      </Box>
                    </Box>
                  </Td>
                </Tr>
                <Tr
                  key={idx}
                  width={"100%"}
                  height="4rem"
                  position="absolute"
                  cursor="pointer"
                  pl="1rem"
                >
                  {epochDropdownSelected && (
                    <Box
                      borderRadius="6px"
                      mt="1rem"
                      mr="2rem"
                      ml="2rem"
                      border={
                        openEpochs.length > 0 ? "" : "1px solid #676D9A48"
                      }
                      borderBottom={
                        openEpochs.length > 0 ? "1px solid #676D9A48" : ""
                      }
                    >
                      {epochsData.map((epochs: any, idxEpoch: any) => (
                        <Box key={idxEpoch}>
                          <Box
                            display="flex"
                            borderTop={
                              openEpochs.length > 0 ? "1px solid #676D9A48" : ""
                            }
                            borderLeft={
                              openEpochs.length > 0 ? "1px solid #676D9A48" : ""
                            }
                            borderBottom={
                              openEpochs.length > 0
                                ? isEpochOpen(idxEpoch)
                                  ? "1px solid #676D9A48"
                                  : ""
                                : ""
                            }
                            borderBottomRadius={
                              openEpochs.length > 0
                                ? isEpochOpen(idxEpoch)
                                  ? "6px"
                                  : ""
                                : "6px"
                            }
                            borderRight={
                              openEpochs.length > 0 ? "1px solid #676D9A48" : ""
                            }
                            borderRadius={
                              openEpochs.length > 0
                                ? isEpochOpen(idxEpoch)
                                  ? "6px"
                                  : ""
                                : "6px"
                            }
                            justifyContent="space-between"
                            cursor="pointer"
                            padding="24px 48px 24px 48px"
                            color="#F0F0F5"
                            fontSize="14px"
                            fontWeight="400"
                            lineHeight="20px"
                            onClick={() => {
                              // setsnapshotDropdownSelected(!snapshotDropdownSelected)
                              toggleEpochSelection(idxEpoch);
                            }}
                          >
                            <Text>Epoch {idxEpoch + 1}</Text>
                            <Text>
                              {idxEpoch == 0
                                ? "27 Nov 23 - 11 Dec 23"
                                : idxEpoch == 1
                                ? "12 Dec 23 - 25 Dec 23"
                                : idxEpoch == 2
                                ? "26 Dec 23 - 8 Jan 24"
                                : "9 Jan 24 - 22 Jan 24"}
                            </Text>
                            <Text>
                              {numberFormatter(epochs?.pointsAllocated)} points
                            </Text>
                            <Box display="flex" gap="1.5rem">
                              <Text>
                                {numberFormatter(epochs?.hashAllocated)} Hash
                                tokens earned
                              </Text>
                              {isEpochOpen(idxEpoch) ? (
                                <CircularDropDownClose />
                              ) : (
                                <CircularDropDownActive />
                              )}
                            </Box>
                          </Box>
                          <Box
                            borderBottom={
                              idxEpoch != 3
                                ? isEpochOpen(idxEpoch)
                                  ? ""
                                  : "1px solid #676D9A48"
                                : ""
                            }
                          ></Box>
                          {isEpochOpen(idxEpoch) && (
                            <Box>
                              {groupedSnapshots[idxEpoch]?.map(
                                (snapshot: any, idxSnap: any) => (
                                  <Box
                                    key={idxSnap}
                                    bg={
                                      idxSnap % 2 == 0
                                        ? "#676D9A16"
                                        : "#676D9A32"
                                    }
                                    mr="4rem"
                                    ml="4rem"
                                    borderRadius="6px"
                                  >
                                    <Box
                                      borderRadius="6px"
                                      mt="0.5"
                                      display="flex"
                                      justifyContent="space-between"
                                      cursor="pointer"
                                      ml="2rem"
                                      mr="2rem"
                                      padding="24px 24px 24px 24px"
                                      color="#F0F0F5"
                                      fontSize="14px"
                                      fontWeight="400"
                                      lineHeight="20px"
                                    >
                                      <Text>Snapshot {idxSnap + 1}</Text>
                                      <Text>
                                        {snapshotsDates[idxSnap + idxEpoch * 6]}
                                      </Text>
                                      <Text>
                                        $
                                        {numberFormatter(
                                          snapshot?.supplyValue +
                                            snapshot?.borrowValue +
                                            snapshot?.referralValue
                                        )}{" "}
                                        Liquidity generated
                                      </Text>
                                      <Text>
                                        {numberFormatter(snapshot?.totalPoints)}{" "}
                                        points
                                      </Text>
                                      <Box display="flex" gap="1.5rem">
                                        <Text>
                                          {numberFormatter(
                                            snapshot?.estimatedHashTokensUser
                                          )}{" "}
                                          Hash tokens earned
                                        </Text>
                                        <ExternalLink />
                                      </Box>
                                    </Box>
                                  </Box>
                                )
                              )}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Tr>
                {!epochDropdownSelected && (
                  <Tr
                    style={{
                      position: "absolute",
                      // left: "0%",
                      width: "100%",
                      height: "1px",
                      borderBottom: "1px solid rgba(103, 109, 154, 0.30)",
                      display: `${member.id == 5 ? "none" : "block"}`,
                    }}
                  />
                )}
                <Tr
                  key={idx}
                  width={"100%"}
                  height="4rem"
                  bg={"#676D9A48"}
                  position="relative"
                  top={
                    epochDropdownSelected
                      ? openEpochs.length == 0
                        ? "20rem"
                        : openEpochs.length == 1
                        ? "46rem"
                        : openEpochs.length == 2
                        ? "73rem"
                        : openEpochs.length == 3
                        ? "99rem"
                        : openEpochs.length == 4
                        ? "125rem"
                        : ""
                      : "0"
                  }
                  cursor="pointer"
                  p={0}
                  style={{ borderRadius: "6px" }}
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
                      fontWeight="400"
                      fontSize="14px"
                      ml="10"
                      color="#E6EDF3"
                    >
                      <Image
                        src="/latestSyncedBlockGreenDot.svg"
                        alt="Picture of the author"
                        width="8"
                        height="8"
                        style={{
                          marginRight: "0.5rem",
                          marginBottom: "0.1rem",
                        }}
                      />
                      {campaignDetails[idx + 1]?.campaignName}
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
                        label={""}
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
                        <Text>{campaignDetails[idx + 1]?.timeline}</Text>
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
                        <Text>
                          {numberFormatter(member.est + member.hashAllocated)}
                        </Text>
                      </Tooltip>
                    </Text>
                  </Td>
                  <Td
                    width={"16.6%"}
                    fontSize={"14px"}
                    fontWeight={400}
                    padding={2}
                    textAlign="end"
                  >
                    <Box
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="end"
                      fontWeight="400"
                      fontSize="14px"
                      color="#E6EDF3"
                      pr="10"
                      gap="1rem"
                    >
                      <Text
                        textDecoration="underline"
                        cursor="pointer"
                        color="#3E415C"
                      >
                        Claim
                      </Text>
                      <Box
                        cursor="pointer"
                        onMouseEnter={() => {
                          sethoverEpochDrop(true);
                        }}
                        onMouseLeave={() => {
                          sethoverEpochDrop(false);
                        }}
                      >
                        {epochDropdownSelected ? (
                          <CircularDropDownClose />
                        ) : hoverEpochDrop ? (
                          <CircularDropDownActive />
                        ) : (
                          <CircularDropDown />
                        )}
                      </Box>
                    </Box>
                  </Td>
                </Tr>
              </>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default UserCampaignData;
