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
import { selectYourBorrow, selectNetAPR, selectnetAprLoans, selectProtocolStats, selectYourSupply, selectUserDeposits } from "@/store/slices/readDataSlice";
import { setUserLoans, selectUserLoans } from "@/store/slices/readDataSlice";
import { getUserLoans } from "@/Blockchain/scripts/Loans";
import { IDeposit, ILoan } from "@/Blockchain/interfaces/interfaces";
import { Skeleton } from "@chakra-ui/react";
import numberFormatter from "@/utils/functions/numberFormatter";
import useDataLoader from "@/hooks/useDataLoader";
import DegenDashboard from "@/components/layouts/degenDashboard";
const Degen = () => {
  const [currentPagination, setCurrentPagination] = useState<number>(1);
  const columnItems = [
    "Strategy Name",
    "Type",
    "Collateral",
    "Collateral Amount",
    "Suggested Leverage",
    "Borrowed Amount",
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
    maxLeverage:2,
    maxApr:28,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDC",
    maxLeverage:3,
    maxApr:18,
    actionType:"Liquidity provision",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Myswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"DAI",
    maxLeverage:4,
    maxApr:10,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"BTC",
    maxLeverage:5,
    maxApr:180,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Myswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"ETH",
    maxLeverage:2,
    maxApr:18,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"STRK",
    maxLeverage:3,
    maxApr:18,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Myswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDT",
    maxLeverage:1,
    maxApr:18,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDT",
    maxLeverage:1,
    maxApr:18,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDT",
    maxLeverage:2,
    maxApr:28,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDC",
    maxLeverage:3,
    maxApr:18,
    actionType:"Liquidity provision",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Myswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"DAI",
    maxLeverage:4,
    maxApr:10,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"BTC",
    maxLeverage:5,
    maxApr:180,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Myswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"ETH",
    maxLeverage:2,
    maxApr:18,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"STRK",
    maxLeverage:3,
    maxApr:18,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Myswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDT",
    maxLeverage:1,
    maxApr:18,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDT",
    maxLeverage:1,
    maxApr:18,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDT",
    maxLeverage:2,
    maxApr:28,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDC",
    maxLeverage:3,
    maxApr:18,
    actionType:"Liquidity provision",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Myswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"DAI",
    maxLeverage:4,
    maxApr:10,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"BTC",
    maxLeverage:5,
    maxApr:180,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Myswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"ETH",
    maxLeverage:2,
    maxApr:18,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"STRK",
    maxLeverage:3,
    maxApr:18,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Myswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDT",
    maxLeverage:1,
    maxApr:18,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDT",
    maxLeverage:1,
    maxApr:18,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDT",
    maxLeverage:2,
    maxApr:28,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDT",
    maxLeverage:2,
    maxApr:28,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDC",
    maxLeverage:3,
    maxApr:18,
    actionType:"Liquidity provision",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Myswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"DAI",
    maxLeverage:4,
    maxApr:10,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"BTC",
    maxLeverage:5,
    maxApr:180,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Myswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"ETH",
    maxLeverage:2,
    maxApr:18,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"STRK",
    maxLeverage:3,
    maxApr:18,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Myswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDT",
    maxLeverage:1,
    maxApr:18,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
  },
  {
    protocol:"Jediswap",
    stratergy:"USDC-BTC LP BTC+ETH",
    collateralCoin:"USDT",
    maxLeverage:1,
    maxApr:18,
    actionType:"Swap",
    collateralSuggestedAmount:5000,
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
  let userDeposits = useSelector(selectUserDeposits);
  const [supplies, setSupplies] = useState<IDeposit[]>([]);
  useEffect(() => {
    if (userDeposits) {
      const supply = userDeposits;
      if (!supply) return;
      let data: any = [];
      let indexes: any = [5, 2, 3, 1, 0, 4];
      let count = 0;

      indexes.forEach((index: number) => {
        if (
          supply?.[index]?.rTokenAmountParsed !== 0 ||
          supply?.[index]?.rTokenFreeParsed !== 0 ||
          supply?.[index]?.rTokenLockedParsed !== 0 ||
          supply?.[index]?.rTokenStakedParsed !== 0
        ) {
          if (index == 2 || index == 3) {
            if (
              supply?.[index]?.rTokenAmountParsed > 0.00001 ||
              supply?.[index]?.rTokenFreeParsed > 0.00001 ||
              supply?.[index]?.rTokenLockedParsed > 0.00001 ||
              supply?.[index]?.rTokenStakedParsed > 0.00001
            ) {
              data[index] = supply[index];
              count++;
            }
          } else {
            data[index] = supply[index];
            count++;
          }
        }
      });
      setSupplies(data);
    }
  }, [userDeposits]);

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
      <Box
        display="flex"
        justifyContent="left"
        w="94%"
        mt="0.5rem"
        mb="0.8rem"
        color="#F0F0F5"
        // opacity="0.9"
        fontSize="sm"
      >
        The borrowing amount is fixed to $5000 worth of assets.
      </Box>
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
        supplies={supplies}
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
      {totalSupply>=10 &&
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
