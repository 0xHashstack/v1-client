import React from 'react';
import { HStack, VStack, Text, Box, Skeleton, Tooltip } from '@chakra-ui/react';
import Image from 'next/image';
import numberFormatter from '@/utils/functions/numberFormatter';
import { usePathname, useRouter } from 'next/navigation';
import InfoIcon from '@/assets/icons/infoIcon';
const Stats = ({
	header,
	onclick,
	statsData,
	arrowHide,
}: {
	header: string[];
	statsData: Object;
	onclick: () => void;
	arrowHide: boolean;
}) => {
	const gap: number = 100 / (header.length + 1);
	const router = useRouter();
	const pathname = usePathname();
	const keys = Object.keys(statsData);
	return (
		<HStack
			w='49%'
			h='100%'
			display='flex'
			alignItems='center'
			justifyContent='space-between'
			background='var(--surface-of-10, rgba(103, 109, 154, 0.10))'
			color='#e6edf3'
			paddingLeft='2.2rem'
			boxShadow='px 2px 8px rgba(0, 0, 0, 0.5), 4px 8px 24px #010409'
			border=' 1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
			borderRadius='8px'
			//   minW="600px"
			//   flexGrow={1}
			//   marginBottom="3resm"
		>
			{Object?.entries(statsData).map(([key, value], idx) => {
				const isLast = idx === keys.length - 1;
				return (
					<VStack
						key={key}
						h='100%'
						w={`${gap}%`}
						justifyContent='center'
						alignItems='flex-start'
						// backgroundColor={"red"}
					>
						<Box display='flex'>
							<Text
								color='#CBCBD1'
								fontSize={14}>
								{header[idx]}
							</Text>
							{header[idx] === 'Net APR' && (
								<Box
									mt='0.1rem'
									ml='0.3rem'>
									<Tooltip
										hasArrow
										arrowShadowColor='#2B2F35'
										placement='right'
										boxShadow='dark-lg'
										label={
											'Net APR is the combined effect of all supply and borrow poistions on collateral, including incentives.'
										}
										bg='#02010F'
										fontSize={'13px'}
										fontWeight={'400'}
										borderRadius={'lg'}
										padding={'2'}
										color='#F0F0F5'
										border='1px solid'
										borderColor='#23233D'>
										<svg
											width='16'
											height='16'
											viewBox='0 0 16 16'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'>
											<path
												d='M8.00001 8.00001L8.00001 11.2M8.00001 5.62813V5.60001M1.60001 8.00001C1.60001 4.46538 4.46538 1.60001 8.00001 1.60001C11.5346 1.60001 14.4 4.46538 14.4 8.00001C14.4 11.5346 11.5346 14.4 8.00001 14.4C4.46538 14.4 1.60001 11.5346 1.60001 8.00001Z'
												stroke='#CBCBD1'
												stroke-linecap='round'
												stroke-linejoin='round'
											/>
										</svg>
									</Tooltip>
								</Box>
							)}
						</Box>
						<Box
							color='#E6EDF3'
							fontSize='20px'>
							{value == null ?
								<Skeleton
									width='6rem'
									height='1.9rem'
									startColor='#101216'
									endColor='#2B2F35'
									borderRadius='6px'
								/>
							: (
								header[idx] == 'Net APR' ||
								header[idx] == 'Avg. Asset Utillization'
							) ?
								<Box
									color={
										header[idx] == 'Net APR' ?
											value > 0 ?
												'#00D395'
											: value < 0 ?
												'rgb(255 94 94)'
											:	'#e6edf3'
										:	'#e6edf3'
									}
									fontSize='20px'>
									{value !== null ?
										value ?
											`${value}%`
										:	'NA'
									:	<Skeleton
											width='6rem'
											height='1.9rem'
											startColor='#101216'
											endColor='#2B2F35'
											borderRadius='6px'
										/>
									}
								</Box>
							:	<Box
									color='#e6edf3'
									fontSize='20px'>
									<Tooltip
										hasArrow
										arrowShadowColor='#2B2F35'
										placement='right'
										boxShadow='dark-lg'
										label={
											value ?
												pathname != '/v1/referral/' ?
													'$' + value.toFixed(2)
												: !isLast ?
													value
												:	value.toFixed(2)
											:	''
										}
										bg='#02010F'
										fontSize={'13px'}
										fontWeight={'400'}
										borderRadius={'lg'}
										padding={'2'}
										color='#F0F0F5'
										border='1px solid'
										borderColor='#23233D'>
										{value !== null ?
											value ?
												pathname != '/v1/referral/' ?
													'$' + numberFormatter(value)
												: !isLast ?
													value
												:	numberFormatter(value)
											:	'NA'
										:	<Skeleton
												width='6rem'
												height='1.9rem'
												startColor='#101216'
												endColor='#2B2F35'
												borderRadius='6px'
											/>
										}
									</Tooltip>
								</Box>
							}
						</Box>
					</VStack>
				);
			})}
			<Box
				// w={`${gap / 2}%`}
				display={arrowHide ? 'none' : 'flex'}
				justifyContent='flex-end'
				paddingRight={2}
				onClick={onclick}>
				<Image
					src='/statsIcon.svg'
					alt='Navbar Logo'
					style={{
						marginRight: '24px',
						cursor: 'pointer',
						zIndex: '2',
					}}
					height={24}
					width={24}
					// onClick={() => {
					//   toggleCustom("8");
					// }}
				/>
			</Box>
		</HStack>
	);
};

export default Stats;
