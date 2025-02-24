'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLanguage } from '@/store/slices/userAccountSlice';
import { languages } from '@/utils/constants/languages';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import arrowNavRight from '@/assets/images/arrowNavRight.svg';
import tickMark from '@/assets/images/tickMark.svg';

interface NavbarSettingsProps {
	language: string;
}

const NavbarSettings = ({ language }: NavbarSettingsProps) => {
	const dispatch = useDispatch();
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [languagesOpen, setLanguagesOpen] = useState(false);

	const handleLanguageSelect = (name: string) => {
		if (!name.includes('Coming soon')) {
			dispatch(setLanguage(name));
			setLanguagesOpen(false);
			setSettingsOpen(true);
		}
	};

	return (
		<Popover
			open={settingsOpen}
			onOpenChange={setSettingsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='transition-colors'>
					<Image
						src='/settingIcon.svg'
						alt='Settings'
						width={18}
						height={18}
					/>
				</Button>
			</PopoverTrigger>

			<PopoverContent
				align='end'
				className='w-40 p-2 bg-[#02010F] border border-[#676D9A]/30 rounded-md shadow-lg'>
				<div className='flex flex-col gap-2'>
					<span className='text-xs text-[#6e7681] px-2'>
						General settings
					</span>
					<hr className='border-[#2B2F35]' />

					<Popover
						open={languagesOpen}
						onOpenChange={setLanguagesOpen}>
						<PopoverTrigger asChild>
							<Button
								variant='ghost'
								className='w-full h-8 justify-between px-2 text-sm hover:bg-gray-800'>
								{language}
								<Image
									src={arrowNavRight}
									alt='Select Language'
									width={16}
									height={16}
								/>
							</Button>
						</PopoverTrigger>

						<PopoverContent
							align='start'
							className='w-64 p-2 bg-[#02010F] border border-[#676D9A]/30 rounded-md shadow-lg'>
							<div className='flex flex-col gap-2'>
								<Button
									variant='ghost'
									className='w-full h-8 justify-start gap-2 px-2 text-sm text-[#B1B0B5] hover:bg-gray-800'
									onClick={() => {
										setLanguagesOpen(false);
										setSettingsOpen(true);
									}}>
									<Image
										src='/arrowNavLeft.svg'
										alt='Back'
										width={7}
										height={7}
									/>
									Select Language
								</Button>

								{languages.map((val) => (
									<div
										key={val.name}
										className='flex flex-col'>
										<Button
											variant='ghost'
											className='w-full h-10 justify-between px-2 text-sm hover:bg-gray-800'
											onClick={() =>
												handleLanguageSelect(val.name)
											}>
											<div className='flex items-center gap-2'>
												<Image
													src={val.icon}
													alt={val.name}
													width={20}
													height={20}
												/>
												<span>{val.name}</span>
											</div>
											{language === val.name && (
												<Image
													src={tickMark}
													alt='Selected'
													width={15}
													height={15}
												/>
											)}
										</Button>
										{val.name !==
											languages[languages.length - 1]
												.name && (
											<hr className='border-[#2B2F35]' />
										)}
									</div>
								))}
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default NavbarSettings;
