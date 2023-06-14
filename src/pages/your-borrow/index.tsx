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
import { useDispatch } from "react-redux";
import { useAccount, useConnectors } from "@starknet-react/core";
import { setSpendBorrowSelectedDapp, setUserLoans } from "@/store/slices/userAccountSlice";
import { getUserLoans } from "@/Blockchain/scripts/Loans";
import { ILoan } from "@/Blockchain/interfaces/interfaces";
const YourBorrow = () => {
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
  const [UserLoans, setuserLoans] = useState<ILoan[] | null>([]);
  // useEffect(()=>{
  //   const walletConnected = localStorage.getItem('lastUsedConnector');
  //   if(walletConnected=="braavos"){
  //     connect(connectors[0]);
  //   }else if(walletConnected=="argentx"){
  //     connect(connectors[1]);
  //   }
  // },[])
  useEffect(() => {
    const loan = async () => {
      try {
        const loans = await getUserLoans(address || "");
        // console.log(loans,"Loans from your borrow index page")

        // loans.filter(
        //   (loan) =>
        //     loan.collateralAmountParsed &&
        //     loan.collateralAmountParsed > 0 &&
        //     loan.loanAmountParsed &&
        //     loan.loanAmountParsed > 0
        // );
        setuserLoans(
          loans.filter(
            (loan) =>
              loan.collateralAmountParsed &&
              loan.collateralAmountParsed > 0 &&
              loan.loanAmountParsed &&
              loan.loanAmountParsed > 0
          )
        );
        dispatch(setUserLoans(loans.filter(
          (loan) =>
            loan.collateralAmountParsed &&
            loan.collateralAmountParsed > 0 &&
            loan.loanAmountParsed &&
            loan.loanAmountParsed > 0
        )));
      } catch (err) {
        console.log("your-borrow : unable to fetch user loans");
      }
      // console.log("loans", loans);
    };
    if (account) {
      loan();
    }
  }, [account, UserLoans]);

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
            <Text color="#e6edf3" fontSize="20px">
              $8,932.14
            </Text>
          </VStack>
          <VStack gap={"3px"}>
            <Text color="#6e7681" fontSize="14px" alignItems="center">
              Net APR
            </Text>
            <Text color="#e6edf3" fontSize="20px">
              15.5%
            </Text>
          </VStack>
        </HStack>
        {/* </Box> */}
      </HStack>
      <BorrowDashboard
        width={"95%"}
        currentPagination={currentPagination}
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
