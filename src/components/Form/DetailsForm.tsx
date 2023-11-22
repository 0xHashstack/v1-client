import React, { useState } from "react";
import InfoIcon from "@/assets/infoIcon";
import {
  Button,
  Tooltip,
  Box,
  Text,
  Input,
  HStack,
  VStack,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import { useAccount, useContractWrite } from "wagmi";
import contr from '../../abi/PresaleFormABI.json'
import { mainnet, sepolia,goerli, polygon, optimism } from '@wagmi/core/chains'

const DetailsForm = ({ handler }: any) => {
  const { address, isConnecting, isDisconnected } = useAccount();

  const [wallet, setWallet] = useState(address?address:"");
  const [discord, setdiscord] = useState("");
  const [Twitter, setTwitter] = useState("");
  const [Commit, setCommit] = useState<number>(0);
  const [BookAmt, setBookAmt] = useState<number>(0);
  const [checked, setChecked] = useState<boolean>(false)
  const [FundName, setFundName] = useState()
  const [investorcommit, setInvestorcommit] = useState<number>(0)
  const [DecisionTime, setDecisionTime] = useState<number>(0)
  const [url, setUrl] = useState("")
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)


  const handleWalletChange = (e: any) => {
    // setWallet(e.target.value);
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
//   struct InvestorDetails {
//     String fund_name;
//     Number commitment_interest;
//     uint256 time_to_decision;
//     string website_url;
// }
  const { data, isLoading, isSuccess, write } =useContractWrite({
    address: '0x30ecb549849e722c5ef8e37890ce24b4f10dae2b',
    abi: contr.abi,
    functionName: 'preBokking',
    args: [BookAmt,'0xdAC17F958D2ee523a2206206994597C13D831ec7',discord,Twitter,Commit,false,      [
      "",
     0,
      0,
    ""
    ]],
    chainId:goerli.id
  })
  const handleSubmit=async()=>{
    try{
      // axios.post('/api/form/unchecked', { wallet:address,discord:discord,twitter:Twitter,commit:Commit,bookamt:BookAmt },)
      //   .then((response) => {
      //     console.log(response, "linked"); // Log the response from the backend.
      //   })
      //   .catch((error) => {
      //     console.error('Error:', error);
      //   });
      write()
      // if(write?.status=="success"){

      // }
    }catch(err){
      console.log(err);
    }
  }
  const handleInvestorSubmit=async()=>{
    try{
      axios.post('/api/form/checked', { wallet:address,discord:discord,twitter:Twitter,commit:Commit,bookamt:BookAmt,hasInvestor:checked,fundname:FundName,Fundcommit:investorcommit,decisiontime:DecisionTime,url:url },)
        .then((response) => {
          console.log(response, "linked"); // Log the response from the backend.
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }catch(err){
      console.log(err);
    }
  }


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
            <Text color=" var(--neutral, #676D9A)"
              font-family=" Inter"
              font-size=" 12px"
              font-style=" normal"
              font-weight=" 400"
              line-height=" 12px" /* 100% */
              letter-spacing=" -0.15px"  >
              Wallet Address
            </Text>
          </Box>
          <Box
          cursor={"pointer"}
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
             cursor={"pointer"}
              border="0px"
              value={wallet}
              isDisabled={true}
              _disabled={
                {
                  cursor:"pointer"
                }
              }
              // onChange={handleWalletChange}
              placeholder="rioguLSDnvSL:?DgjbsBHNB.XBMD>XBM;DLFBJ"
              _placeholder={{
                color: "rgba(240, 240, 245, 0.50)",
                fontFamily: "Inter",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "20px",
                letterSpacing: "-0.15px"

              }}
            ></Input>
          </Box>
        </Box>

        <Box w="80%" display="flex" flexDirection="column" gap="1" mt="0">
          <Box display="flex">
            <Text color=" var(--neutral, #676D9A)"
              font-family=" Inter"
              font-size=" 12px"
              font-style=" normal"
              font-weight=" 400"
              line-height=" 12px" /* 100% */
              letter-spacing=" -0.15px"  >
              Discord
            </Text>
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
            color="white"
              border="0px"
              placeholder="Aprillyto#7879"
              _placeholder={{
                color: "rgba(240, 240, 245, 0.50)",
                fontFamily: "Inter",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "20px",
                letterSpacing: "-0.15px"

              }}
              value={discord}
              onChange={handleDiscordChange}
            ></Input>
          </Box>
        </Box>
        <Box w="80%" display="flex" flexDirection="column" gap="1" mt="0">
          <Box display="flex">
            <Text color=" var(--neutral, #676D9A)"
              font-family=" Inter"
              font-size=" 12px"
              font-style=" normal"
              font-weight=" 400"
              line-height=" 12px" /* 100% */
              letter-spacing=" -0.15px"  >
              Twitter handle
            </Text>
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
            <Text color=" var(--neutral, #676D9A)"
              font-family=" Inter"
              font-size=" 12px"
              font-style=" normal"
              font-weight=" 400"
              line-height=" 12px" /* 100% */
              letter-spacing=" -0.15px"  >
              Commitment interest
            </Text>
            <Tooltip
              color="#F0F0F5"
              hasArrow
              placement="right-start"
              boxShadow="dark-lg"
              label="Amount of money that buyers are willing to pay in advance to secure their allocation of tokens during the pre-sale."
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
              <Box p="1" mt="0.5">
                <InfoIcon />
              </Box>
            </Tooltip>
          </Box>
          <Box
            width="100%"
            borderRadius="6px"
            display="flex"
            justifyContent="space-between"
            border={(Commit >0 ?(Commit<500 || Commit>2500):false) ?"1px solid #CF222E":"1px solid #676D9A"}
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
                fontFamily: "Inter",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "20px",
                letterSpacing: "-0.15px"

              }}
              _focus={{
                outline: "0",
                boxShadow: "none",
              }}
              border="0px"
              outline="none"
              type="number"
              value={Commit==0?"":Commit}
              onChange={handleCommitChange}
            ></Input>
          </Box>
        </Box>

        <Box w="80%" display="flex" flexDirection="column" gap="1" mt="0">
          <Box display="flex">
            <Text color=" var(--neutral, #676D9A)"
              font-family=" Inter"
              font-size=" 12px"
              font-style=" normal"
              font-weight=" 400"
              line-height=" 12px" /* 100% */
              letter-spacing=" -0.15px"  >
              Booking Amount
            </Text>
            <Tooltip
              color="#F0F0F5"
              hasArrow
              placement="right-start"
              boxShadow="dark-lg"
              label="The upfront payment required from potential buyers to secure their spot on the “interested buyers list” for the tokens."
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
              <Box p="1" mt="0.5">
                <InfoIcon />
              </Box>
            </Tooltip>
          </Box>
          <Box
            width="100%"
            borderRadius="6px"
            display="flex"
            justifyContent="space-between"
            border={(BookAmt >0 ?(BookAmt<50):false) ?"1px solid #CF222E":"1px solid #676D9A"}
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
              value={BookAmt==0 ?"":BookAmt}
              onChange={handleBookAmtCHnage}
              placeholder="$50"
              _placeholder={{
                color: "rgba(240, 240, 245, 0.50)",
                fontFamily: "Inter",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "20px",
                letterSpacing: "-0.15px"

              }}
              _focus={{
                outline: "0",
                boxShadow: "none",
              }}
            ></Input>
          </Box>
        </Box>

        <Checkbox
          isChecked={checked}
          color=" var(--neutral-light, #B1B0B5)"
          fontFamily=" Inter"
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
                <Text color=" var(--neutral, #676D9A)"
                  font-family=" Inter"
                  font-size=" 12px"
                  font-style=" normal"
                  font-weight=" 400"
                  line-height=" 12px" /* 100% */
                  letter-spacing=" -0.15px"  >
                  Fund Name
                </Text>
                <Tooltip
                  color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="Name of the investment group."
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
                  <Box p="1" mt="0.5">
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
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "500",
                    lineHeight: "20px",
                    letterSpacing: "-0.15px"

                  }}
                ></Input>
              </Box>
            </Box>
            <Box w="80%" display="flex" flexDirection="column" gap="1" mt="0">
              <Box display="flex">
                <Text color=" var(--neutral, #676D9A)"
                  font-family=" Inter"
                  font-size=" 12px"
                  font-style=" normal"
                  font-weight=" 400"
                  line-height=" 12px" /* 100% */
                  letter-spacing=" -0.15px"  >
                  Commitment Intrest
                </Text>
                <Tooltip
                  color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="Amount of money that buyers are willing to pay in advance to secure their allocation of tokens during the pre-sale."
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
                  <Box p="1" mt="0.5">
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
                  value={investorcommit ==0 ?"":investorcommit}
                  onChange={handleInvestorCommitChange}
                  placeholder="$50"
                  _placeholder={{
                    color: "rgba(240, 240, 245, 0.50)",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "500",
                    lineHeight: "20px",
                    letterSpacing: "-0.15px"

                  }}
                ></Input>
              </Box>
            </Box>
            <Box w="80%" display="flex" flexDirection="column" gap="1" mt="0">
              <Box display="flex">
                <Text color=" var(--neutral, #676D9A)"
                  font-family=" Inter"
                  font-size=" 12px"
                  font-style=" normal"
                  font-weight=" 400"
                  line-height=" 12px" /* 100% */
                  letter-spacing=" -0.15px"  >
                  Time to Decision
                </Text>
                <Tooltip
                  color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="The time required for potential buyers to coordinate and purchase pre-sale tokens in bulk."
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
                  <Box p="1" mt="0.5">
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
                  value={DecisionTime==0? "":DecisionTime}
                  onChange={handleDecisionTimeChange}
                  placeholder="$50"
                  _placeholder={{
                    color: "rgba(240, 240, 245, 0.50)",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "500",
                    lineHeight: "20px", /* 142.857% */
                    letterSpacing: "-0.15px"

                  }}
                ></Input>
              </Box>
            </Box>
            <Box w="80%" display="flex" flexDirection="column" gap="1" mt="0">
              <Box display="flex">
                <Text color=" var(--neutral, #676D9A)"
                  font-family=" Inter"
                  font-size=" 12px"
                  font-style=" normal"
                  font-weight=" 400"
                  line-height=" 12px" /* 100% */
                  letter-spacing=" -0.15px"  >
                  Website
                </Text>
                <Tooltip
                  color="#F0F0F5"
                  hasArrow
                  placement="right-start"
                  boxShadow="dark-lg"
                  label="Website of the investment fund"
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
                  <Box p="1" mt="0.5">
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
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "500",
                    lineHeight: "20px",
                    letterSpacing: "-0.15px"

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
          onClick={()=>{
            if(checked){
              if(formSubmitted==false){
                handleInvestorSubmit();
              }
              setFormSubmitted(true)
            }else{
              if(formSubmitted==false){
                handleSubmit();
              }
              setFormSubmitted(true)
            }
          }}
          isDisabled={formSubmitted ?true: !checked ? !(discord!="" && Twitter!="" && ( Commit>=500 && Commit<=2500) && (BookAmt>50)):!(discord!="" && Twitter!="" && ( Commit>=500 && Commit<=2500) && (BookAmt>50) && FundName!="" && investorcommit>0 && DecisionTime>0 && url!=""  )}
        >Submit
        </Button>

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
          height={"880px"}
          borderRadius={"8px"}
          border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30));"
          background=" var(--surface-of-10, rgba(103, 109, 154, 0.10));"
          padding="33px 42px"
          font-size=" 18px"
          fontWeight="400"
          lineHeight="30px"
          letterSpacing="-0.15px"
        >
          <Text>
            Hash Tokens
          </Text>
          <Text mt="2rem">
          The HASH token is a key catalyst in the Hashstack ecosystem, and will serve 3 primary objectives. <br/>
          1. Store of authority(Governance): To enable decentralised governance. <br/>
          2. Store of value(Utility): For payment of in-dapp transaction fees, compensating partner projects, KOLs, and community participants who help secure/further the Hashstack ecosystem. <br/>
          3. Unlock liquidator role: Liquidators on Hashstack take the responsibility of repaying the bad debt to the Hashstack protocol, in-exchange for acquiring them at a discount. 
          </Text>
          <Text mt="3rem">
          HASH tokens total supply is hard capped to 9,000,000,000 (9 billion). For TGE, Hashstack has partnered with the Industry leading launchpad - Tokensoft that helped launch Ava (Avalanche token), GRAPH (The Graph token) among other notable projects. Leave a place holder to fit 4 bullet points (2 lines each) for Disclaimers
          </Text>
        </Box>
      </HStack>
    </>
  );
};
export default DetailsForm;
