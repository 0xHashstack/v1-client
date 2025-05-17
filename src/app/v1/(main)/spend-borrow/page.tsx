'use client';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import InfoIconBig from '@/assets/icons/infoIconBig';
import NavButtons from '@/components/layouts/navButtons';
import SpendTable from '@/components/layouts/table/spendTable';
import useDataLoader from '@/hooks/useDataLoader';
import {
	selectYourBorrow,
	selectnetAprLoans,
} from '@/store/slices/readDataSlice';
import { selectUserUnspentLoans } from '@/store/slices/userAccountSlice';
import numberFormatter from '@/utils/functions/numberFormatter';
import { useSelector } from 'react-redux';

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

const SpendBorrow = () => {
	const totalBorrow = useSelector(selectYourBorrow);
	const netAPR = useSelector(selectnetAprLoans);

	return (
		<div className='flex flex-col w-[95vw]'>
			<div className='flex justify-center md:justify-between items-end mb-5 gap-4 flex-wrap'>
				<div className='w-[100%] md:w-[70%]'>
					<NavButtons
						width={'100%'}
						marginBottom={'0rem'}
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
							netAPR && !Number.isNaN(netAPR) ?
								`${netAPR}%`
							:	null
						}
						isLoading={netAPR === null}
						tooltipContent='Net APR on your borrow is calculated based on the effective APR of each assets, and the collateral amount.'
					/>
				</div>
			</div>
			<SpendTable />
		</div>
	);
};

export default SpendBorrow;
