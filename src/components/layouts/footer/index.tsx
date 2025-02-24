import {
	Box,
	Button,
	HStack,
	Menu,
	MenuButton,
	MenuDivider,
	MenuGroup,
	MenuItem,
	MenuItemOption,
	MenuList,
	MenuOptionGroup,
	Skeleton,
	Text,
	Tooltip,
	useMediaQuery,
} from '@chakra-ui/react';
import { useAccount, useBlockNumber, useNetwork } from '@starknet-react/core';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AccountInterface, BlockNumber } from 'starknet';

import {
	selectBlock,
	selectCurrentNetwork,
	selectProtocolReserves,
	setBlock,
} from '@/store/slices/readDataSlice';
import numberFormatter from '@/utils/functions/numberFormatter';
import numberFormatterPercentage from '@/utils/functions/numberFormatterPercentage';
import hoverC2e from '../../../assets/images/hoverContributeEarnIcon.svg';

interface ExtendedAccountInterface extends AccountInterface {
	provider?: {
		chainId: string;
	};
}

const animation = { duration: 40000, easing: (t: number) => t };

const Footer = () => {
	const { account } = useAccount();
	const { data: block } = useBlockNumber({
		blockIdentifier: 'latest' as BlockNumber,
	});
	const extendedAccount = account as ExtendedAccountInterface;
	const currentBlock = useSelector(selectBlock);
	const currentChainId = useSelector(selectCurrentNetwork);
	const dispatch = useDispatch();
	const { chain } = useNetwork();
	const protocolReserves = useSelector(selectProtocolReserves);
	const router = useRouter();
	const [isLessThan1400] = useMediaQuery('(max-width: 1400px)');
	const [hoverCampaigns, sethoverCampaigns] = useState(false);
	const [hoverc2e, sethoverc2e] = useState(false);
	const [perviewCount, setperviewCount] = useState<number>(2);
	const posthog = usePostHog();

	const [ref, slider] = useKeenSlider<HTMLDivElement>({
		loop: true,
		mode: 'free',
		slides: {
			perView: perviewCount,
			spacing: 11,
		},
		renderMode: 'performance',
		drag: false,
		created(s: {
			moveToIdx: (
				arg0: number,
				arg1: boolean,
				arg2: { duration: number; easing: (t: number) => number }
			) => void;
		}) {
			s.moveToIdx(5, true, animation);
		},
		updated(s: {
			moveToIdx: (
				arg0: any,
				arg1: boolean,
				arg2: { duration: number; easing: (t: number) => number }
			) => void;
			track: { details: { abs: number } };
		}) {
			s.moveToIdx(s.track.details.abs + 5, true, animation);
		},
		animationEnded(s: {
			moveToIdx: (
				arg0: any,
				arg1: boolean,
				arg2: { duration: number; easing: (t: number) => number }
			) => void;
			track: { details: { abs: number } };
		}) {
			s.moveToIdx(s.track.details.abs + 5, true, animation);
		},
	});

	useEffect(() => {
		if (!currentBlock || currentBlock < (block ? block : -1)) {
			dispatch(setBlock(block));
		}
	}, [block]);

	useEffect(() => {
		if (isLessThan1400) {
			setperviewCount(1);
		} else {
			setperviewCount(2);
		}
	}, [isLessThan1400]);

	return (
		<HStack
			zIndex='14'
			position='fixed'
			bottom='0'
			bgColor='#02010F'
			width='100vw'
			boxShadow='rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px'
			color='#FFF'
			height='2rem'
			borderY='1px solid #2B2F35'
			// px="1rem"
		>
			<Box
				width='95%'
				display='flex'
				justifyContent='space-between'
				alignItems='center'
				mx='auto'>
				<HStack
					ref={ref}
					className='keen-slider'
					h='100%'
					display='flex'
					alignItems='center'
					cursor='pointer'
					flex='1'
					pl='1rem'
					pr='4rem'
					onClick={() => {
						router.push('/v1/protocol-metrics');
					}}
					onMouseOver={() => {
						slider.current?.animator.stop();
					}}
					onMouseLeave={() => {
						slider.current?.animator.start([
							{
								distance: 0,
								duration: 5,
								easing: animation.easing,
							},
						]);
					}}>
					<Box
						className='keen-slider__slide number-slide3 text_nowrap'
						fontSize='sm'
						display='flex'
						alignItems='center'
						_hover={{ textDecoration: 'underline' }}>
						Total Reserves:
						<Tooltip
							hasArrow
							arrowShadowColor='#2B2F35'
							placement='bottom'
							boxShadow='dark-lg'
							label='Click here for protocol metrics.'
							bg='#02010F'
							fontSize={'13px'}
							fontWeight={'400'}
							borderRadius={'lg'}
							padding={'2'}
							color='#F0F0F5'
							border='1px solid'
							borderColor='#23233D'>
							<Text
								color='#B0F1DE'
								ml='3'
								_hover={{ textDecoration: 'underline' }}>
								$
								{numberFormatter(
									protocolReserves?.totalReserves
								)}
							</Text>
						</Tooltip>
					</Box>
					<Box
						className='keen-slider__slide number-slide1 text_nowrap'
						fontSize='sm'
						display='flex'
						alignItems='center'
						_hover={{ textDecoration: 'underline' }}>
						Availables Reserves:
						<Tooltip
							hasArrow
							arrowShadowColor='#2B2F35'
							placement='bottom'
							boxShadow='dark-lg'
							label='Click here for protocol metrics.'
							bg='#02010F'
							fontSize={'13px'}
							fontWeight={'400'}
							borderRadius={'lg'}
							padding={'2'}
							color='#F0F0F5'
							border='1px solid'
							borderColor='#23233D'>
							<Text
								color='#B0F1DE'
								ml='3'
								_hover={{ textDecoration: 'underline' }}>
								$
								{numberFormatter(
									protocolReserves?.availableReserves
								)}
							</Text>
						</Tooltip>
					</Box>

					<Box
						className='keen-slider__slide number-slide2 text_nowrap'
						fontSize='sm'
						display='flex'
						alignItems='center'
						_hover={{ textDecoration: 'underline' }}>
						Average Asset Utilisation:
						<Tooltip
							hasArrow
							arrowShadowColor='#2B2F35'
							placement='bottom'
							boxShadow='dark-lg'
							label='Click here for protocol metrics.'
							bg='#02010F'
							fontSize={'13px'}
							fontWeight={'400'}
							borderRadius={'lg'}
							padding={'2'}
							color='#F0F0F5'
							border='1px solid'
							borderColor='#23233D'>
							<Text
								color='#B0F1DE'
								ml='3'
								_hover={{ textDecoration: 'underline' }}>
								{numberFormatterPercentage(
									protocolReserves?.avgAssetUtilisation
								)}
								%
							</Text>
						</Tooltip>
					</Box>
					<Box
						className='keen-slider__slide number-slide3 text_nowrap'
						fontSize='sm'
						display='flex'
						alignItems='center'
						_hover={{ textDecoration: 'underline' }}>
						Total Reserves:
						<Tooltip
							hasArrow
							arrowShadowColor='#2B2F35'
							placement='bottom'
							boxShadow='dark-lg'
							label='Click here for protocol metrics.'
							bg='#02010F'
							fontSize={'13px'}
							fontWeight={'400'}
							borderRadius={'lg'}
							padding={'2'}
							color='#F0F0F5'
							border='1px solid'
							borderColor='#23233D'>
							<Text
								color='#B0F1DE'
								ml='3'
								_hover={{ textDecoration: 'underline' }}>
								$
								{numberFormatter(
									protocolReserves?.totalReserves
								)}
							</Text>
						</Tooltip>
					</Box>
					<Box
						className='keen-slider__slide number-slide1 text_nowrap'
						fontSize='sm'
						display='flex'
						alignItems='center'
						_hover={{ textDecoration: 'underline' }}>
						Availables Reserves:
						<Tooltip
							hasArrow
							arrowShadowColor='#2B2F35'
							placement='bottom'
							boxShadow='dark-lg'
							label='Click here for protocol metrics.'
							bg='#02010F'
							fontSize={'13px'}
							fontWeight={'400'}
							borderRadius={'lg'}
							padding={'2'}
							color='#F0F0F5'
							border='1px solid'
							borderColor='#23233D'>
							<Text
								color='#B0F1DE'
								ml='3'
								_hover={{ textDecoration: 'underline' }}>
								$
								{numberFormatter(
									protocolReserves?.availableReserves
								)}
							</Text>
						</Tooltip>
					</Box>

					<Box
						className='keen-slider__slide number-slide2 text_nowrap'
						fontSize='sm'
						display='flex'
						alignItems='center'
						_hover={{ textDecoration: 'underline' }}>
						Average Asset Utilisation:
						<Tooltip
							hasArrow
							arrowShadowColor='#2B2F35'
							placement='bottom'
							boxShadow='dark-lg'
							label='Click here for protocol metrics.'
							bg='#02010F'
							fontSize={'13px'}
							fontWeight={'400'}
							borderRadius={'lg'}
							padding={'2'}
							color='#F0F0F5'
							border='1px solid'
							borderColor='#23233D'>
							<Text
								color='#B0F1DE'
								ml='3'
								_hover={{ textDecoration: 'underline' }}>
								{numberFormatterPercentage(
									protocolReserves?.avgAssetUtilisation
								)}
								%
							</Text>
						</Tooltip>
					</Box>
				</HStack>

				{/* <HStack height="100%">
        <Link href={'https://status.hashstack.finance/'} target="_blank">
          <HStack borderLeft="1px solid #2B2F35" h="100%" p="8px 3.9rem">
            <Box>
              <Image
                src="/stableConnectionIcon.svg"
                alt="Picture of the author"
                width={10}
                height={10}
              />
            </Box>
            <Text color="#00D395" fontSize="12px">
              Stable Connection
            </Text>
          </HStack>
        </Link>
      </HStack> */}

				<HStack
					borderLeft='1px solid #2B2F35'
					h='100%'
					mr='auto'>
					<HStack
						borderRight='1px solid #2B2F35'
						h='100%'
						p='8px 2rem'>
						<Menu placement='top'>
							{({ isOpen }) => (
								<>
									<MenuButton>
										<Box
											display='flex'
											alignItems='center'
											gap='2'>
											<Text
												color='#2BC8BF'
												fontSize='12px'>
												Earn
											</Text>

											<Image
												src='/upperarrow.svg'
												alt='Upper arrow'
												width='16'
												height='16'
												style={{
													transform:
														isOpen ?
															'rotate(180deg)'
														:	'rotate(0deg)',
												}}
											/>
										</Box>
									</MenuButton>

									<MenuList
										bgColor='#02010F'
										border='1px'
										borderColor='#34345699'
										p='.5rem'
										display='flex'
										flexDir='column'
										alignItems='center'
										position='relative'
										right='3.3rem'>
										<MenuItem
											_hover={{ color: '#00D395' }}
											fontSize='sm'
											fontWeight='medium'
											display='flex'
											alignItems='center'
											gap='4'
											bgColor='transparent'
											color='#676D9A'
											borderBottom='1px solid #34345699'
											py='3'
											onMouseEnter={() =>
												sethoverCampaigns(true)
											}
											onMouseLeave={() =>
												sethoverCampaigns(false)
											}
											onClick={() => {
												posthog.capture(
													'More Tab Clicked',
													{
														Clicked: true,
													}
												);
												router.push('/v1/campaigns');
											}}>
											<Image
												src={
													hoverCampaigns ?
														'/campaignsIconGreen.svg'
													:	'/campaignsIcon.svg'
												}
												alt='Plus Icon'
												width='24'
												height='24'
											/>
											Campaigns
										</MenuItem>
										<Link
											href='https://hashstack.finance/c2e/'
											target='_blank'
											style={{ marginRight: '1.3rem' }}>
											<MenuItem
												_hover={{ color: '#00D395' }}
												fontSize='sm'
												fontWeight='medium'
												display='flex'
												alignItems='center'
												gap='4'
												bgColor='transparent'
												color='#676D9A'
												py='3'
												onMouseEnter={() =>
													sethoverc2e(true)
												}
												onMouseLeave={() =>
													sethoverc2e(false)
												}>
												<Image
													src={
														hoverc2e ? hoverC2e : (
															'/plusicon.svg'
														)
													}
													alt='Plus Icon'
													width='16'
													height='16'
												/>
												Contribute-2-Earn
											</MenuItem>
										</Link>
									</MenuList>
								</>
							)}
						</Menu>
					</HStack>

					<HStack
						borderRight='1px solid #2B2F35'
						h='100%'
						p='8px 2rem'>
						<Text
							color='#676D9A'
							fontSize='12px'>
							Latest Synced block:
						</Text>
						<Box
							height={'100%'}
							display={'flex'}
							justifyContent={'center'}
							alignItems={'center'}
							gap={1}>
							<Box
								className='pulsatingDot'
								mr='0.2rem'></Box>
							<Box
								color='#2BC8BF'
								fontSize='12px'>
								{currentBlock || (
									<Skeleton
										width='3rem'
										height='0.8rem'
										startColor='#101216'
										endColor='#2B2F35'
										borderRadius='6px'
									/>
								)}
							</Box>
						</Box>
					</HStack>

					<HStack
						display='flex'
						h='100%'
						pl='1rem'>
						<Box
							color='#676D9A'
							fontSize='12px'
							display='flex'
							alignItems='center'>
							Network:
							{chain?.network === 'goerli' ?
								' Starknet Goerli'
							: chain?.network === 'mainnet' ?
								' Starknet Mainnet'
							:	<Skeleton
									width='4rem'
									height='0.8rem'
									startColor='#101216'
									endColor='#2B2F35'
									borderRadius='6px'
									ml={2}
								/>
							}
						</Box>
						<Box
							height={'100%'}
							display={'flex'}
							justifyContent={'center'}
							alignItems={'center'}
							gap={1}>
							<Image
								src='/footerNetwork.svg'
								alt='Picture of the author'
								width='16'
								height='6'
							/>
						</Box>
					</HStack>
				</HStack>
			</Box>
		</HStack>
	);
};

export default Footer;
