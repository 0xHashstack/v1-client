import { Inter } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAccount,
  selectAccountAddress,
  selectOffchainCurrentBlock,
  selectOracleAndFairPrices,
  selectReserves,
  setAccountAddress,
  setOffchainCurrentBlock,
  setOracleAndFairPrices,
  setReserves,
} from "@/store/slices/userAccountSlice";
import SupplyModal from "@/components/modals/SupplyModal";
import Navbar from "@/components/layouts/navbar/Navbar";
import StatsBoard from "@/components/layouts/statsBoard";
import { Stack, VStack } from "@chakra-ui/react";
import NavButtons from "@/components/layouts/navButtons";
import MarketDashboard from "@/components/layouts/marketDashboard";
import { useEffect, useState } from "react";
// import { dataInitializer } from "@/utils/functions/dataInitializer";
// import OffchainAPI from "@/services/offchainapi.service";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Market() {
  const dispatch = useDispatch();
  const reserves = useSelector(selectReserves);
  const oracleAndFairPrices = useSelector(selectOracleAndFairPrices);
  const offchainCurrentBlock = useSelector(selectOffchainCurrentBlock);
  const address = useSelector(selectAccountAddress);
  const account = useSelector(selectAccount);
  function handleAccount(e: any) {
    e.preventDefault();
    dispatch(setAccountAddress(e.target.user.value));
  }
  const [render, setRender] = useState(false);
  useEffect(() => {
    setRender(true);
    // const dispatch = useDispatch();
    // const getReserves = async () => {
    //   try {
    //     const res = await OffchainAPI.getReserves();
    //     // console.log("degug1", res);
    //     dispatch(setReserves(res?.reserves));
    //   } catch (error) {
    //     console.log("getReserves failed market page", error);
    //   }
    // };
    // getReserves();
    // const getPrices = () => {
    //   OffchainAPI.getOraclePrices()
    //     .then((prices) => {
    //       // console.log("prices", prices);
    //       dispatch(setOracleAndFairPrices(prices));
    //     })
    //     .catch((error) => {
    //       console.log("oraclePrices failed market page", error);
    //     });
    // };
    // getPrices();
    // OffchainAPI.getDashboardStats()
    //   .then(
    //     (stats) => {
    //       dispatch(setOffchainCurrentBlock(stats));
    //     },
    //     (err) => {
    //       console.error(err);
    //     }
    //   )
    //   .catch((error) => {
    //     console.log("getDashboardStats failed market page", error);
    //   });
  }, []);

  console.log("degug2", offchainCurrentBlock);
  return (
    <>
      {render && (
        <>
          <Navbar />
          <Stack
            alignItems="center"
            minHeight={"100vh"}
            pt="7rem"
            backgroundColor="#010409"
          >
            <StatsBoard />
            <NavButtons />
            <MarketDashboard />
            {/* <SupplyModal /> */}
          </Stack>
        </>
      )}
    </>
  );
}
