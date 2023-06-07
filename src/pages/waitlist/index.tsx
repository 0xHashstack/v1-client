import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import Navbar from "@/components/layouts/navbar/Navbar";
import PageCard from "@/components/layouts/pageCard";
// import WalletConnectModal from "@/components/modals/WalletConnectModal";
import {
  useAccount,
  useConnectors,
  useStarknet,
  useBlock,
} from "@starknet-react/core";
import { useContract } from "@starknet-react/core";
import { useDispatch, useSelector } from "react-redux";
import { selectAccount, setAccount } from "@/store/slices/userAccountSlice";
import AnimatedButton from "@/components/uiElements/buttons/AnimationButton";
import SupplyEquivalentModal from "@/components/modals/SupplyEquivalentModal";
import TransferDepositModal from "@/components/modals/TransferDepositModal";
import ReferFreindsModal from "@/components/modals/ReferFreindsModal";
// import AnimatedButton from "@/components/uiElements/buttons/AnimationButton";

const inter = Inter({ subsets: ["latin"] });

export default function WaitList() {
  const account = useSelector(selectAccount);
  // console.log(account ,"waitlist")
  const { available, disconnect, connect, connectors, refresh } =
    useConnectors();

  const { account: _account } = useAccount();
  useEffect(() => {
    if (!_account) {
      const walletConnected = localStorage.getItem("lastUsedConnector");
      if (walletConnected == "braavos") {
        disconnect();
        connect(connectors[0]);
      } else if (walletConnected == "argentx") {
        disconnect();
        connect(connectors[0]);
      }
    }
  }, []);
  return (
    <PageCard justifyContent="center">
      <Text color="#D3AC41" fontSize="48px" fontWeight="600" fontStyle="normal">
        You&apos;re on the waitlist!
      </Text>
      <Text fontSize="24px" fontStyle="normal" fontWeight="500" color="#DDF4FF">
        Jump the queue to get instant access through one of the below methods
      </Text>
      <Box display="flex" gap="10px" flexDirection="column">
        <SupplyEquivalentModal
          buttonText="Supply $10 equivalent"
          height="40px"
          width="267px"
          background="#101216"
          color="#8B949E"
          display="flex"
          alignItems="center"
          gap="8px"
          borderRadius="6px"
          border="1px solid #8B949E"
          fontSize="14px"
          fontWeight="600"
          lineHeight="20px"
          mt="4rem"
          _hover={{ background: "white", color: "black" }}
        />
        <TransferDepositModal
          buttonText="Transfer Deposit"
          height="40px"
          width="267px"
          background="#101216"
          color="#8B949E"
          display="flex"
          alignItems="center"
          gap="8px"
          borderRadius="6px"
          border="1px solid #8B949E"
          fontSize="14px"
          fontWeight="600"
          lineHeight="20px"
          mt="1.5rem"
          _hover={{ background: "white", color: "black" }}
        />
        <ReferFreindsModal
          buttonText="Refer two friends"
          height="40px"
          width="267px"
          background="#101216"
          color="#8B949E"
          display="flex"
          alignItems="center"
          gap="8px"
          borderRadius="6px"
          border="1px solid #8B949E"
          fontSize="14px"
          fontWeight="600"
          lineHeight="20px"
          mt="1.5rem"
          _hover={{ background: "white", color: "black" }}
        />
      </Box>
    </PageCard>
  );
}
