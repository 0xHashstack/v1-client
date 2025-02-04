import StakeUnstakeModal from '@/components/modals/StakeUnstakeModal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import posthog from 'posthog-js';
import React from 'react';
import { Coins } from '../strkDashboard';

function NavbarStake({
	render,
	validRTokens,
}: {
	render: boolean;
	validRTokens: string[];
}) {
	const [stakeHover, setStakeHover] = React.useState(false);
	const pathname = usePathname();
	return (
		<Button
			variant='ghost'
			className={cn(
				'px-3 py-4 text-xs rounded-md mb-0',
				render ?
					'cursor-pointer hover:text-[#6e7681]'
				:	'cursor-not-allowed',
				pathname === '/waitlist/' && 'hover:text-white'
			)}
			onMouseEnter={() => setStakeHover(true)}
			onMouseLeave={() => setStakeHover(false)}
			onClick={() => {
				posthog.capture('Stake Button Clicked Navbar', {
					Clicked: true,
				});
			}}>
			<StakeUnstakeModal
				coin={Coins}
				isCorrectNetwork={render}
				nav={true}
				stakeHover={stakeHover}
				setStakeHover={setStakeHover}
				validRTokens={validRTokens}
			/>
		</Button>
	);
}

export default NavbarStake;
