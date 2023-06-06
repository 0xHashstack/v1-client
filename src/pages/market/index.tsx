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
import { Box, Stack, VStack } from "@chakra-ui/react";
import NavButtons from "@/components/layouts/navButtons";
import MarketDashboard from "@/components/layouts/marketDashboard";
import { useEffect, useState } from "react";
import useBalanceOf from '../../Blockchain/hooks/Reads/useBalanceOf'
// import { dataInitializer } from "@/utils/functions/dataInitializer";
// import OffchainAPI from "@/services/offchainapi.service";
import Link from "next/link";
import LatestSyncedBlock from "@/components/uiElements/latestSyncedBlock";
import PageCard from "@/components/layouts/pageCard";
import { useRouter } from "next/router";
import { setSpendBorrowSelectedDapp } from "@/store/slices/userAccountSlice";
const inter = Inter({ subsets: ["latin"] });

export default function Market() {
  const dispatch = useDispatch();
  const router=useRouter();
  const reserves = useSelector(selectReserves);
  const oracleAndFairPrices = useSelector(selectOracleAndFairPrices);
  const offchainCurrentBlock = useSelector(selectOffchainCurrentBlock);
  const [parsedAccount, setParsedAccount] = useState<any>()



  const [render, setRender] = useState(true);
  // console.log(account.address)
  // const { dataBalanceOf, errorBalanceOf, isFetchingBalanceOf, refetchBalanceOf, statusBalanceOf }=useBalanceOf("0x00cf781b5ef7d4cf7620bee8ae9e8fbcf9c708663c8645d754fbb3263ce3f176");
  // console.log(JSON.stringify(dataBalanceOf) ,"data")
  // useEffect(()=>{
  //   const storedAccount = localStorage.getItem("account");
  //   if(!storedAccount){
  //     router.push('/')
  //   }
  // },[])
  // console.log("degug2", offchainCurrentBlock);
  return (
    <PageCard>
      <StatsBoard />
      <NavButtons width={95} marginBottom={"1.125rem"} />
      <MarketDashboard />
      {/* <SupplyModal /> */}
      <Box
        paddingY="1rem"
        // height="2rem"
        // bgColor={"blue"}
        width="95%"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <LatestSyncedBlock width="16rem" height="100%" block={83207} />
      </Box>
    </PageCard>
  );
}

// Code for fetching data

// useEffect(() => {
//   setRender(true);
//   const dispatch = useDispatch();
//   const getReserves = async () => {
//     try {
//       const res = await OffchainAPI.getReserves();
//       // console.log("degug1", res);
//       dispatch(setReserves(res?.reserves));
//     } catch (error) {
//       console.log("getReserves failed market page", error);
//     }
//   };
//   getReserves();
//   const getPrices = () => {
//     OffchainAPI.getOraclePrices()
//       .then((prices) => {
//         // console.log("prices", prices);
//         dispatch(setOracleAndFairPrices(prices));
//       })
//       .catch((error) => {
//         console.log("oraclePrices failed market page", error);
//       });
//   };
//   getPrices();
//   OffchainAPI.getDashboardStats()
//     .then(
//       (stats) => {
//         dispatch(setOffchainCurrentBlock(stats));
//       },
//       (err) => {
//         console.error(err);
//       }
//     )
//     .catch((error) => {
//       console.log("getDashboardStats failed market page", error);
//     });
// }, []);
