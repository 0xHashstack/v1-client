import Image from "next/image";
import { Inter } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAccountAddress,
  setAccountAddress,
} from "@/store/slices/userAccountSlice";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const dispatch = useDispatch();
  const address = useSelector(selectAccountAddress);
  function handleAccount(e: any) {
    e.preventDefault();
    dispatch(setAccountAddress(e.target.user.value));
  }
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h1>Initial setup</h1>
    </main>
  );
}
