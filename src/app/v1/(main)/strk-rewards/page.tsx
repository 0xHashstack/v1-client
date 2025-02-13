'use client';
import NavButtons from '@/components/layouts/navButtons';
import { HStack } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import {
	selectYourBorrow,
	selectnetAprLoans,
} from '@/store/slices/readDataSlice';
import useDataLoader from '@/hooks/useDataLoader';
import { selectUserUnspentLoans } from '@/store/slices/userAccountSlice';
import StrkDashboard from '@/components/layouts/strkDashboard';
// import WalletConnectModal from "@/components/modals/WalletConnectModal";

export const dynamic = 'force-static';
export const runtime = 'nodejs';

const SpendBorrow = () => {
	useDataLoader();
	const totalBorrow = useSelector(selectYourBorrow);
	const netAPR = useSelector(selectnetAprLoans);
	const userLoans = useSelector(selectUserUnspentLoans);
	////console.log(totalBorrow, "total borrow spend borrow");
	////console.log(netAPR, "netapr in spend borrow");
	return (
		<div className='w-[95vw]'>
			<NavButtons
				width={100}
				marginBottom={'0rem'}
			/>
			<StrkDashboard />
		</div>
	);
};

export default SpendBorrow;
