'use client';

import { NextPage } from 'next';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { cn } from '@/lib/utils';

import { Skeleton } from '@/components/ui/skeleton';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';

import InfoIconBig from '@/assets/icons/infoIconBig';
import NavButtons from '@/components/layouts/navButtons';
import SupplyDashboard from '@/components/layouts/supplyDashboard';
import useDataLoader from '@/hooks/useDataLoader';

import {
	selectYourSupply,
	selectnetAprDeposits,
} from '@/store/slices/readDataSlice';
import { Coins } from '@/utils/constants/coin';
import numberFormatter from '@/utils/functions/numberFormatter';

const COLUMN_ITEMS = [
	'rToken amount',
	'Exchange rate',
	'Supply APR',
	'Effective APR',
	'Assets Distribution',
	'',
] as const;

interface MetricDisplayProps {
	label: string;
	value: string | null;
	isLoading?: boolean;
	valueColor?: string;
	tooltipContent?: string;
}

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

const YourSupply: NextPage = () => {
	const [currentPagination, setCurrentPagination] = useState<number>(1);

	const totalSupply = useSelector(selectYourSupply);
	const netAPR = useSelector(selectnetAprDeposits);

	useDataLoader();

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
						label='Total Supply'
						value={
							totalSupply ?
								`$${numberFormatter(totalSupply)}`
							:	null
						}
						isLoading={totalSupply === null}
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
						tooltipContent='Net APR on your supply is calculated based on the effective APR of each assets, and the supply and collateral amount.'
					/>
				</div>
			</div>

			<SupplyDashboard
				width={'100%'}
				currentPagination={currentPagination}
				Coins={Coins}
				columnItems={COLUMN_ITEMS}
			/>
		</div>
	);
};

export default YourSupply;
