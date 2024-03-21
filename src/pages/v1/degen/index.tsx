import BorrowDashboard from "@/components/layouts/borrowDashboard";
import MarketDashboard from "@/components/layouts/marketDashboard";
import NavButtons from "@/components/layouts/navButtons";
import Navbar from "@/components/layouts/navbar/Navbar";
import { Stack } from "@chakra-ui/react";
import StatsBoard from "@/components/layouts/statsBoard";
import LatestSyncedBlock from "@/components/uiElements/latestSyncedBlock";
import Pagination from "@/components/uiElements/pagination";
import YourBorrowModal from "@/components/modals/yourBorrowModal";
import React, { useEffect, useState } from "react";
import { HStack, VStack, Text, Box } from "@chakra-ui/react";
import PageCard from "@/components/layouts/pageCard";
import { Coins } from "@/utils/constants/coin";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "@starknet-react/core";
import { selectYourBorrow, selectNetAPR, selectnetAprLoans, selectProtocolStats, selectYourSupply } from "@/store/slices/readDataSlice";
import { setUserLoans, selectUserLoans } from "@/store/slices/readDataSlice";
import { getUserLoans } from "@/Blockchain/scripts/Loans";
import { ILoan } from "@/Blockchain/interfaces/interfaces";
import { Skeleton } from "@chakra-ui/react";
import numberFormatter from "@/utils/functions/numberFormatter";
import useDataLoader from "@/hooks/useDataLoader";
import DegenDashboard from "@/components/layouts/degenDashboard";
const Degen = () => {
  const [currentPagination, setCurrentPagination] = useState<number>(1);
  const columnItems = [
    "Strategy name",
    "Type",
    "Target Protocol",
    "Collateral",
    "Max leverage",
    "Max APR",
    "",
  ];

  const dispatch = useDispatch();
  const { account, address } = useAccount();
  useDataLoader();

  const data=[
    {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDT",
    maxLeverage:3,
    maxApr:28,
    actionType:"Swap"
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDC",
    maxLeverage:3,
    maxApr:18,
    actionType:"Liquidity provision"
  },
  {
    protocol:"Myswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"DAI",
    maxLeverage:3,
    maxApr:10,
    actionType:"Swap"
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"BTC",
    maxLeverage:3,
    maxApr:180,
    actionType:"Swap"
  },
  {
    protocol:"Myswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"ETH",
    maxLeverage:3,
    maxApr:18,
    actionType:"Swap"
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"STRK",
    maxLeverage:3,
    maxApr:18,
    actionType:"Swap"
  },
  {
    protocol:"Myswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDT",
    maxLeverage:3,
    maxApr:18,
    actionType:"Swap"
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDT",
    maxLeverage:3,
    maxApr:18,
    actionType:"Swap"
  },
  
]
const stats = useSelector(selectProtocolStats);
const [supplyAPRs, setSupplyAPRs]: any = useState<(undefined | number)[]>([]);
const [borrowAPRs, setBorrowAPRs]: any = useState<(undefined | number)[]>([]);
const totalSupply=useSelector(selectYourSupply);
  const UserLoans = useSelector(selectUserLoans);
  useEffect(() => {
    if (data) {
      if (data?.length <= (currentPagination - 1) * 6) {
        if (currentPagination > 1) {
          setCurrentPagination(currentPagination - 1);
        }
      }
    }
  }, [data]);

  useEffect(() => {
    // fetchOraclePrices();
    fetchProtocolStats();
    // fetchProtocolReserves();
    // fetchUserReserves();
    // fetchUserLoans();
  }, [stats]);
  const fetchProtocolStats = async () => {
    try {
      setBorrowAPRs([
        stats?.[5].borrowRate,
        stats?.[2].borrowRate,
        stats?.[3].borrowRate,
        stats?.[1].borrowRate,
        stats?.[0].borrowRate,
        stats?.[4].borrowRate,
      ]);
      setSupplyAPRs([
        stats?.[5].supplyRate,
        stats?.[2].supplyRate,
        stats?.[3].supplyRate,
        stats?.[1].supplyRate,
        stats?.[0].supplyRate,
        stats?.[4].supplyRate,
      ]);

    } catch (error) {
      ////console.log("error on getting protocol stats");
    }
  };

  // useEffect(() => {
  //   const loan = async () => {
  //     try {
  //       const loans = await getUserLoans(address || "");
  //       ////console.log(loans,"Loans from your borrow index page")

  //       // loans.filter(
  //       //   (loan) =>
  //       //     loan.collateralAmountParsed &&
  //       //     loan.collateralAmountParsed > 0 &&
  //       //     loan.loanAmountParsed &&
  //       //     loan.loanAmountParsed > 0
  //       // );
  //       if (loans) {
  //         setuserLoans(
  //           loans.filter(
  //             (loan) =>
  //               loan?.collateralAmountParsed &&
  //               loan?.collateralAmountParsed > 0 &&
  //               loan?.loanAmountParsed &&
  //               loan?.loanAmountParsed > 0
  //           )
  //         );
  //       }
  //       dispatch(setUserLoans(loans.filter(
  //         (loan) =>
  //           loan.collateralAmountParsed &&
  //           loan.collateralAmountParsed > 0 &&
  //           loan.loanAmountParsed &&
  //           loan.loanAmountParsed > 0
  //       )));
  //     } catch (err) {
  //      //console.log("your-borrow : unable to fetch user loans");
  //     }
  //     ////console.log("loans", loans);
  //   };
  //   if (account) {
  //     loan();
  //   }
  // }, [account, UserLoans]);

  return (
    <PageCard pt="6.5rem">
      {/* <StatsBoard /> */}
      <HStack
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        width="95%"
        // bgColor="green"
        // mt="3rem"
        pr="3rem"
        mb="1rem"
      >
        {/* <Box
          // bgColor="red"
          height="100%"
          display="flex"
          width="100%"
          justifyContent="space-between"
        > */}
        <NavButtons width={70} marginBottom={"0rem"} />
        {/* </Box> */}
      </HStack>
      <DegenDashboard
        width={"95%"}
        currentPagination={currentPagination}
        setCurrentPagination={setCurrentPagination}
        Coins={Coins}
        columnItems={columnItems}
        Borrows={data}
        userLoans={data}
        borrowAPRs={borrowAPRs}
        supplyAPRs={supplyAPRs}
      />      
      <Box
      paddingY="1rem"
      // height="2rem"
      // bgColor={"blue"}
      width="95%"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      {totalSupply>=1000 &&
        <Box>
          <Pagination
            currentPagination={currentPagination}
            setCurrentPagination={(x: any) => setCurrentPagination(x)}
            max={data?.length || 0}
            rows={6}
          />
        </Box>
      }
      {/* <LatestSyncedBlock width="16rem" height="100%" block={83207} /> */}
    </Box>
      {/* <SupplyModal /> */}
    </PageCard>
  );
};

export default Degen;
