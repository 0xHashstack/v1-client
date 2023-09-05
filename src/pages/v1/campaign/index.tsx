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
import { useAccount, useConnectors } from "@starknet-react/core";
import { selectYourBorrow, selectNetAPR } from "@/store/slices/readDataSlice";
import { setUserLoans, selectUserLoans } from "@/store/slices/readDataSlice";
import { getUserLoans } from "@/Blockchain/scripts/Loans";
import { ILoan } from "@/Blockchain/interfaces/interfaces";
import { Skeleton } from "@chakra-ui/react";
import numberFormatter from "@/utils/functions/numberFormatter";
import useDataLoader from "@/hooks/useDataLoader";
const Campaign = () => {
  const [currentPagination, setCurrentPagination] = useState<number>(1);
  const columnItems = [
    "Borrow ID",
    "Borrowed",
    "Borrow APR",
    "Effective APR",
    "Collateral",
    "Spend status",
    "Risk premium",
    "",
  ];
  const { available, disconnect, connect, connectors, refresh } =
    useConnectors();

  const dispatch = useDispatch();
  const { account, address } = useAccount();
  useDataLoader();
  const UserLoans = useSelector(selectUserLoans);
  useEffect(() => {
    if (UserLoans) {
      if (UserLoans?.length <= (currentPagination - 1) * 6) {
        console.log("pagination", Pagination, UserLoans);
        if (currentPagination > 1) {
          setCurrentPagination(currentPagination - 1);
        }
      }
    }
  }, [UserLoans]);

  // useEffect(() => {
  //   const loan = async () => {
  //     try {
  //       const loans = await getUserLoans(address || "");
  //       // console.log(loans,"Loans from your borrow index page")

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
  //       console.log("your-borrow : unable to fetch user loans");
  //     }
  //     // console.log("loans", loans);
  //   };
  //   if (account) {
  //     loan();
  //   }
  // }, [account, UserLoans]);
  const totalBorrow = useSelector(selectYourBorrow);
  const netAPR = useSelector(selectNetAPR);

  return (
    <PageCard pt="6.5rem">
      {/* <StatsBoard /> */}


      {/* <SupplyModal /> */}
    </PageCard>
  );
};

export default Campaign;
