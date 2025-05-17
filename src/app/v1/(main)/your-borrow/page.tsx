'use client';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { ILoan } from '@/Blockchain/interfaces/interfaces';
import { getUserLoans } from '@/Blockchain/scripts/Loans';
import InfoIconBig from '@/assets/icons/infoIconBig';
import BorrowDashboard from '@/components/layouts/borrowDashboard';
import MarketDashboard from '@/components/layouts/marketDashboard';
import NavButtons from '@/components/layouts/navButtons';
import Navbar from '@/components/layouts/navbar/Navbar';

import StatsBoard from '@/components/layouts/statsBoard';
import YourBorrowModal from '@/components/modals/yourBorrowModal';
import LatestSyncedBlock from '@/components/uiElements/latestSyncedBlock';
import Pagination from '@/components/uiElements/pagination';
import useDataLoader from '@/hooks/useDataLoader';
import {
	selectNetAPR,
	selectUserLoans,
	selectYourBorrow,
	selectnetAprLoans,
	setUserLoans,
} from '@/store/slices/readDataSlice';
import { Coins } from '@/utils/constants/coin';
import numberFormatter from '@/utils/functions/numberFormatter';
import { useAccount } from '@starknet-react/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const COLUMN_ITEMS = [
	'Borrow ID',
	'Borrowed',
	'Borrow APR',
	'Effective APR',
	'Collateral',
	'Spend status',
	'Current ROE',
	'Health Factor',
	'',
] as const;

interface MetricDisplayProps {
	label: string;
	value: string | null;
	isLoading?: boolean;
	valueColor?: string;
	tooltipContent?: string;
}

export const dynamic = 'force-static';
export const runtime = 'nodejs';

const MetricDisplay = ({
	label,
	value,
	isLoading,
	valueColor = 'text-[#e6edf3]',
	tooltipContent,
}: MetricDisplayProps) => {
	const ValueDisplay = () => (
		<span className={cn('text-xl', valueColor)}>{value ?? 'NA'}</span>
	);

	return (
		<div className='flex flex-col items-center gap-1'>
			<div className='flex items-center gap-2 text-sm text-[#6e7681]'>
				{label}
				{tooltipContent && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<InfoIconBig />
							</TooltipTrigger>
							<TooltipContent className='bg-[#02010F] text-[#F0F0F5] border border-[#23233D] rounded-lg p-2 text-sm'>
								{tooltipContent}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
			{isLoading ?
				<Skeleton className='h-8 w-24 rounded-md bg-[#101216]' />
			:	<ValueDisplay />}
		</div>
	);
};

const YourBorrow = () => {
	const [currentPagination, setCurrentPagination] = useState<number>(1);

	const dispatch = useDispatch();
	const { account, address } = useAccount();

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

	const totalBorrow = useSelector(selectYourBorrow);
	const netAPR = useSelector(selectnetAprLoans);

	const getNetAprColor = (apr: number | null) => {
		if (apr === null) return 'text-[#e6edf3]';
		if (apr > 0) return 'text-[#00D395]';
		if (apr === 0) return 'text-white';
		return 'text-[rgb(255,94,94)]';
	};

	return (
		<div className='flex flex-col w-[95vw]'>
			<div className='flex md:justify-between items-end mb-5 flex-wrap gap-4 justify-center'>
				<div className='w-[100%] md:w-[70%]'>
					<NavButtons
						width={'100%'}
						marginBottom='0rem'
					/>
				</div>

				<div className='flex gap-4'>
					<MetricDisplay
						label='Total Borrow'
						value={
							totalBorrow ?
								`$${numberFormatter(totalBorrow)}`
							:	null
						}
						isLoading={totalBorrow === null}
					/>

					<MetricDisplay
						label='Net APR'
						value={
							netAPR !== null && netAPR !== 0 ?
								`${netAPR}%`
							:	null
						}
						isLoading={netAPR === null}
						valueColor={getNetAprColor(netAPR)}
						tooltipContent='Net APR on your borrow is calculated based on the effective APR of each assets, and the collateral amount.'
					/>
				</div>
			</div>

			<BorrowDashboard
				width={'100%'}
				currentPagination={currentPagination}
				setCurrentPagination={setCurrentPagination}
				Coins={Coins}
				columnItems={COLUMN_ITEMS}
				Borrows={UserLoans}
				userLoans={UserLoans}
			/>
			<div className='py-4 w-[100%] flex justify-between items-center'>
				<Pagination
					currentPagination={currentPagination}
					setCurrentPagination={(x: any) => setCurrentPagination(x)}
					max={UserLoans?.length || 0}
					rows={6}
				/>
			</div>
		</div>
	);
};

export default YourBorrow;
