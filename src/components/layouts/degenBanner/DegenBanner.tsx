'use client';
import Image from 'next/image';
import React from 'react';

interface DegenBannerProps {}

const DegenBanner: React.FC<DegenBannerProps> = () => {
	return (
		<>
			<div className='relative w-full mt-0 mb-8 px-8 py-5 z-[1]'>
				<Image
					src='/degen_mode_banner.svg'
					alt='Degen Mode Banner'
					fill
					style={{ objectFit: 'cover', borderRadius: '8px' }}
				/>
				<div className='flex md:flex-row flex-col gap-6 md:gap-4 items-center relative z-10 justify-between'>
					<div className='w-full mt-0.4 ml-0.4 md:max-w-[25rem] xl:max-w-[30rem] 2xl:max-w-[40rem]'>
						<div className='text-[#E6EDF3] text-[2.1rem] flex items-center gap-2 font-semibold'>
							What Is Degen mode?
						</div>
						<div>
							<p className='text-[#E6EDF3] w-full pt-2 max-w-[1350px]:text-[0.8rem] text-base tracking-[-0.15px] leading-5'>
								These are the tailored strategies based on your
								supplied assets. The protocol provides a default
								leverage of 5x, which can be reduced by
								increasing the collateral. With this 1-click
								feature, provide the amount and collateral, and
								the protocol executes your chosen strategy,
								making your capital efficient.
							</p>
						</div>
					</div>
					<div className='w-full md:w-auto'>
						<Image
							src='/degen_mode_banner2.svg'
							alt='Degen Mode Banner'
							width={765}
							height={129}
							className='w-full lg:w-full h-auto object-cover rounded-lg'
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default DegenBanner;
