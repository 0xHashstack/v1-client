import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import Navbar from "@/components/layouts/navbar/Navbar";
import PageCard from "@/components/layouts/pageCard";
import WalletConnectModal from "@/components/modals/WalletConnectModal";
import {
  useAccount,
  useConnectors,
  useStarknet,
  useBlock,
} from "@starknet-react/core";
import { useContract } from "@starknet-react/core";
import { useDispatch } from "react-redux";
import { setAccount } from "@/store/slices/userAccountSlice";
// import AnimatedButton from "@/components/uiElements/buttons/AnimationButton";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { account, address, status } = useAccount();
  const { available, disconnect, connect, connectors } = useConnectors();
  const [render, setRender] = useState(true);
  const [isWhiteListed,setIsWhiteListed]=useState(false);
  const router = useRouter();
  const href = "/waitlist";
  const dispatch = useDispatch();
  useEffect(() => {
    // setRender(true);
  }, [router]);
  useEffect(() => {
    // alert(status)
    if (status == "connected") {
      // alert(account?.address);
      router.push(href);
      dispatch(setAccount(account));
    }
  }, [account, status,dispatch,router]);
  return (
    <PageCard justifyContent="center" alignItems="center">
        <Text fontSize="46px" color="#FFFFFF">
        Welcome to Hashstack&apos;s mainnet!
      </Text>

      <WalletConnectModal
        placeHolder={"Connect Wallet"}
        onClick={() => connect(connectors[0])}
      />
      </PageCard>

  );
}
