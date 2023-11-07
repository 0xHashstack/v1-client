import React, { useState } from "react";
import InfoIcon from "@/assets/infoIcon";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Tooltip,
  Box,
  Text,
  TabList,
  Tab,
  TabPanel,
  Tabs,
  TabPanels,
  RadioGroup,
  Radio,
  NumberInput,
  Slider,
  SliderMark,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  NumberInputField,
  Stack,
  Card,
  ModalHeader,
  Skeleton,
  Input,
  HStack,
  VStack,
  Checkbox,
} from "@chakra-ui/react";
const DetailsForm = ({ handler }: any) => {
  const [wallet, setWallet] = useState("");
  const [discord, setdiscord] = useState("");
  const [Twitter, setTwitter] = useState("");
  const [Commit, setCommit] = useState();
  const [BookAmt, setBookAmt] = useState();
  const [checked, setChecked] = useState(false)
  const [FundName, setFundName] = useState()
  const [investorcommit, setInvestorcommit] = useState()
  const [DecisionTime, setDecisionTime] = useState()
  const [url, setUrl] = useState()


  const handleWalletChange = (e: any) => {
    setWallet(e.target.value);
  };
  const handleDiscordChange = (e: any) => {
    setdiscord(e.target.value);
  };
  const handleTwitterChange = (e: any) => {
    setTwitter(e.target.value);
  };
  const handleCommitChange = (e: any) => {
    setCommit(e.target.value);
  };
  const handleBookAmtCHnage = (e: any) => {
    setBookAmt(e.target.value);
  };
  const handleFundNameChange = (e: any) => {
    setFundName(e.target.value);
  };
  const handleInvestorCommitChange = (e: any) => {
    setInvestorcommit(e.target.value);
  };
  const handleDecisionTimeChange = (e: any) => {
    setDecisionTime(e.target.value);
  };
  const handleUrlChange = (e: any) => {
    setUrl(e.target.value);
  };



  return (
    <>
      <VStack
        w="80%"
        h="30%"
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box w="80%" display="flex" flexDirection="column" gap="1" mt="0">
          <Box display="flex">
            <Text fontSize="xs" color="#676D9A">
              Wallet Address
            </Text>
            <Tooltip
              color="#F0F0F5"
              hasArrow
              placement="right-start"
              boxShadow="dark-lg"
              label="Enter your wallet address"
              bg="#02010F"
              fontSize={"13px"}
              fontWeight={"400"}
              borderRadius={"lg"}
              padding={"2"}
              border="1px solid"
              borderColor="#23233D"
              arrowShadowColor="#2B2F35"
            // maxW="222px"
            >
              <Box p="1">
                <InfoIcon />
              </Box>
            </Tooltip>
          </Box>
          <Box
            width="100%"
            borderRadius="6px"
            display="flex"
            justifyContent="space-between"
            border="1px solid #676D9A"
            background=" var(--surface-of-10, rgba(103, 109, 154, 0.10))"
            color="rgba(240, 240, 245, 0.50)"
            fontFamily=" Inter"
            fontSize=" 14px"
            fontStyle=" normal"
            fontWeight=" 500"
            lineHeight=" 20px" /* 142.857% */
            letterSpacing=" -0.15px"
          >
            <Input
              border="0px"
              value={wallet}
              onChange={handleWalletChange}
              placeholder="rioguLSDnvSL:?DgjbsBHNB.XBMD>XBM;DLFBJ"
              _placeholder={{
                color: "rgba(240, 240, 245, 0.50)",
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: 'Inter'

              }}
            ></Input>
          </Box>
        </Box>

        <Box w="80%" display="flex" flexDirection="column" gap="1" mt="0">
          <Box display="flex">
            <Text fontSize="xs" color="#676D9A">
              Discord
            </Text>
            <Tooltip
              color="#F0F0F5"
              hasArrow
              placement="right-start"
              boxShadow="dark-lg"
              label="Enter your Discord Id"
              bg="#02010F"
              fontSize={"13px"}
              fontWeight={"400"}
              borderRadius={"lg"}
              padding={"2"}
              border="1px solid"
              borderColor="#23233D"
              arrowShadowColor="#2B2F35"
            // maxW="222px"
            >
              <Box p="1">
                <InfoIcon />
              </Box>
            </Tooltip>
          </Box>
          <Box
            width="100%"
            borderRadius="6px"
            display="flex"
            justifyContent="space-between"
            border="1px solid #676D9A"
            background=" var(--surface-of-10, rgba(103, 109, 154, 0.10))"
            color="rgba(240, 240, 245, 0.50)"
            fontFamily=" Inter"
            fontSize=" 14px"
            fontStyle=" normal"
            fontWeight=" 500"
            lineHeight=" 20px" /* 142.857% */
            letterSpacing=" -0.15px"
          >
            <Input
              border="0px"
              value={discord}
              onChange={handleDiscordChange}
            ></Input>
          </Box>
        </Box>
        <Box w="80%" display="flex" flexDirection="column" gap="1" mt="0">
          <Box display="flex">
            <Text fontSize="xs" color="#676D9A">
              Twitter handle
            </Text>
            <Tooltip
              color="#F0F0F5"
              hasArrow
              placement="right-start"
              boxShadow="dark-lg"
              label="Enter your Twitter Id"
              bg="#02010F"
              fontSize={"13px"}
              fontWeight={"400"}
              borderRadius={"lg"}
              padding={"2"}
              border="1px solid"
              borderColor="#23233D"
              arrowShadowColor="#2B2F35"
            // maxW="222px"
            >
              <Box p="1">
                <InfoIcon />
              </Box>
            </Tooltip>
          </Box>
          <Box
            width="100%"
            borderRadius="6px"
            display="flex"
            justifyContent="space-between"
            border="1px solid #676D9A"
            background=" var(--surface-of-10, rgba(103, 109, 154, 0.10))"
            color="rgba(240, 240, 245, 0.50)"
            fontFamily=" Inter"
            fontSize=" 14px"
            fontStyle=" normal"
            fontWeight=" 500"
            lineHeight=" 20px" /* 142.857% */
            letterSpacing=" -0.15px"
          >
            <Input
              border="0px"
              value={Twitter}
              onChange={handleTwitterChange}
            ></Input>
          </Box>
        </Box>
        <Box w="80%" display="flex" flexDirection="column" gap="1" mt="0">
          <Box display="flex">
            <Text fontSize="xs" color="#676D9A">
              Commitment interest
            </Text>
            <Tooltip
              color="#F0F0F5"
              hasArrow
              placement="right-start"
              boxShadow="dark-lg"
              label="Enter your Commitment Interest"
              bg="#02010F"
              fontSize={"13px"}
              fontWeight={"400"}
              borderRadius={"lg"}
              padding={"2"}
              border="1px solid"
              borderColor="#23233D"
              arrowShadowColor="#2B2F35"
            // maxW="222px"
            >
              <Box p="1">
                <InfoIcon />
              </Box>
            </Tooltip>
          </Box>
          <Box
            width="100%"
            borderRadius="6px"
            display="flex"
            justifyContent="space-between"
            border="1px solid #676D9A"
            background=" var(--surface-of-10, rgba(103, 109, 154, 0.10))"
            color="rgba(240, 240, 245, 0.50)"
            fontFamily=" Inter"
            fontSize=" 14px"
            fontStyle=" normal"
            fontWeight=" 500"
            lineHeight=" 20px" /* 142.857% */
            letterSpacing=" -0.15px"
          >
            <Input
              placeholder="minimum $500 & maximum $2500"
              _placeholder={{
                color: "rgba(240, 240, 245, 0.50)",
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: 'Inter'

              }}
              type="number"
              border="0px"
              value={Commit}
              onChange={handleCommitChange}
            ></Input>
          </Box>
        </Box>

        <Box w="80%" display="flex" flexDirection="column" gap="1" mt="0">
          <Box display="flex">
            <Text fontSize="xs" color="#676D9A">
              Booking Amount
            </Text>
            <Tooltip
              color="#F0F0F5"
              hasArrow
              placement="right-start"
              boxShadow="dark-lg"
              label="Enter your Booking amount"
              bg="#02010F"
              fontSize={"13px"}
              fontWeight={"400"}
              borderRadius={"lg"}
              padding={"2"}
              border="1px solid"
              borderColor="#23233D"
              arrowShadowColor="#2B2F35"
            // maxW="222px"
            >
              <Box p="1">
                <InfoIcon />
              </Box>
            </Tooltip>
          </Box>
          <Box
            width="100%"
            borderRadius="6px"
            display="flex"
            justifyContent="space-between"
            border="1px solid #676D9A"
            background=" var(--surface-of-10, rgba(103, 109, 154, 0.10))"
            color="rgba(240, 240, 245, 0.50)"
            fontFamily=" Inter"
            fontSize=" 14px"
            fontStyle=" normal"
            fontWeight=" 500"
            lineHeight=" 20px" /* 142.857% */
            letterSpacing=" -0.15px"
          >
            <Input
              type="number"
              border="0px"
              value={BookAmt}
              onChange={handleBookAmtCHnage}
              placeholder="$50"
              _placeholder={{
                color: "rgba(240, 240, 245, 0.50)",
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: 'Inter'

              }}
            ></Input>
          </Box>
        </Box>

        <Checkbox
          isChecked={checked}
          color=" var(--neutral-light, #B1B0B5)"
          font-family=" Inter"
          mt={"3rem"}
          mb={"2rem"}

          fontSize=" 16px"
          fontStyle=" normal"
          fontWeight=" 400"
          lineHeight=" 26px" /* 162.5% */
          letterSpacing=" -0.15px"
          onChange={(e) => setChecked(e.target.checked)}
        >
          I have access to an investor network interested in making an investment.
        </Checkbox>
        {checked &&
        <Box
        w="100%" display="flex" flexDirection="column" gap="1"
        >
                  <Box w="80%" display="flex" flexDirection="column" gap="1" mt="0">
          <Box display="flex">
            <Text fontSize="xs" color="#676D9A">
              Fund Name
            </Text>
            <Tooltip
              color="#F0F0F5"
              hasArrow
              placement="right-start"
              boxShadow="dark-lg"
              label="Enter your Booking amount"
              bg="#02010F"
              fontSize={"13px"}
              fontWeight={"400"}
              borderRadius={"lg"}
              padding={"2"}
              border="1px solid"
              borderColor="#23233D"
              arrowShadowColor="#2B2F35"
            // maxW="222px"
            >
              <Box p="1">
                <InfoIcon />
              </Box>
            </Tooltip>
          </Box>
          <Box
            width="100%"
            borderRadius="6px"
            display="flex"
            justifyContent="space-between"
            border="1px solid #676D9A"
            background=" var(--surface-of-10, rgba(103, 109, 154, 0.10))"
            color="rgba(240, 240, 245, 0.50)"
            fontFamily=" Inter"
            fontSize=" 14px"
            fontStyle=" normal"
            fontWeight=" 500"
            lineHeight=" 20px" /* 142.857% */
            letterSpacing=" -0.15px"
          >
            <Input
              type="texth"
              border="0px"
              value={FundName}
              onChange={handleFundNameChange}
              placeholder="rioguLSDnvSL:?DgjbsBHNB.XBMD>XBM;DLFBJ"
              _placeholder={{
                color: "rgba(240, 240, 245, 0.50)",
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: 'Inter'

              }}
            ></Input>
          </Box>
        </Box>
        <Box w="80%" display="flex" flexDirection="column" gap="1" mt="0">
          <Box display="flex">
            <Text fontSize="xs" color="#676D9A">
              Commitment Intrest
            </Text>
            <Tooltip
              color="#F0F0F5"
              hasArrow
              placement="right-start"
              boxShadow="dark-lg"
              label="Enter your Booking amount"
              bg="#02010F"
              fontSize={"13px"}
              fontWeight={"400"}
              borderRadius={"lg"}
              padding={"2"}
              border="1px solid"
              borderColor="#23233D"
              arrowShadowColor="#2B2F35"
            // maxW="222px"
            >
              <Box p="1">
                <InfoIcon />
              </Box>
            </Tooltip>
          </Box>
          <Box
            width="100%"
            borderRadius="6px"
            display="flex"
            justifyContent="space-between"
            border="1px solid #676D9A"
            background=" var(--surface-of-10, rgba(103, 109, 154, 0.10))"
            color="rgba(240, 240, 245, 0.50)"
            fontFamily=" Inter"
            fontSize=" 14px"
            fontStyle=" normal"
            fontWeight=" 500"
            lineHeight=" 20px" /* 142.857% */
            letterSpacing=" -0.15px"
          >
            <Input
              type="number"
              border="0px"
              value={investorcommit}
              onChange={handleInvestorCommitChange}
              placeholder="$50"
              _placeholder={{
                color: "rgba(240, 240, 245, 0.50)",
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: 'Inter'

              }}
            ></Input>
          </Box>
        </Box>
        <Box w="80%" display="flex" flexDirection="column" gap="1" mt="0">
          <Box display="flex">
            <Text fontSize="xs" color="#676D9A">
              Time to Decision
            </Text>
            <Tooltip
              color="#F0F0F5"
              hasArrow
              placement="right-start"
              boxShadow="dark-lg"
              label="Enter your Booking amount"
              bg="#02010F"
              fontSize={"13px"}
              fontWeight={"400"}
              borderRadius={"lg"}
              padding={"2"}
              border="1px solid"
              borderColor="#23233D"
              arrowShadowColor="#2B2F35"
            // maxW="222px"
            >
              <Box p="1">
                <InfoIcon />
              </Box>
            </Tooltip>
          </Box>
          <Box
            width="100%"
            borderRadius="6px"
            display="flex"
            justifyContent="space-between"
            border="1px solid #676D9A"
            background=" var(--surface-of-10, rgba(103, 109, 154, 0.10))"
            color="rgba(240, 240, 245, 0.50)"
            fontFamily=" Inter"
            fontSize=" 14px"
            fontStyle=" normal"
            fontWeight=" 500"
            lineHeight=" 20px" /* 142.857% */
            letterSpacing=" -0.15px"
          >
            <Input
              type="number"
              border="0px"
              value={DecisionTime}
              onChange={handleDecisionTimeChange}
              placeholder="$50"
              _placeholder={{
                color: "rgba(240, 240, 245, 0.50)",
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: 'Inter'

              }}
            ></Input>
          </Box>
        </Box>
        <Box w="80%" display="flex" flexDirection="column" gap="1" mt="0">
          <Box display="flex">
            <Text fontSize="xs" color="#676D9A">
              URL
            </Text>
            <Tooltip
              color="#F0F0F5"
              hasArrow
              placement="right-start"
              boxShadow="dark-lg"
              label="Enter your Booking amount"
              bg="#02010F"
              fontSize={"13px"}
              fontWeight={"400"}
              borderRadius={"lg"}
              padding={"2"}
              border="1px solid"
              borderColor="#23233D"
              arrowShadowColor="#2B2F35"
            // maxW="222px"
            >
              <Box p="1">
                <InfoIcon />
              </Box>
            </Tooltip>
          </Box>
          <Box
            width="100%"
            borderRadius="6px"
            display="flex"
            justifyContent="space-between"
            border="1px solid #676D9A"
            background=" var(--surface-of-10, rgba(103, 109, 154, 0.10))"
            color="rgba(240, 240, 245, 0.50)"
            fontFamily=" Inter"
            fontSize=" 14px"
            fontStyle=" normal"
            fontWeight=" 500"
            lineHeight=" 20px" /* 142.857% */
            letterSpacing=" -0.15px"
          >
            <Input
              type="text"
              border="0px"
              value={url}
              onChange={handleUrlChange}
              placeholder="$50"
              _placeholder={{
                color: "rgba(240, 240, 245, 0.50)",
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: 'Inter'

              }}
            ></Input>
          </Box>
        </Box>
        </Box>
        }
        <Button display=" flex"
        mt="2rem"
          width="80%"
          height=" 40px"
          flexDirection="column"
          justifyContent=" center"
          alignItems=" center"
          gap=" 8px"
          borderRadius=" 6px"
          border=" 1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
          background=" #0969DA"
          color='white'
          boxShadow=" 0px 1px 0px 0px rgba(27, 31, 35, 0.04)"
        >Submit</Button>

      </VStack>
      <HStack
        w="80%"
        h="80%"
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Box
          //   width="962px"
          width={"100%"}
          height={"800px"}

          borderRadius={"8px"}
          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30));"
          background=" var(--surface-of-10, rgba(103, 109, 154, 0.10));"
        ></Box>
      </HStack>
    </>
  );
};
export default DetailsForm;
