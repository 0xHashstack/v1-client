import { Inter } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAccountAddress,
  setAccountAddress,
} from "@/store/slices/userAccountSlice";
import SupplyModal from "@/components/modals/SupplyModal";
import Navbar from "@/components/layouts/navbar/Navbar";
import StatsBoard from "@/pages/statsBoard";
import { Box, Stack } from "@chakra-ui/react";
import TransactionCancelModal from "@/components/modals/TransactionCancelModal";
import BorrowModal from "@/components/modals/borrowModal";
import Stats from "@/components/layouts/stats";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const dispatch = useDispatch();
  const address = useSelector(selectAccountAddress);
  function handleAccount(e: any) {
    e.preventDefault();
    dispatch(setAccountAddress(e.target.user.value));
  }
  return (
    <main className={`${inter.className}`}>
      <Navbar />
      <Stack
        alignItems="center"
        minHeight={"100vh"}
        pt="7rem"
        backgroundColor="#010409"
      >
        <StatsBoard />
        <SupplyModal />
        <BorrowModal />
      </Stack>
    </main>
  );
}
