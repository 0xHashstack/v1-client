'use client';
import MarketDashboard from '@/components/layouts/marketDashboard';
import NavButtons from '@/components/layouts/navButtons';
import Navbar from '@/components/layouts/navbar/Navbar';
import StatsBoard from '@/components/layouts/statsBoard';
import SpendTable from '@/components/layouts/table/spendTable';
import { Box, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import YourSupplyModal from '@/components/modals/yourSupply';
import YourBorrowModal from '@/components/modals/yourBorrowModal';
import LatestSyncedBlock from '@/components/uiElements/latestSyncedBlock';
import PageCard from '@/components/layouts/pageCard';
import Pagination from '@/components/uiElements/pagination';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Skeleton } from '@chakra-ui/react';
import {
	selectYourBorrow,
	selectNetAPR,
	selectnetAprLoans,
} from '@/store/slices/readDataSlice';
import numberFormatter from '@/utils/functions/numberFormatter';
import useDataLoader from '@/hooks/useDataLoader';
import { selectUserUnspentLoans } from '@/store/slices/userAccountSlice';
import StrkDashboard from '@/components/layouts/strkDashboard';
// import WalletConnectModal from "@/components/modals/WalletConnectModal";
const SpendBorrow = () => {
	useDataLoader();
	const totalBorrow = useSelector(selectYourBorrow);
	const netAPR = useSelector(selectnetAprLoans);
	const userLoans = useSelector(selectUserUnspentLoans);
	////console.log(totalBorrow, "total borrow spend borrow");
	////console.log(netAPR, "netapr in spend borrow");
	return (
		<PageCard pt='6.5rem'>
			<HStack
				display='flex'
				justifyContent='space-between'
				alignItems='flex-end'
				width='95%'
				// bgColor="green"
				// mt="3rem"
				pr='3rem'
				mb='1rem'>
				<NavButtons
					width={70}
					marginBottom={'0rem'}
				/>
			</HStack>
			{/* <ToastContainer theme="dark"/> */}
			<StrkDashboard />

			{/* <WalletConnectModal/> */}
		</PageCard>
	);
};

export default SpendBorrow;
