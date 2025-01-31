import {
	Box,
	Button,
	ButtonGroup,
	HStack,
	Skeleton,
	Text,
	Tooltip,
	useMediaQuery,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import NegativeApr from '@/assets/icons/NegativeApr';
import PositiveApr from '@/assets/icons/PositiveApr';
import FireIcon from '@/assets/icons/fireIcon';
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

interface NavButtonsProps {
	width: number;
	marginBottom: string;
}

const NavButtons: React.FC<NavButtonsProps> = ({ width, marginBottom }) => {
	const [backHover, setBackHover] = useState(false);

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

	const navOptions = [
		{ path: 'v1/market', label: 'Markets', count: 0 },
		{
			path: 'v1/spend-borrow',
			label: 'Spend Borrow',
			count: userUnspentLoans?.length ? userUnspentLoans.length : 0,
		},
		{
			path: 'v1/your-supply',
			label: 'Your Supply',
			count: usersFilteredSupply ? usersFilteredSupply : 0,
		},
		{
			path: 'v1/your-borrow',
			label: 'Your Borrow',
			count: userLoans?.length ? userLoans.length : 0,
		},
		{ path: 'v1/degen', label: 'Degen', count: 0 },
		{ path: 'v1/strk-rewards', label: 'Farm STRK token', count: 0 },
	];

	const { pathname } = router;

	useEffect(() => {
		const storedCurrentPage = localStorage.getItem('currentPage');
		if (storedCurrentPage) {
			dispatch(setCurrentPage(storedCurrentPage));
		}
	}, [dispatch]);

	const handleButtonClick = (val: string) => {
		if (val === 'v1/degen') {
			posthog.capture('Degen Tab Clicked', {
				Clicked: true,
			});
		}
		dispatch(setCurrentPage(val));
		localStorage.setItem('currentPage', val);
		router.push('/' + val);
	};

	const getButtonLabel = (path: string) => {
		const navOption = navOptions.find((option) => option.path === path);
		return navOption ? navOption.label : '';
	};
	const [isLessThan1200] = useMediaQuery('(max-width: 1200px)');
	return (
		<HStack
			mb={marginBottom}
			width={`${width}%`}
			justifyContent='space-between'>
			<ButtonGroup>
				{navOptions.map((option, idx) => (
					<Box
						key={idx}
						onClick={() => handleButtonClick(option.path)}>
						<Button
							key={idx}
							bg='transparent'
							fontStyle='normal'
							fontWeight={
								currentPage === option.path ? '600' : '400'
							}
							fontSize={isLessThan1200 ? '13px' : '14px'}
							lineHeight='20px'
							alignItems='center'
							letterSpacing='-0.15px'
							padding='1.125rem 0.4rem'
							margin='2px'
							color={
								pathname === `/${option.path}` ? '#ffffff'
								: option.path === 'v1/strk-rewards' ?
									'#C7CBF6'
								:	'#676D9A'
							}
							borderBottom={
								pathname === `/${option.path}` ?
									'2px solid #4D59E8'
								:	''
							}
							borderRadius='0px'
							_hover={{ bg: 'transparent', color: '#E6EDF3' }}
							onMouseEnter={() => {
								if (
									option.path === 'v1/market' &&
									pathname !== '/v1/market'
								)
									setBackHover(true);
							}}
							onMouseLeave={() => {
								if (
									option.path === 'v1/market' &&
									pathname !== '/v1/market'
								)
									setBackHover(false);
							}}>
							{option.path === 'v1/market' &&
								pathname !== '/v1/market' && (
									<Box marginRight={1.5}>
										<Image
											src={
												!backHover ? '/arrowNavLeft.svg'
												:	'/arrowNavLeftActive.svg'
											}
											alt='Arrow Navigation Left'
											width='6'
											height='6'
											style={{
												cursor: 'pointer',
											}}
										/>
									</Box>
								)}
							{capitalizeWords(
								option.path == 'v1/market' ?
									pathname === '/v1/market' ?
										getButtonLabel(option.path)
									:	'Markets'
								:	getButtonLabel(option.path)
							)}
							{option.count > 0 && (
								<Box
									ml='.5rem'
									borderRadius='6px'
									border='1px solid #34345699'
									height='1.4rem'
									width='1.4rem'
									display='flex'
									justifyContent='center'
									alignItems='center'
									fontWeight='light'
									fontSize='12px'>
									{option.count}
								</Box>
							)}
							{option.path === 'v1/degen' && (
								<Box ml='0.5rem'>
									<Image
										src={`/new.svg`}
										alt={`Picture of the coin that I want to access strk`}
										width='36'
										height='16'
									/>
								</Box>
							)}
							{option.path === 'v1/strk-rewards' && (
								<Box ml='0.5rem'>
									<FireIcon />
								</Box>
							)}
						</Button>
					</Box>
				))}
			</ButtonGroup>
			{router.pathname === '/v1/market' && (
				<Box
					display='flex'
					gap={isLessThan1200 ? '1.5rem' : '2rem'}>
					<Box
						display='flex'
						gap='0.4rem'
						justifyContent='center'
						alignItems='center'>
						<Text
							color='#676D9A'
							fontSize={isLessThan1200 ? '13px' : '14px'}
							whiteSpace='nowrap'>
							Your Net Worth
						</Text>
						{netWorth === null ?
							<Skeleton
								width='6rem'
								height='1.4rem'
								startColor='#101216'
								endColor='#2B2F35'
								borderRadius='6px'
							/>
						:	<Box>
								<Tooltip
									hasArrow
									arrowShadowColor='#2B2F35'
									placement='bottom'
									boxShadow='dark-lg'
									label='Click here for your metrics.'
									bg='#02010F'
									fontSize={'13px'}
									fontWeight={'400'}
									borderRadius={'lg'}
									padding={'2'}
									color='#F0F0F5'
									border='1px solid'
									borderColor='#23233D'>
									<Text
										color='#E6EDF3'
										fontSize={
											isLessThan1200 ? '16px' : '18px'
										}
										cursor='pointer'
										onClick={() => {
											router.push('/v1/your-metrics');
										}}
										_hover={{
											textDecoration: 'underline',
										}}>
										${numberFormatter(netWorth)}
									</Text>
								</Tooltip>
							</Box>
						}
					</Box>
					<Box
						display='flex'
						gap='0.4rem'
						justifyContent='center'
						alignItems='center'>
						<Text
							color='#676D9A'
							fontSize={isLessThan1200 ? '13px' : '14px'}
							whiteSpace='nowrap'>
							Net APR
						</Text>
						{netAPR === null ?
							<Skeleton
								width='6rem'
								height='1.4rem'
								startColor='#101216'
								endColor='#2B2F35'
								borderRadius='6px'
							/>
						:	<Box>
								<Tooltip
									hasArrow
									arrowShadowColor='#2B2F35'
									placement='bottom'
									boxShadow='dark-lg'
									label='Click here for your metrics.'
									bg='#02010F'
									fontSize={'13px'}
									fontWeight={'400'}
									borderRadius={'lg'}
									padding={'2'}
									color='#F0F0F5'
									border='1px solid'
									borderColor='#23233D'>
									<Text
										color='#E6EDF3'
										fontSize={
											isLessThan1200 ? '16px' : '18px'
										}
										cursor='pointer'
										onClick={() => {
											router.push('/v1/your-metrics');
										}}
										_hover={{
											textDecoration: 'underline',
										}}>
										{numberFormatterPercentage(netAPR)}%
									</Text>
								</Tooltip>
							</Box>
						}
						<Box>
							{netAPR >= 0 ?
								<PositiveApr />
							:	<NegativeApr />}
						</Box>
					</Box>
				</Box>
			)}
		</HStack>
	);
};

export default memo(NavButtons);
