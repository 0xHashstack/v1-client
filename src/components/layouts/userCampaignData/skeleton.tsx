import { Skeleton } from '@/components/ui/skeleton';

export const UserCampaignDataSkeleton = () => {
	return (
		<div className='w-full space-y-4 p-4'>
			<div className='flex items-center justify-between'>
				<Skeleton className='h-8 w-[200px]' />
				<Skeleton className='h-8 w-[100px]' />
			</div>

			<div className='space-y-3'>
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className='flex items-center justify-between p-4 border border-gray-800 rounded-lg'>
						<div className='space-y-2'>
							<Skeleton className='h-4 w-[150px]' />
							<Skeleton className='h-4 w-[100px]' />
						</div>
						<Skeleton className='h-8 w-[120px]' />
					</div>
				))}
			</div>
		</div>
	);
};
