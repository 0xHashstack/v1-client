import { useState } from 'react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import BellIcon from '@/assets/icons/BellIcon';
import Image from 'next/image';
import Link from 'next/link';
import {
	NAVBAR_NOTIFICATIONS,
	NotificationItem,
} from './constant/navbar.constant';

const NavbarNotifications = () => {
	const [open, setOpen] = useState(false);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='transition-colors'>
					<BellIcon />
				</Button>
			</PopoverTrigger>

			<PopoverContent
				align='end'
				className='w-[390px] p-4 bg-[#02010F] border border-[#676D9A]/30 rounded-md shadow-lg'>
				<div className='flex flex-col gap-4'>
					{/* Header */}
					<div className='flex justify-between items-center'>
						<span className='text-sm font-medium'>
							Notifications
						</span>
						<Button
							variant='ghost'
							size='icon'
							className='w-5 h-5 '
							onClick={() => setOpen(false)}>
							<Image
								src='/cross.svg'
								alt='Close'
								width={20}
								height={20}
								className='cursor-pointer'
							/>
						</Button>
					</div>

					{/* Notification Items */}
					<div className='flex flex-col gap-4'>
						{NAVBAR_NOTIFICATIONS.map((item) => (
							<NotificationItemComponent
								key={item.id}
								item={item}
							/>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

const NotificationItemComponent = ({ item }: { item: NotificationItem }) => (
	<div className='flex gap-3 pb-3 border-b border-[#34345699]'>
		<div className='w-[120px] h-[60px] relative rounded-md overflow-hidden'>
			<Image
				src={item.imageSrc}
				alt={item.altText}
				fill
				className='object-cover'
			/>
		</div>
		<div className='flex flex-col justify-center gap-1'>
			<h3 className='text-base font-bold text-[#BDBFC1]'>{item.title}</h3>
			<p className='text-sm text-[#F0F0F5]'>
				{item.description}
				<Link
					href={item.link.href}
					target={item.link.target}
					className='ml-1 text-[#4D59E8] underline font-semibold'>
					{item.link.text}
				</Link>
			</p>
		</div>
	</div>
);

export default NavbarNotifications;
