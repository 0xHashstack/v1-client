'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import StakeUnstakeModal from '@/components/modals/StakeUnstakeModal';
import GetTokensModal from '@/components/modals/getTokens';
import posthog from 'posthog-js';
import hoverDashboardIcon from '../../../assets/images/hoverDashboardIcon.svg';
import { useNavbar } from './useNavbar';
import NavbarSettings from './NavbarSettings';
import NavbarNotifications from './NavbarNotifications';
import NavbarSwitchWallet from './NavbarSwitchWallet';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { Drawer } from '@/components/ui/drawer/Drawer';
import { isMainnet } from '@/constants/config.constant';
import MobileMenu from './MobileMenu';
import NavbarStake from './NavbarStake';

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
		connect,
		disconnect,
		dispatch,
		router,
		connectors,
		setNavDropdown,
		resetState,
		setAccountReset,
	} = useNavbar(validRTokens);

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const NavigationItems = () => (
		<div className='flex flex-col md:flex-row gap-4 p-4 md:p-0 justify-between w-full'>
			<div className='flex flex-col md:flex-row'>
				<Button
					variant='ghost'
					className={cn(
						'px-3 py-4 text-sm rounded-md mb-0',
						(
							pathname !== '/v1/campaigns' &&
								pathname !== '/v1/referral'
						) ?
							'text-[#00D395]'
						:	'text-[#676D9A]'
					)}
					onClick={() => {
						if (pathname != '/waitlist') {
							router.push('/v1/market');
							setIsDrawerOpen(false);
						}
					}}>
					<div className='flex justify-between items-center gap-2'>
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
						<span className='text-sm'>Markets</span>
					</div>
				</Button>

				<NavbarStake
					render={Render}
					validRTokens={validRTokens}
				/>
				{!isMainnet && (
					<GetTokensModal
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
				)}
			</div>

			<div className='flex flex-col md:flex-row'>
				<NavbarSwitchWallet domainName={domainName} />
				<NavbarNotifications />
				<NavbarSettings language={language} />
			</div>
		</div>
	);

	return (
		<nav className='z-100 pt-1 bg-[rgba(103,109,154,0.10)] w-screen shadow-[0_15px_25px_rgba(0,0,0,0.15),0_5px_10px_rgba(0,0,0,0.05)] flex justify-between items-center text-white h-[3.8125rem] px-2 navbar'>
			<div className='flex justify-start items-center gap-1 ml-8'>
				<Link
					href={
						pathname != '/v1/waitlist' ? '/v1/market' : (
							'/v1/waitlist'
						)
					}>
					<div className='h-full flex items-center min-w-[140px] mr-[1.4em]'>
						<Image
							src='/hashstackLogo.svg'
							alt='Navbar Logo'
							height='32'
							width='140'
						/>
					</div>
				</Link>
			</div>

			{/* Desktop Navigation */}
			<div className='hidden md:flex justify-end items-center flex-1'>
				<NavigationItems />
			</div>

			{/* Mobile Navigation */}
			<div className='md:hidden'>
				<Button
					variant='ghost'
					onClick={() => setIsDrawerOpen(true)}>
					<Menu className='h-6 w-6' />
				</Button>

				<Drawer
					isOpen={isDrawerOpen}
					onClose={() => setIsDrawerOpen(false)}
					position='right'>
					<MobileMenu onClose={() => setIsDrawerOpen(false)} />
				</Drawer>
			</div>
		</nav>
	);
};

export default memo(Navbar);
