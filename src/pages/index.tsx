import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button, Card, Text, Box, Portal } from "@chakra-ui/react";
import Navbar from "@/components/layouts/navbar/Navbar";
import PageCard from "@/components/layouts/pageCard";
// import WalletConnectModal from "@/components/modals/WalletConnectModal";
import ArgentXLogo from "../assets/images/ArgentXlogo.svg";
import BTCLogo from "@/assets/icons/coins/btc";
import USDCLogo from "@/assets/icons/coins/usdc";
import BravosIcon from "@/assets/icons/wallets/bravos";
import USDTLogo from "@/assets/icons/coins/usdt";
import ETHLogo from "@/assets/icons/coins/eth";
import DAILogo from "@/assets/icons/coins/dai";
import DropdownUp from "@/assets/icons/dropdownUpIcon";
import StarknetLogo from "@/assets/icons/coins/starknet";
import BrowserWalletIcon from "@/assets/icons/wallets/browserwallet";
import EthWalletLogo from "@/assets/icons/coins/ethwallet";
import {
  useAccount,
  useBlockNumber,
  useConnectors,
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

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/v1")
  }, []);
}