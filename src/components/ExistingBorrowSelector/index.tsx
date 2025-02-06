'use client';

import Image from 'next/image';
import React from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import ArrowUp from '@/assets/icons/arrowup';
import DropdownUp from '@/assets/icons/dropdownUpIcon';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExistingBorrowSelectorProps {
	borrowId: string;
	columnItems: string[];
	userLoans: any[];
	currentBorrow: number;
	avgs: any[];
	oraclePrices: any[];
	ltv: any[];
	avgsLoneHealth: any[];
	onBorrowSelect: (borrow: any) => void;
}

const ExistingBorrowSelector: React.FC<ExistingBorrowSelectorProps> = ({
	borrowId,
	columnItems,
	userLoans,
	currentBorrow,
	avgs,
	oraclePrices,
	ltv,
	avgsLoneHealth,
	onBorrowSelect,
}) => {
	const [isOpen, setIsOpen] = React.useState(false);

	const handleBorrowSelect = (borrow: any) => {
		onBorrowSelect(borrow);
		setIsOpen(false);
	};

	return (
		<DropdownMenu
			open={isOpen}
			onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<div className='flex justify-between bg-[#34345633] border border-[rgba(103,109,154,0.30)] py-2 px-3 mb-4 mt-[0.3rem] rounded-md cursor-pointer'>
					<div className='flex gap-1'>
						<span className='text-white'>{borrowId}</span>
					</div>

					<div className='flex gap-1 items-center'>
						<ChevronDown
							className={cn('text-white transition-transform', {
								'rotate-180': isOpen,
							})}
							size={16}
						/>
					</div>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='min-w-full w-[var(--radix-dropdown-menu-trigger-width)] bg-popover border border-[rgba(103,109,154,0.30)] py-2 shadow-lg rounded-md'>
				<div className='py-2 px-4'>
					<Table>
						<TableHeader>
							<TableRow className='h-8'>
								{columnItems.map(
									(val: string, idx1: number) => (
										<TableHead
											key={idx1}
											className={`w-[12.5%] text-xs font-normal p-0 ${
												idx1 === 0 ? 'text-left pl-12'
												: (
													idx1 ===
													columnItems.length - 1
												) ?
													'text-right pr-[35px]'
												:	'text-center'
											}`}>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<span className='text-[#BDBFC1] cursor-context-menu whitespace-pre-wrap break-words w-full h-8 text-xs'>
															{val}
														</span>
													</TooltipTrigger>
													<TooltipContent className='bg-[#02010F] text-sm font-normal rounded-lg p-2 text-[#F0F0F5] border border-[#23233D]'>
														{val}
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</TableHead>
									)
								)}
							</TableRow>
						</TableHeader>

						<TableBody className='relative'>
							{userLoans.map((borrow: any) => (
								<TableRow
									key={borrow.idx}
									className={`relative h-16 cursor-pointer hover:rounded-none ${currentBorrow === borrow.loanId ? 'bg-[#676D9A4D]' : ''}`}
									onClick={() => handleBorrowSelect(borrow)}>
									<TableCell className='rounded-l-md pl-12 relative'>
										{currentBorrow === borrow.loanId && (
											<div className='absolute h-6 w-1 bg-[#676D9A4D] -left-2' />
										)}
										<div className='flex gap-2 justify-start'>
											<span className='text-sm font-normal text-[#E6EDF3]'>
												{`Borrow ID${borrow.loanId < 10 ? '0' + borrow.loanId : borrow.loanId}`}
											</span>
										</div>
									</TableCell>

									<TableCell className='text-center'>
										<div className='flex gap-1 justify-center h-full items-center'>
											<div className='my-1'>
												<Image
													src={`/${borrow.currentLoanMarket}.svg`}
													alt='Market icon'
													width={16}
													height={16}
												/>
											</div>
											<span className='text-sm font-normal text-[#E6EDF3]'>
												d{borrow.currentLoanMarket}
											</span>
										</div>
									</TableCell>

									<TableCell className='text-center text-sm font-normal text-[#E6EDF3]'>
										{avgs?.find(
											(item: any) =>
												item?.loanId === borrow?.loanId
										)?.avg || '3.2'}
										%
									</TableCell>

									<TableCell className='text-center'>
										<div className='flex gap-2 justify-center h-full items-center'>
											<span className='text-sm font-normal text-[#E6EDF3]'>
												{oraclePrices ?
													ltv
														?.find(
															(val: any) =>
																val?.[0] ===
																borrow?.loanId
														)?.[1]
														?.toFixed(3)
												:	'-'}
											</span>
										</div>
									</TableCell>

									<TableCell className='p-0 rounded-r-md'>
										<div className='flex justify-end pr-10'>
											<div className='h-full flex items-center justify-center'>
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger asChild>
															<span className='text-sm font-normal text-[#E6EDF3]'>
																{avgsLoneHealth?.find(
																	(
																		item: any
																	) =>
																		item?.loanId ===
																		borrow?.loanId
																)?.loanHealth ||
																	'-'}
															</span>
														</TooltipTrigger>
														<TooltipContent className='bg-[#02010F] text-sm font-normal rounded-lg p-2 text-[#F0F0F5] border border-[#23233D]'>
															<div>
																Health Factor:{' '}
																{
																	avgsLoneHealth?.find(
																		(
																			item: any
																		) =>
																			item?.loanId ===
																			borrow?.loanId
																	)
																		?.loanHealth
																}
																<br />
																Liquidates
																below: 1.06
															</div>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ExistingBorrowSelector;
