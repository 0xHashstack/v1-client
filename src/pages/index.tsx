import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { Button, Card, Text, Box, Portal } from "@chakra-ui/react";
import Navbar from "@/components/layouts/navbar/Navbar";
import PageCard from "@/components/layouts/pageCard";
// import WalletConnectModal from "@/components/modals/WalletConnectModal";

import {
  useAccount,
  useBlockNumber,
  // useBalance,
} from "@starknet-react/core";
import { useDispatch, useSelector } from "react-redux";
import {
  selectWalletBalance,
  setAccount,
} from "@/store/slices/userAccountSlice";
import Banner from "@/components/uiElements/loaders/Banner";
import Banner2 from "@/components/uiElements/loaders/Banner2";
// import AnimatedButton from "@/components/uiElements/buttons/AnimationButton";
import mixpanel  from 'mixpanel-browser'
const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/v1")
  }, []);
}