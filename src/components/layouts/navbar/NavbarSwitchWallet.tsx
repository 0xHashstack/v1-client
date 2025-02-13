import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { resetState } from '@/store/slices/readDataSlice';
import { setAccountReset } from '@/store/slices/userAccountSlice';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function NavbarSwitchWallet({ domainName }: { domainName: string }) {
	const [open, setOpen] = useState(false);
	const { account } = useAccount();
	const router = useRouter();
	const { disconnect } = useDisconnect();
	const { connect, connectors } = useConnect();
	const [localDropdown, setLocalDropdown] = useState(false);

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
		setAccountReset(null);
		(typeof window !== 'undefined' ?
			window.localStorage
		:	null
		)?.removeItem('lastUsedConnector');
		(typeof window !== 'undefined' ?
			window.localStorage
		:	null
		)?.removeItem('connected');
		router.push('/');
		setOpen(false);
	};

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					className='flex items-center gap-2 border border-[#676D9A] rounded-md py-1.5 px-4 h-8 hover:bg-gray-800 transition-colors bg-transparent'>
					{account ?
						<>
							<Image
								src='/starknetLogoBordered.svg'
								alt='Wallet'
								width={16}
								height={16}
								className='shrink-0'
							/>
							<span className='text-sm font-medium text-white truncate max-w-[120px]'>
								{domainName ||
									`${account.address.slice(0, 3)}...${account.address.slice(-3)}`}
							</span>
							<Image
								src='/connectWalletArrowDown.svg'
								alt='Dropdown'
								width={16}
								height={16}
								className={`transform transition-transform ${open ? 'rotate-180' : ''}`}
							/>
						</>
					:	<Skeleton className='w-28 h-full rounded-sm bg-gray-700' />
					}
				</Button>
			</PopoverTrigger>

			<PopoverContent
				align='end'
				className='w-48 p-1 bg-[#02010F] text-white border border-[#676D9A]/30 rounded-md shadow-lg'>
				<div className='flex flex-col gap-1'>
					{account ?
						<>
							<Button
								variant='ghost'
								onClick={handleDisconnect}
								className='justify-end text-red-400 hover:text-red-500'>
								Disconnect
							</Button>
							<Button
								variant='ghost'
								onClick={switchWallet}
								className='justify-end '>
								Switch Wallet
							</Button>
						</>
					:	<Button
							variant='ghost'
							onClick={() =>
								connect({ connector: connectors[0] })
							}
							className='justify-end '>
							Connect Wallet
						</Button>
					}
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default NavbarSwitchWallet;
