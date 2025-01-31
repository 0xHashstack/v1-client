'use client';

import { Box, HStack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setLanguage } from '@/store/slices/userAccountSlice';
import { languages } from '@/utils/constants/languages';
import arrowNavLeft from '../../../assets/images/arrowNavLeft.svg';
import arrowNavRight from '../../../assets/images/arrowNavRight.svg';
import tickMark from '../../../assets/images/tickMark.svg';

interface NavbarSettingsProps {
	navDropdowns: {
		settingsDropdown: boolean;
		languagesDropdown: boolean;
	};
	language: string;
	onClick: (dropdown: string) => void;
}

const NavbarSettings = ({
	navDropdowns,
	language,
	onClick,
}: NavbarSettingsProps) => {
	const ref1 = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch();

	return (
		<Box
			borderRadius='6px'
			width='fit-content'
			padding='1px'
			cursor='pointer'
			display='flex'
			flexDirection='column'
			alignItems='center'
			justifyContent='center'
			gap='8px'
			flexGrow='1'
			className='button navbar'
			ref={ref1}
			ml='0.4rem'
			userSelect='none'>
			<Box
				display='flex'
				flexDirection='row'
				justifyContent='center'
				alignItems='center'
				className='navbar-button'
				mr='0.5rem'
				onClick={() => {
					onClick('settingsDropdown');
				}}>
				<Image
					src='/settingIcon.svg'
					alt='Picture of the author'
					width='18'
					height='18'
					style={{
						cursor: 'pointer',
					}}
				/>
			</Box>
			{navDropdowns.settingsDropdown && (
				<Box
					mt='3px'
					width='10rem'
					display='flex'
					justifyContent='center'
					flexDirection='column'
					alignItems='flex-start'
					gap='5px'
					padding='0.5rem 0'
					boxShadow='1px 2px 8px rgba(0, 0, 0, 0.5), 4px 8px 24px #010409'
					borderRadius='6px'
					background='var(--Base_surface, #02010F)'
					border='1px solid rgba(103, 109, 154, 0.30)'
					right='0px'
					top='150%'
					className='dropdown-container'>
					<Text
						color='#6e7681'
						fontSize='12px'
						paddingX='8px'>
						General settings
					</Text>
					<HStack
						display='flex'
						justifyContent='space-between'
						alignItems='center'
						width={'100%'}
						paddingX='8px'></HStack>
					<hr
						style={{
							height: '1px',
							borderWidth: '0',
							backgroundColor: '#2B2F35',
							width: '96%',
							marginRight: '5.1px',
						}}
					/>
					<HStack
						display='flex'
						justifyContent='space-around'
						alignItems='center'
						padding='2px 6px'
						gap='1.5rem'>
						<Text
							fontStyle='normal'
							fontWeight='400'
							fontSize='14px'
							lineHeight='20px'>
							Language
						</Text>
						<Text
							fontSize={'12px'}
							display='flex'
							justifyContent='center'
							alignItems='center'
							onClick={() => {
								onClick('languagesDropdown');
							}}>
							{language}
							<Image
								src={arrowNavRight}
								alt='Picture of the author'
								width='16'
								height='16'
								style={{ cursor: 'pointer' }}
							/>
						</Text>
					</HStack>
				</Box>
			)}
			{navDropdowns.languagesDropdown && (
				<Box
					width='16rem'
					display='flex'
					justifyContent='center'
					flexDirection='column'
					alignItems='flex-start'
					gap='15px'
					boxShadow='1px 2px 8px rgba(0, 0, 0, 0.5), 4px 8px 24px #010409'
					borderRadius='6px'
					right='0px'
					top='150%'
					background='var(--Base_surface, #02010F)'
					border='1px solid rgba(103, 109, 154, 0.30)'
					padding='0.7rem 0.6rem'
					pb='1.5rem'
					className='dropdown-container'>
					<Text
						fontSize={'12px'}
						display='flex'
						justifyContent='center'
						alignItems='center'
						onClick={() => {
							onClick('settingsDropdown');
						}}
						gap='8px'
						padding='0.5rem 0.7rem'
						color='#B1B0B5'>
						<Image
							src={arrowNavLeft}
							alt='Picture of the author'
							width='7'
							height='7'
							style={{ cursor: 'pointer' }}
						/>
						Select Language
					</Text>
					{languages.map((val, idx) => (
						<>
							<HStack
								color='#6e7681'
								fontSize='12px'
								paddingX='8px'
								key={idx}
								justifyContent='space-between'
								width='100%'
								onClick={() => {
									if (!val.name.includes('Coming soon'))
										dispatch(setLanguage(`${val.name}`));
								}}>
								<Box
									display={'flex'}
									justifyContent={'flex-start'}
									gap={4}
									alignItems={'center'}>
									<Image
										src={val.icon}
										alt='Picture of the author'
										width='20'
										height='20'
										style={{
											cursor: 'pointer',
										}}
									/>
									<Text>{val.name}</Text>
								</Box>
								{language === val.name && (
									<Image
										src={tickMark}
										alt='Picture of the author'
										width='15'
										height='15'
										style={{
											cursor: 'pointer',
										}}
									/>
								)}
							</HStack>
							<hr
								style={{
									height: '1px',
									borderWidth: '0',
									backgroundColor: '#2B2F35',
									width: '95%',
									marginLeft: '6px',
									color: '#2A2E3F',
									display: `${idx == languages.length - 1 ? 'none' : 'block'}`,
								}}
							/>
						</>
					))}
				</Box>
			)}
		</Box>
	);
};

export default NavbarSettings;
