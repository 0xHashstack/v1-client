import React, { memo, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button'; // shadcn Button
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'; // shadcn Tooltip
import { Skeleton } from '@/components/ui/skeleton'; // shadcn Skeleton
import { Badge } from '@/components/ui/badge'; // shadcn Badge
import Image from 'next/image';
import {
	selectNetAPR,
	selectNetWorth,
	selectProtocolReserves,
	selectUserLoans,
	selectUsersFilteredSupply,
	selectYourBorrow,
	selectYourSupply,
} from '@/store/slices/readDataSlice';
import {
	selectCurrentPage,
	selectUserUnspentLoans,
	setCurrentPage,
} from '@/store/slices/userAccountSlice';
import numberFormatter from '@/utils/functions/numberFormatter';
import numberFormatterPercentage from '@/utils/functions/numberFormatterPercentage';
import { capitalizeWords } from '../../../utils/functions/capitalizeWords';
import FireIcon from '@/assets/icons/fireIcon';
import NegativeApr from '@/assets/icons/NegativeApr';
import PositiveApr from '@/assets/icons/PositiveApr';
import { ArrowLeftIcon, ChevronLeftIcon } from 'lucide-react';

interface NavButtonsProps {
	width: number | string;
	marginBottom: string;
}

const NavButtons: React.FC<NavButtonsProps> = ({ width, marginBottom }) => {
	const dispatch = useDispatch();
	const router = useRouter();

	const currentPage = useSelector(selectCurrentPage);
	const userLoans = useSelector(selectUserLoans);
	const usersFilteredSupply = useSelector(selectUsersFilteredSupply);
	const userUnspentLoans = useSelector(selectUserUnspentLoans);
	const protocolReserves = useSelector(selectProtocolReserves);
	const netWorth = useSelector(selectNetWorth);
	const yourSupply = useSelector(selectYourSupply);
	const yourBorrow = useSelector(selectYourBorrow);
	const netAPR = useSelector(selectNetAPR);
	const posthog = usePostHog();

	const navOptions = [
		{ path: 'v1/market/', label: 'Markets', count: 0 },
		{
			path: 'v1/spend-borrow/',
			label: 'Spend Borrow',
			count: userUnspentLoans?.length ? userUnspentLoans.length : 0,
		},
		{
			path: 'v1/your-supply/',
			label: 'Your Supply',
			count: usersFilteredSupply ? usersFilteredSupply : 0,
		},
		{
			path: 'v1/your-borrow/',
			label: 'Your Borrow',
			count: userLoans?.length ? userLoans.length : 0,
		},
		{ path: 'v1/degen/', label: 'Degen', count: 0 },
		{ path: 'v1/strk-rewards/', label: 'Farm STRK token', count: 0 },
	];

	const pathname = usePathname();

	useEffect(() => {
		const storedCurrentPage = (
			typeof window !== 'undefined' ?
				window.localStorage
			:	null)?.getItem('currentPage');
		if (storedCurrentPage) {
			dispatch(setCurrentPage(storedCurrentPage));
		}
	}, [dispatch]);

	const handleButtonClick = (val: string) => {
		if (val === 'v1/degen/') {
			posthog.capture('Degen Tab Clicked', {
				Clicked: true,
			});
		}
		dispatch(setCurrentPage(val));
		(typeof window !== 'undefined' ? window.localStorage : null)?.setItem(
			'currentPage',
			val
		);
		router.push('/' + val);
	};

	const getButtonLabel = (path: string) => {
		const navOption = navOptions.find((option) => option.path === path);
		return navOption ? navOption.label : '';
	};

	return (
		<div
			className={`flex justify-center md:justify-between  items-center flex-wrap gap-2`}
			style={{
				width: typeof width === 'number' ? width + '%' : width,
				marginBottom: marginBottom,
			}}>
			<div className='flex gap-2 max-w-full overflow-x-scroll'>
				{navOptions.map((option, idx) => (
					<div
						key={idx}
						onClick={() => handleButtonClick(option.path)}>
						<Button
							variant='ghost'
							className={`font-normal rounded-none text-sm flex-shrink-0 ${
								currentPage === option.path ?
									'font-semibold'
								:	'font-normal'
							} ${
								pathname === `/${option.path}` ? 'text-white'
								:	'text-gray-500'
							} ${
								option.path === 'v1/strk-rewards/' ?
									'text-purple-300'
								:	''
							} ${
								pathname === `/${option.path}` ?
									'border-b-2 border-blue-500'
								:	''
							} hover:bg-transparent hover:text-gray-200`}>
							{option.path === 'v1/market/' &&
								pathname !== '/v1/market/' && (
									<div className='mr-1.5'>
										<ChevronLeftIcon />
									</div>
								)}
							{capitalizeWords(
								option.path === 'v1/market/' ?
									pathname === '/v1/market/' ?
										getButtonLabel(option.path)
									:	'Markets'
								:	getButtonLabel(option.path)
							)}
							{option.count > 0 && (
								<Badge className='ml-2 bg-gray-800 text-gray-300 border border-gray-700'>
									{option.count}
								</Badge>
							)}
							{option.path === 'v1/degen/' && (
								<div className='ml-2'>
									<Image
										src='/new.svg'
										alt='New Icon'
										width={36}
										height={16}
									/>
								</div>
							)}
							{option.path === 'v1/strk-rewards/' && (
								<div className='ml-2'>
									<FireIcon />
								</div>
							)}
						</Button>
					</div>
				))}
			</div>
			{pathname === '/v1/market/' && (
				<div className='flex gap-4'>
					<div className='flex items-center gap-1'>
						<span className='text-sm text-gray-500'>
							Your Net Worth
						</span>
						{netWorth === null ?
							<Skeleton className='w-24 h-6 bg-gray-800 rounded-md' />
						:	<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<span
											className='text-lg text-white cursor-pointer hover:underline'
											onClick={() =>
												router.push('/v1/your-metrics')
											}>
											${numberFormatter(netWorth)}
										</span>
									</TooltipTrigger>
									<TooltipContent>
										Click here for your metrics
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						}
					</div>
					<div className='flex items-center gap-1'>
						<span className='text-sm text-gray-500'>Net APR</span>
						{netAPR === null ?
							<Skeleton className='w-24 h-6 bg-gray-800 rounded-md' />
						:	<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<div className='flex items-center gap-1'>
											<span
												className='text-lg text-white cursor-pointer hover:underline'
												onClick={() =>
													router.push(
														'/v1/your-metrics'
													)
												}>
												{numberFormatterPercentage(
													netAPR
												)}
												%
											</span>
											{netAPR >= 0 ?
												<PositiveApr />
											:	<NegativeApr />}
										</div>
									</TooltipTrigger>

									<TooltipContent>
										Click here for your metrics
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						}
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(NavButtons);
