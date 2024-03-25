import { ILoan } from "@/Blockchain/interfaces/interfaces";
import { getUserLoans } from "@/Blockchain/scripts/Loans";
import BorrowDashboard from "@/components/layouts/borrowDashboard";
import MarketDashboard from "@/components/layouts/marketDashboard";
import NavButtons from "@/components/layouts/navButtons";
import Navbar from "@/components/layouts/navbar/Navbar";
import PageCard from "@/components/layouts/pageCard";
import StatsBoard from "@/components/layouts/statsBoard";
import YourBorrowModal from "@/components/modals/yourBorrowModal";
import LatestSyncedBlock from "@/components/uiElements/latestSyncedBlock";
import Pagination from "@/components/uiElements/pagination";
import useDataLoader from "@/hooks/useDataLoader";
import {
  selectNetAPR,
  selectUserLoans,
  selectYourBorrow,
  selectnetAprLoans,
  setUserLoans,
} from "@/store/slices/readDataSlice";
import { Coins } from "@/utils/constants/coin";
import numberFormatter from "@/utils/functions/numberFormatter";
import { Box, HStack, Skeleton, Stack, Text, VStack } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const YourBorrow = () => {
  const [currentPagination, setCurrentPagination] = useState<number>(1);
  const columnItems = [
    "Borrow ID",
    "Borrowed",
    "Borrow APR",
    "Effective APR",
    "Collateral",
    "Spend status",
    "Current ROE",
    "Health Factor",
    "",
  ];

  const dispatch = useDispatch();
  const { account, address } = useAccount();
  useDataLoader();
  const UserLoans = useSelector(selectUserLoans);
  useEffect(() => {
    if (UserLoans) {
      if (UserLoans?.length <= (currentPagination - 1) * 6) {
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
  const totalBorrow = useSelector(selectYourBorrow);
  const netAPR = useSelector(selectnetAprLoans);

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
        <HStack
          width="13.5rem"
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          // bgColor="blue"
        >
          <VStack
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={"3px"}
          >
            <Text color="#6e7681" fontSize="14px" alignItems="center">
              Total Borrow
            </Text>
            {totalBorrow == null ? (
              <Skeleton
                width="6rem"
                height="1.9rem"
                startColor="#101216"
                endColor="#2B2F35"
                borderRadius="6px"
              />
            ) : (
              <Text color="#e6edf3" fontSize="20px">
                {totalBorrow ? `$${numberFormatter(totalBorrow)}` : "NA"}
              </Text>
            )}
          </VStack>
          <VStack gap={"3px"}>
            <Text color="#6e7681" fontSize="14px" alignItems="center">
              Net APR
            </Text>
            {netAPR == null ? (
              <Skeleton
                width="6rem"
                height="1.9rem"
                startColor="#101216"
                endColor="#2B2F35"
                borderRadius="6px"
              />
            ) : (
              <Text
                color={
                  Number(netAPR) < 0
                    ? "rgb(255 94 94)"
                    : Number(netAPR) == 0
                    ? "white"
                    : "#00D395"
                }
                fontSize="20px"
              >
                {netAPR && !Number.isNaN(netAPR) ? `${netAPR}%` : "NA"}
              </Text>
            )}
          </VStack>
        </HStack>
        {/* </Box> */}
      </HStack>
      <BorrowDashboard
        width={"95%"}
        currentPagination={currentPagination}
        setCurrentPagination={setCurrentPagination}
        Coins={Coins}
        columnItems={columnItems}
        Borrows={UserLoans}
        userLoans={UserLoans}
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
        <Box>
          <Pagination
            currentPagination={currentPagination}
            setCurrentPagination={(x: any) => setCurrentPagination(x)}
            max={UserLoans?.length || 0}
            rows={6}
          />
        </Box>
        {/* <LatestSyncedBlock width="16rem" height="100%" block={83207} /> */}
      </Box>
      {/* <SupplyModal /> */}
    </PageCard>
  );
};

export default YourBorrow;
