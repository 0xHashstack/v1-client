import BellIcon from '@/assets/icons/BellIcon';
import { Box, Link as ChakraLink, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useState } from 'react';

const NavbarNotifications = () => {
	const [showNotifications, setShowNotifications] = useState(false);

	return (
		<>
			<Box
				ml='0.5rem'
				cursor='pointer'
				onClick={() => {
					setShowNotifications(!showNotifications);
				}}>
				<BellIcon />
			</Box>
			{showNotifications && (
				<Box
					width='390px'
					mr='8rem'
					mt='-1.1rem'
					display='flex'
					justifyContent='center'
					flexDirection='column'
					gap='18px'
					padding='0.7rem 1rem'
					boxShadow='1px 2px 8px rgba(0, 0, 0, 0.5), 4px 8px 24px #010409'
					borderRadius='6px'
					background='var(--Base_surface, #02010F)'
					border='1px solid rgba(103, 109, 154, 0.30)'
					className='dropdown-container'
					userSelect='none'>
					<Box
						display='flex'
						gap='0.5rem'
						w='full'
						justifyContent='space-between'>
						<Text fontSize='12px'>Notifications</Text>
						<Image
							style={{ cursor: 'pointer' }}
							src={'/cross.svg'}
							alt='Arrow Navigation Left'
							width='20'
							height='20'
						/>
					</Box>

					<Box
						display='flex'
						flexDirection='column'
						gap='1rem'>
						<Box
							display='flex'
							pb='0.8rem'
							gap='0.8rem'
							alignItems='center'
							borderBottom='1px solid #34345699'>
							<Box
								width='120px'
								height='60px'
								position='relative'>
								<Image
									src='/defi_spring_noti_banner.svg'
									alt='Degen Mode'
									fill
									objectFit='cover'
									style={{ borderRadius: '6px' }}
								/>
							</Box>
							<Box
								display='flex'
								flexDir='column'
								justifyContent='center'
								alignItems='start'
								height='full'
								gap='1'>
								<Text
									fontSize='16px'
									lineHeight='5'
									fontWeight='bold'
									color='#BDBFC1'>
									Starknet DeFi Spring <br /> is Live!
								</Text>
								<Text
									fontSize='12px'
									lineHeight='18px'
									color='F0F0F5'
									whiteSpace='nowrap'>
									Earn $STRK tokens
									<ChakraLink
										href='https://hashstack.medium.com/farm-strk-token-on-hashstack-v1-e2287d6f94f9'
										target='_blank'
										textDecoration='underline'
										color='#4D59E8'
										fontSize='12px'
										fontWeight='semibold'
										cursor='pointer'
										ml='1'>
										Learn more
									</ChakraLink>
								</Text>
							</Box>
						</Box>

						<Box
							display='flex'
							pb='0.8rem'
							gap='0.8rem'
							borderBottom='1px solid #34345699'>
							<Box
								width='120px'
								height='60px'
								position='relative'>
								<Image
									src='/degen_banner.svg'
									alt='Degen Mode'
									fill
									objectFit='cover'
									style={{ borderRadius: '6px' }}
								/>
							</Box>
							<Box
								display='flex'
								flexDir='column'
								justifyContent='center'
								alignItems='start'
								height='full'
								gap='1'>
								<Text
									fontSize='16px'
									lineHeight='5'
									fontWeight='bold'
									color='#BDBFC1'>
									Hashstack Degen Mode <br /> Is Live!
								</Text>
								<Text
									fontSize='12px'
									lineHeight='18px'
									color='F0F0F5'>
									Earn $STRK tokens
									<ChakraLink
										href='https://app.hashstack.finance/v1/degen/'
										textDecoration='underline'
										color='#4D59E8'
										fontSize='12px'
										fontWeight='semibold'
										cursor='pointer'
										ml='1'>
										Explore
									</ChakraLink>
								</Text>
							</Box>
						</Box>

						<Box
							display='flex'
							gap='0.8rem'
							pb='0.2rem'>
							<Box
								width='120px'
								height='60px'
								position='relative'>
								<Image
									src='/ccp_noti_banner.svg'
									alt='Degen Mode'
									fill
									objectFit='cover'
									style={{ borderRadius: '6px' }}
								/>
							</Box>
							<Box
								display='flex'
								flexDir='column'
								justifyContent='center'
								alignItems='start'
								height='full'
								gap='1'>
								<Text
									fontSize='16px'
									lineHeight='5'
									fontWeight='bold'
									color='#BDBFC1'>
									Content Creators <br /> Program
								</Text>
								<Text
									fontSize='12px'
									lineHeight='18px'
									color='F0F0F5'>
									Create content and
									<ChakraLink
										href='https://app.hashstack.finance/v1/campaigns/'
										textDecoration='underline'
										color='#4D59E8'
										fontSize='12px'
										fontWeight='semibold'
										cursor='pointer'
										ml='1'>
										Earn Points
									</ChakraLink>
								</Text>
							</Box>
						</Box>
					</Box>
				</Box>
			)}
		</>
	);
};

export default NavbarNotifications;
