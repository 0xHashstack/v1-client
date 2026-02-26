import StakeUnstakeModal from '@/components/modals/StakeUnstakeModal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
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
	const posthog = usePostHog();

	return (
		<Button
			variant='ghost'
			className={cn(
				'px-3 py-4 text-xs rounded-md mb-0',
				render ?
					'cursor-pointer hover:text-[#6e7681]'
					: 'cursor-not-allowed',
				pathname === '/waitlist/' && 'hover:text-white',
				// Highlighting with a red-tinted border for urgency
				'border border-red-500/30 bg-red-500/5 hover:bg-red-500/10'
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
				defaultTab='unstake'
				isUrgent={true}
			/>
		</Button>
	);
}

export default NavbarStake;
