'use client';
import { Link as ChakraLink } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

import BellIcon from '@/assets/icons/BellIcon';
import StakeUnstakeModal from '@/components/modals/StakeUnstakeModal';
import GetTokensModal from '@/components/modals/getTokens';
import { Box, HStack, Skeleton, Text } from '@chakra-ui/react';
import posthog from 'posthog-js';
import hoverDashboardIcon from '../../../assets/images/hoverDashboardIcon.svg';
import { Coins } from '../dashboardLeft';
import { useNavbar } from './useNavbar';
import NavbarSettings from './NavbarSettings';
import NavbarNotifications from './NavbarNotifications';

const Navbar = ({ validRTokens }: any) => {
	const {
		navDropdowns,
		language,
		account,
		domainName,
		stakeHover,
		Render,
		pathname,

		setStakeHover,
		switchWallet,
		connect,
		disconnect,
		dispatch,
		router,
		connectors,
		setNavDropdown,
		resetState,
		setAccountReset,
	} = useNavbar(validRTokens);

	return (
		<HStack
			zIndex='100'
			pt={'4px'}
			background='var(--surface-of-10, rgba(103, 109, 154, 0.10))'
			width='100vw'
			boxShadow='rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px'
			display='flex'
			justifyContent='space-between'
			alignItems='center'
			color='#FFF'
			height='3.8125rem'
			px='.5rem'
			className='navbar'>
			<HStack
				display='flex'
				justifyContent={'flex-start'}
				alignItems='center'
				width='60%'
				gap={'4px'}
				marginLeft='2rem'>
				<Link
					href={
						pathname != '/v1/waitlist' ? '/v1/market' : (
							'/v1/waitlist'
						)
					}>
					<Box
						height='100%'
						display='flex'
						alignItems='center'
						minWidth={'140px'}
						marginRight='1.4em'>
						<Image
							src='/hashstackLogo.svg'
							alt='Navbar Logo'
							height='32'
							width='140'
						/>
					</Box>
				</Link>

				<Box
					padding='16px 12px'
					fontSize='14px'
					borderRadius='5px'
					cursor='pointer'
					marginBottom='0px'
					className='button'
					color={
						(
							pathname !== '/v1/campaigns' &&
							pathname !== '/v1/referral'
						) ?
							'#00D395'
						:	'#676D9A'
					}
					onClick={() => {
						if (pathname != '/waitlist') {
							router.push('/v1/market');
						}
					}}>
					<Box
						display='flex'
						justifyContent='space-between'
						alignItems='center'
						gap={'8px'}>
						{(
							pathname == '/v1/campaigns' ||
							pathname == '/v1/referral'
						) ?
							<Image
								src={hoverDashboardIcon}
								alt='Picture of the author'
								width='16'
								height='16'
								style={{ cursor: 'pointer' }}
							/>
						:	<Image
								src={'/dashboardIcon.svg'}
								alt='Picture of the author'
								width='16'
								height='16'
								style={{ cursor: 'pointer' }}
							/>
						}

						<Text fontSize='14px'>Markets</Text>
					</Box>
				</Box>

				{
					<Box
						padding='16px 12px'
						fontSize='12px'
						borderRadius='5px'
						cursor={Render ? 'pointer' : 'not-allowed'}
						marginBottom='0px'
						_hover={{
							color: `${pathname != '/waitlist' ? '#6e7681' : ''}`,
						}}
						onMouseEnter={() => setStakeHover(true)}
						onMouseLeave={() => setStakeHover(false)}
						onClick={() => {
							posthog.capture('Stake Button Clicked Navbar', {
								Clicked: true,
							});
						}}>
						<StakeUnstakeModal
							coin={Coins}
							isCorrectNetwork={Render}
							nav={true}
							stakeHover={stakeHover}
							setStakeHover={setStakeHover}
							validRTokens={validRTokens}
						/>
					</Box>
				}

				{/* {process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' ? (
          <Box
            padding="16px 12px"
            fontSize="12px"
            borderRadius="5px"
            cursor="pointer"
            marginBottom="0px"
            color={`${pathname == '/v1/campaigns' ? '#00D395' : '#676D9A'}`}
            onMouseEnter={() => setCampaignHover(true)}
            onMouseLeave={() => setCampaignHover(false)}
            onClick={() => {
              posthog.capture('More Tab Clicked', {
                Clicked: true,
              })
              router.push('/v1/campaigns')
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap={'8px'}
            >
              {pathname == '/v1/campaigns' ? (
                <Image
                  src={hoverContributeEarnIcon}
                  alt="Picture of the author"
                  width="16"
                  height="16"
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <Image
                  src={'/contributeEarnIcon.svg'}
                  alt="Picture of the author"
                  width="16"
                  height="16"
                  style={{ cursor: 'pointer' }}
                />
              )}

              <Text fontSize="14px">More</Text>
            </Box>
          </Box>
        ) : (
          ''
        )} */}
			</HStack>

			<HStack
				width='50%'
				display='flex'
				justifyContent='flex-end'
				alignItems='center'>
				<HStack
					display='flex'
					gap='8px'
					justifyContent='center'
					alignItems='center'
					marginRight='1.2rem'>
					{process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' ?
						''
					:	<GetTokensModal
							buttonText='Get Tokens'
							height={'2rem'}
							fontSize={'14px'}
							lineHeight='14px'
							padding='6px 12px'
							border='1px solid #676D9A'
							bgColor='transparent'
							_hover={{ bg: 'white', color: 'black' }}
							borderRadius={'6px'}
							color='#E6EDF3'
							backGroundOverLay='rgba(244, 242, 255, 0.5)'
						/>
					}
					<Box
						fontSize='12px'
						color='#FFF'
						height='2rem'
						cursor='pointer'
						display='flex'
						flexDirection='column'
						alignItems='center'
						justifyContent='center'
						gap='1px'
						flexGrow='1'
						className='button navbar'>
						<Box
							display='flex'
							border='1px solid #676D9A'
							borderRadius='6px'
							flexDirection='row'
							paddingY='6px'
							pr='2.2rem'
							pl='1rem'
							justifyContent='flex-start'
							alignItems='center'
							width='100%'
							height='100%'
							className='navbar-button'
							onClick={() => {
								dispatch(
									setNavDropdown('walletConnectionDropdown')
								);
							}}>
							{account ?
								<Box
									width='100%'
									display='flex'
									justifyContent='flex-start'
									alignItems='center'
									gap={2.5}>
									<Image
										alt=''
										src={'/starknetLogoBordered.svg'}
										width='16'
										height='16'
										style={{ cursor: 'pointer' }}
									/>
									<Text
										fontSize='14px'
										fontWeight='500'
										color='#FFFFFF'
										lineHeight='20px'
										display='flex'
										justifyContent='center'
										alignItems='center'>
										{domainName ?
											domainName
										:	`${account.address.substring(
												0,
												3
											)}...${account.address.substring(
												account.address.length - 9,
												account.address.length
											)}`
										}
									</Text>
								</Box>
							:	<Skeleton
									width='7rem'
									height='100%'
									borderRadius='2px'
								/>
							}
							<Box
								position='absolute'
								right='0.7rem'>
								{!navDropdowns.walletConnectionDropdown ?
									<Image
										src={'/connectWalletArrowDown.svg'}
										alt='arrow'
										width='16'
										height='16'
										style={{
											cursor: 'pointer',
										}}
									/>
								:	<Image
										src={'/connectWalletArrowDown.svg'}
										alt='arrow'
										width='16'
										height='16'
										style={{
											cursor: 'pointer',
										}}
									/>
								}
							</Box>
						</Box>
						{navDropdowns.walletConnectionDropdown && (
							<Box
								width='100%'
								display='flex'
								justifyContent='center'
								flexDirection='column'
								alignItems='flex-end'
								gap='7px'
								padding='0.5rem 0'
								boxShadow='1px 2px 8px rgba(0, 0, 0, 0.5), 4px 8px 24px #010409'
								borderRadius='6px'
								background='var(--Base_surface, #02010F)'
								border='1px solid rgba(103, 109, 154, 0.30)'
								className='dropdown-container'>
								{account ?
									<>
										<Box
											padding='4px 11px'
											marginRight='8px'
											borderRadius='6px'
											background='var(--surface-of-10, rgba(103, 109, 154, 0.10))'
											border='1px solid #2B2F35'
											onClick={() => {
												dispatch(resetState(null));
												dispatch(setAccountReset(null));
												localStorage.setItem(
													'lastUsedConnector',
													''
												);
												localStorage.setItem(
													'connected',
													''
												);
												dispatch(setNavDropdown(''));
												router.push('./');
												disconnect();
											}}>
											Disconnect
										</Box>
										<Box
											padding='4px 11px'
											marginRight='8px'
											borderRadius='6px'
											border='1px solid #2B2F35'
											background='var(--surface-of-10, rgba(103, 109, 154, 0.10))'
											onClick={() => {
												dispatch(setNavDropdown(''));
												switchWallet();
											}}>
											Switch Wallet
										</Box>
									</>
								:	<Box
										padding='4px 11px'
										marginRight='8px'
										borderRadius='6px'
										border='1px solid #2B2F35'
										background='var(--surface-of-10, rgba(103, 109, 154, 0.10))'
										onClick={() => {
											if (
												connectors[0]?.id == 'braavos'
											) {
												disconnect();
												connectors.map(
													(connector: any) => {
														if (
															connector.id ==
															'braavos'
														) {
															connect(connector);
														}
													}
												);
											} else {
												disconnect();
												connectors.map(
													(connector: any) => {
														if (
															connector.id ==
															'argentX'
														) {
															connect({
																connector,
															});
														}
													}
												);
											}
										}}>
										Connect
									</Box>
								}
							</Box>
						)}
					</Box>

					<NavbarNotifications />

					<NavbarSettings
						navDropdowns={navDropdowns}
						language={language}
						onClick={(dropdown: string) =>
							dispatch(setNavDropdown(dropdown))
						}
					/>
				</HStack>
			</HStack>
		</HStack>
	);
};

export default memo(Navbar);
