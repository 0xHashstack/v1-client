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
// import useBalanceOf from "../../Blockchain/hooks/Reads/useBalanceOf";
import useBalanceOf from "@/Blockchain/hooks/Reads/useBalanceOf";
// import { dataInitializer } from "@/utils/functions/dataInitializer";
// import OffchainAPI from "@/services/offchainapi.service";
import Link from "next/link";
import LatestSyncedBlock from "@/components/uiElements/latestSyncedBlock";
import PageCard from "@/components/layouts/pageCard";
import { useRouter } from "next/router";
import { setSpendBorrowSelectedDapp } from "@/store/slices/userAccountSlice";
import { useAccount, useConnectors } from "@starknet-react/core";
import { getOraclePrices } from "@/Blockchain/scripts/getOraclePrices";
import { getUserLoans } from "@/Blockchain/scripts/Loans";
import {
  getProtocolReserves,
  getProtocolStats,
} from "@/Blockchain/scripts/protocolStats";
import SuccessToast from "@/components/uiElements/toasts/SuccessToast";
const inter = Inter({ subsets: ["latin"] });

export default function Market() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [prices, setPrices] = useState([]);
  const reserves = useSelector(selectReserves);
  const oracleAndFairPrices = useSelector(selectOracleAndFairPrices);
  const offchainCurrentBlock = useSelector(selectOffchainCurrentBlock);
  const [parsedAccount, setParsedAccount] = useState<any>();
  const { available, disconnect, connect, connectors, refresh } =
    useConnectors();
  const { address, account } = useAccount();
  const [render, setRender] = useState(true);
  // console.log(account.address)
  // const { dataBalanceOf, errorBalanceOf, isFetchingBalanceOf, refetchBalanceOf, statusBalanceOf }=useBalanceOf("0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7");
  // console.log(JSON.stringify(dataBalanceOf) ,"data")
  // useEffect(()=>{
  //   const storedAccount = localStorage.getItem("account");
  //   if(!storedAccount){
  //     router.push('/')
  //   }
  // },[])
  // // console.log("degug2", offchainCurrentBlock);
  // useEffect(() => {
  //   const loans = async () => {
  //     // const reserves = await getProtocolReserves();
  //     // const reserves = await getProtocolStats();
  //     // const reserves = await getProtocolStats();
  //     console.log("reserves - ", reserves);
  //   };
  //   if (account) {
  //     loans();
  //   }
  //   // setRender(true);
  // }, [account]);
  return (
    <PageCard>
      <StatsBoard />
      <NavButtons width={95} marginBottom={"1.125rem"} />
      <MarketDashboard />
      {/* <SupplyModal /> */}
      {/* <Box
        paddingY="1rem"
        // height="2rem"
        // bgColor={"blue"}
        width="95%"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <LatestSyncedBlock width="16rem" height="100%" block={83207} />
      </Box> */}
      <SuccessToast/>
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
