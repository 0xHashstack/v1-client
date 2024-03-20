import { IDeposit } from "@/Blockchain/interfaces/interfaces";
import { getUserDeposits } from "@/Blockchain/scripts/Deposits";
import BorrowDashboard from "@/components/layouts/borrowDashboard";
import NavButtons from "@/components/layouts/navButtons";
import Navbar from "@/components/layouts/navbar/Navbar";
import PageCard from "@/components/layouts/pageCard";
import StatsBoard from "@/components/layouts/statsBoard";
import SupplyDashboard from "@/components/layouts/supplyDashboard";
import YourSupplyModal from "@/components/modals/yourSupply";
import LatestSyncedBlock from "@/components/uiElements/latestSyncedBlock";
import Pagination from "@/components/uiElements/pagination";
import useDataLoader from "@/hooks/useDataLoader";
import {
  selectNetAPR,
  selectYourSupply,
  selectnetAprDeposits,
} from "@/store/slices/readDataSlice";
import { setSpendBorrowSelectedDapp } from "@/store/slices/userAccountSlice";
import { Coins } from "@/utils/constants/coin";
import numberFormatter from "@/utils/functions/numberFormatter";
import { Box, HStack, Skeleton, Stack, Text, VStack } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux/es/hooks/useDispatch";
const YourSupply = () => {
  const [currentPagination, setCurrentPagination] = useState<number>(1);
  const columnItems = [
    "rToken amount",
    "Exchange rate",
    "Supply APR",
    "Effective APR",
    "Status",
    "",
  ];
  const { account, address } = useAccount();
  useDataLoader();
  // useEffect(()=>{
  //   const walletConnected = localStorage.getItem('lastUsedConnector');
  //   if(walletConnected=="braavos"){
  //     connect(connectors[0]);
  //   }else if(walletConnected=="argentx"){
  //     connect(connectors[1]);
  //   }
  // },[])
  // const [userDeposits, setUserDeposits] = useState<IDeposit[]>([]);
  // useEffect(() => {
  //   const getSupply = async () => {
  //    //console.log("all deposits calling started");
  //     try {
  //       const supply = await getUserDeposits(address || "");
  //       setUserDeposits(supply);
  //     } catch (err) {
  //      //console.log("supplies", err);
  //     }
  //   };
  //   getSupply();
  // }, []);
  const totalSupply = useSelector(selectYourSupply);
  const netAPR = useSelector(selectnetAprDeposits);

  return (
    <PageCard pt="6.5rem">
      <HStack
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        width="95%"
        pr="3rem"
        mb="1rem"
      >
        <NavButtons width={70} marginBottom={"0rem"} />
        <HStack
          width="13.5rem"
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <VStack
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={"3px"}
          >
            <Text color="#6e7681" fontSize="14px" alignItems="center">
              Total Supply
            </Text>
            {totalSupply == null ? (
              <Skeleton
                width="6rem"
                height="1.9rem"
                startColor="#101216"
                endColor="#2B2F35"
                borderRadius="6px"
              />
            ) : (
              <Text color="#e6edf3" fontSize="20px">
                {totalSupply ? `$${numberFormatter(totalSupply)}` : "NA"}
              </Text>
            )}
          </VStack>
          <VStack gap={"3px"}>
            <Text color={"#6e7681"} fontSize="14px" alignItems="center">
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
                color={netAPR > 0 ? "#00D395" : netAPR==0?"white": "rgb(255 94 94)"}
                fontSize="20px"
              >
                {netAPR!=0 ? `${netAPR}%` : "NA"}
              </Text>
            )}
          </VStack>
        </HStack>
      </HStack>
      <SupplyDashboard
        width={"95%"}
        currentPagination={currentPagination}
        Coins={Coins}
        columnItems={columnItems}
      />
      {/* <Box
        paddingY="1rem"
        width="95%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Pagination
            currentPagination={currentPagination}
            setCurrentPagination={(x: any) => setCurrentPagination(x)}
            max={Coins.length}
            rows={6}
          />
        </Box>
        <LatestSyncedBlock width="16rem" height="100%" block={83207} />
      </Box> */}
      {/* <SupplyModal /> */}
    </PageCard>
  );
};

export default YourSupply;
