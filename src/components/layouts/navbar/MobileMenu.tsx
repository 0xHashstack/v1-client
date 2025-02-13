import { Button } from '@/components/ui/button';
import StakeUnstakeModal from '@/components/modals/StakeUnstakeModal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { LogOut, X } from 'lucide-react';
import posthog from 'posthog-js';
import hoverDashboardIcon from '../../../assets/images/hoverDashboardIcon.svg';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { setAccountReset } from '@/store/slices/userAccountSlice';
import { useDispatch } from 'react-redux';

interface MobileMenuProps {
	onClose: () => void;
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { account } = useAccount();
	const [stakeHover, setStakeHover] = useState(false);
	const { disconnect } = useDisconnect();
	const { connect, connectors } = useConnect();
	const dispatch = useDispatch();

	const switchWallet = () => {
		const targetConnector = connectors.find((c) =>
			connectors[0]?.id === 'braavos' ? 'argentX' : 'braavos'
		);

		if (targetConnector) {
			disconnect();
			connect({ connector: targetConnector });
			router.push('/v1/market');
		}
	};

	const handleDisconnect = () => {
		disconnect();
		dispatch(setAccountReset(null));
		(typeof window !== 'undefined' ?
			window.localStorage
		:	null
		)?.removeItem('lastUsedConnector');
		(typeof window !== 'undefined' ?
			window.localStorage
		:	null
		)?.removeItem('connected');
		router.push('/');
		onClose();
	};

	return (
		<div className='flex flex-col p-4 h-full bg-black'>
			<div className='flex flex-col gap-4'>
				{/* Connected Wallet Display */}
				{account?.address && (
					<div className='p-4 rounded-lg bg-[#676D9A]/10'>
						<div className='text-sm text-[#676D9A] mb-1'>
							Connected Wallet
						</div>
						<div className='text-sm font-medium text-[#00D395]'>
							{account.address.slice(0, 6)}...
							{account.address.slice(-4)}
						</div>
					</div>
				)}

				{/* Markets Button */}
				<Button
					variant='ghost'
					className={cn(
						'px-3 py-4 text-sm rounded-md mb-0 justify-start',
						(
							pathname !== '/v1/campaigns/' &&
								pathname !== '/v1/referral/'
						) ?
							'text-[#00D395]'
						:	'text-[#676D9A]'
					)}
					onClick={() => {
						if (pathname != '/waitlist') {
							router.push('/v1/market');
							onClose();
						}
					}}>
					<div className='flex items-center gap-2'>
						{(
							pathname == '/v1/campaigns/' ||
							pathname == '/v1/referral/'
						) ?
							<Image
								src={hoverDashboardIcon}
								alt='Markets icon'
								width='16'
								height='16'
								style={{ cursor: 'pointer' }}
							/>
						:	<Image
								src={'/dashboardIcon.svg'}
								alt='Markets icon'
								width='16'
								height='16'
								style={{ cursor: 'pointer' }}
							/>
						}
						<span className='text-sm'>Markets</span>
					</div>
				</Button>

				{/* Stake Button */}
				<Button
					variant='ghost'
					className='px-3 py-4 text-sm rounded-md mb-0 justify-start'
					onClick={() => {
						posthog.capture('Stake Button Clicked Mobile', {
							Clicked: true,
						});
					}}>
					<StakeUnstakeModal
						coin={[]}
						isCorrectNetwork={true}
						nav={true}
						stakeHover={stakeHover}
						setStakeHover={setStakeHover}
						validRTokens={[]}
						hideTopMargin={true}
					/>
				</Button>

				{/* Switch Wallet Button */}
				{account?.address && (
					<Button
						variant='ghost'
						className='px-3 py-4 text-sm rounded-md mb-0 justify-start text-[#676D9A] hover:text-white'
						onClick={switchWallet}>
						<div className='flex items-center gap-2'>
							<LogOut className='h-4 w-4 rotate-90' />
							<span>Switch Wallet</span>
						</div>
					</Button>
				)}

				{/* Disconnect Button */}
				{account?.address && (
					<Button
						variant='ghost'
						className='px-3 py-4 text-sm rounded-md mb-0 justify-start text-[#676D9A] hover:text-white'
						onClick={handleDisconnect}>
						<div className='flex items-center gap-2'>
							<LogOut className='h-4 w-4' />
							<span>Disconnect</span>
						</div>
					</Button>
				)}

				{/* Close Button */}
				<div className='mt-auto pt-4 border-t border-[#676D9A]/20'>
					<Button
						variant='ghost'
						className='px-3 py-4 text-sm rounded-md mb-0 justify-start text-[#676D9A] hover:text-white w-full'
						onClick={onClose}>
						<div className='flex items-center gap-2'>
							<X className='h-4 w-4' />
							<span>Close Menu</span>
						</div>
					</Button>
				</div>
			</div>
		</div>
	);
}
