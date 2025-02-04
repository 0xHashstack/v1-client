import React from 'react';
import numberFormatter from '@/utils/functions/numberFormatter';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

interface StarkDashboardHeaderProps {
	hashstackStrkReward?: number;
	strkRewardsZklend: number;
	totalStrkRewards: number;
	strkClaimedRewards: number;
	strkRewards: number;
	handleClaimStrk: () => void;
}

const StarkDashboardHeader: React.FC<StarkDashboardHeaderProps> = ({
	hashstackStrkReward,
	strkRewardsZklend,
	totalStrkRewards,
	strkClaimedRewards,
	strkRewards,
	handleClaimStrk,
}) => {
	return (
		<div className='flex justify-between flex-row w-full flex-wrap gap-4'>
			<div className='flex'>
				<p className='text-[26px] font-semibold text-white'>
					Participate in a
					<span className='text-[#7956EC]'> 90M $STRK </span>
					Incentive Program!
				</p>
			</div>
			<div className='flex gap-8 mr-4'>
				<div className='space-y-1'>
					<p className='text-sm text-[#B1B0B5] font-normal'>
						Total STRK Reward
					</p>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								{totalStrkRewards == null ?
									<Skeleton className='w-24 h-5 bg-[#101216] rounded-md' />
								:	<p className='text-base font-medium text-white text-left'>
										{numberFormatter(totalStrkRewards)} STRK
									</p>
								}
							</TooltipTrigger>
							<TooltipContent className='bg-[#02010F] border border-[#23233D] text-[#F0F0F5] text-sm p-2 rounded-lg shadow-lg'>
								<div className='space-y-2'>
									<div className='flex justify-between gap-3'>
										<span>Hashstack Rewards:</span>
										<span>
											{numberFormatter(
												hashstackStrkReward
											)}{' '}
											STRK
										</span>
									</div>
									<div className='flex justify-between gap-3'>
										<span>ZKlend Rewards:</span>
										<span>
											{numberFormatter(strkRewardsZklend)}{' '}
											STRK
										</span>
									</div>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				{strkRewards >= 0 && (
					<div className='space-y-1'>
						<p className='text-sm text-[#B1B0B5] font-normal'>
							Claimed STRK Reward
						</p>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									{strkClaimedRewards == null ?
										<Skeleton className='w-24 h-5 bg-[#101216] rounded-md' />
									:	<p className='text-base font-medium text-white text-left'>
											{numberFormatter(
												strkClaimedRewards
											)}{' '}
											STRK
										</p>
									}
								</TooltipTrigger>
								<TooltipContent className='bg-[#02010F] border border-[#23233D] text-[#F0F0F5] text-sm p-2 rounded-lg shadow-lg' />
							</Tooltip>
						</TooltipProvider>
					</div>
				)}
				<Button
					variant='outline'
					className='h-8 text-xs mt-2 px-3 border border-[#BDBFC1] text-[#BDBFC1] bg-transparent hover:bg-white hover:text-black disabled:bg-[#101216] disabled:text-[#2B2F35] disabled:border-[#2B2F35]'
					disabled={strkRewards <= 0}
					onClick={handleClaimStrk}>
					Claim
				</Button>
			</div>
		</div>
	);
};

export default StarkDashboardHeader;
