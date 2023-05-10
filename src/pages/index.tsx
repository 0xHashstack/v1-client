import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import Navbar from "@/components/layouts/navbar/Navbar";
import PageCard from "@/components/layouts/pageCard";
import WalletConnectModal from "@/components/modals/WalletConnectModal";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [render, setRender] = useState(true);
  const router = useRouter();
  const href = "/market";
  useEffect(() => {
    // setRender(true);
    router.push(href);
  }, [router]);
  return (
    <PageCard justifyContent="center" alignItems="center">
      <Text fontSize="46px" color="#FFFFFF">
        Welcome to Hashstack&apos;s mainnet!
      </Text>

      <WalletConnectModal />
    </PageCard>
  );
}