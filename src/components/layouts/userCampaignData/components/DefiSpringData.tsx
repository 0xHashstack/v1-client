import { DefiRound } from '@/types/web3.types';
import numberFormatter from '@/utils/functions/numberFormatter';
import { Box, Td, Text, Tooltip, Tr } from '@chakra-ui/react';
import { formatDate } from '@/utils/functions/dateFormatter';
import { ChevronDownCircle, ChevronUpCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface DefiSpringDataProps {
	idx: number;
	campaignDetails: any[];
	totalStrkRewards: number;
	strkRewards: number;
	dataRoundwiseAlloc: DefiRound[];

	ccpDropdownSelected: boolean;
	ccpUserData: any[];
	defiSpringDropdownSelected: boolean;
	setdefiSpringDropdownSelected: (value: boolean) => void;
	handleClaimStrk: () => void;
	isEpochOpen: (idx: number) => boolean;
	nextClaimableDate: string;
}

function DefiSpringData({
	idx,
	campaignDetails,
	totalStrkRewards,
	strkRewards,
	dataRoundwiseAlloc,
	ccpDropdownSelected,
	ccpUserData,
	defiSpringDropdownSelected,
	setdefiSpringDropdownSelected,
	handleClaimStrk,
	isEpochOpen,
	nextClaimableDate,
}: DefiSpringDataProps) {
	const nextDefiDate = formatDate(nextClaimableDate);
	return (
		<>
			<Tr
				key={'defispring' + idx}
				width={'100%'}
				height='56px'
				position='relative'
				cursor='pointer'
				top={
					ccpDropdownSelected ?
						`${ccpUserData.length * 68 + 34}px`
					:	'0.5rem'
				}
				p={0}
				onClick={() => {
					setdefiSpringDropdownSelected(!defiSpringDropdownSelected);
					// if (ccpUserData.length == 0) {
					// } else {
					//   setccpDropdownSelected(!ccpDropdownSelected)
					// }
				}}>
				<Td
					width={'16.6%'}
					fontSize={'14px'}
					fontWeight={400}
					padding={2}
					textAlign='center'
					bg={'#676D9A48'}
					borderRadius='6px 0 0 6px'>
					<Text
						width='100%'
						height='100%'
						display='flex'
						alignItems='center'
						fontWeight='400'
						fontSize='14px'
						ml='10'
						color='#E6EDF3'>
						<Image
							src='/activeCampaignsIcon.svg'
							alt='Picture of the author'
							width='8'
							height='8'
							style={{
								marginRight: '0.5rem',
								marginBottom: '0.1rem',
							}}
						/>
						{campaignDetails[idx + 2]?.campaignName}
					</Text>
				</Td>

				<Td
					width={'16.6%'}
					fontSize={'14px'}
					fontWeight={400}
					padding={2}
					textAlign='center'
					bg={'#676D9A48'}>
					<Text
						width='100%'
						height='100%'
						display='flex'
						alignItems='center'
						justifyContent='center'
						fontWeight='400'
						fontSize='14px'
						color='#E6EDF3'>
						<Tooltip
							hasArrow
							label={''}
							placement='right'
							rounded='md'
							boxShadow='dark-lg'
							bg='#02010F'
							fontSize={'13px'}
							fontWeight={'400'}
							borderRadius={'lg'}
							padding={'2'}
							color='#F0F0F5'
							border='1px solid'
							borderColor='#23233D'
							arrowShadowColor='#2B2F35'>
							<Text>{campaignDetails[idx + 2]?.timeline}</Text>
						</Tooltip>
					</Text>
				</Td>

				<Td
					width={'16.6%'}
					fontSize={'14px'}
					fontWeight={400}
					padding={2}
					textAlign='center'
					bg={'#676D9A48'}>
					<Text
						width='100%'
						height='100%'
						display='flex'
						alignItems='center'
						justifyContent='center'
						fontWeight='400'
						fontSize='14px'
						color='#E6EDF3'>
						<Tooltip
							hasArrow
							label={''}
							placement='right'
							rounded='md'
							boxShadow='dark-lg'
							bg='#02010F'
							fontSize={'13px'}
							fontWeight={'400'}
							borderRadius={'lg'}
							padding={'2'}
							color='#F0F0F5'
							border='1px solid'
							borderColor='#23233D'
							arrowShadowColor='#2B2F35'>
							<Text>
								{numberFormatter(
									totalStrkRewards ? totalStrkRewards : 0
								)}{' '}
								STRK
							</Text>
						</Tooltip>
					</Text>
				</Td>

				<Td
					width={'16.6%'}
					fontSize={'14px'}
					fontWeight={400}
					padding={2}
					textAlign='end'
					bg={'#676D9A48'}
					borderRadius='0 6px 6px 0'>
					<Box
						width='100%'
						height='100%'
						display='flex'
						alignItems='center'
						justifyContent='end'
						fontWeight='400'
						fontSize='14px'
						color='#E6EDF3'
						pr='10'
						gap='1rem'>
						<Tooltip
							hasArrow
							hidden={nextDefiDate === ''}
							label={`Next Claim on ${nextDefiDate}`}
							placement='right'
							rounded='md'
							boxShadow='dark-lg'
							bg='#02010F'
							fontSize={'13px'}
							fontWeight={'400'}
							borderRadius={'lg'}
							padding={'2'}
							color='#F0F0F5'
							border='1px solid'
							borderColor='#23233D'
							arrowShadowColor='#2B2F35'>
							<Text
								textDecoration='underline'
								cursor='pointer'
								color={strkRewards <= 0 ? '#3E415C' : '#F0F0F5'}
								onClick={() => {
									if (strkRewards <= 0) {
									} else {
										handleClaimStrk();
									}
								}}>
								Claim
							</Text>
						</Tooltip>
						<Box cursor='pointer'>
							{defiSpringDropdownSelected ?
								<ChevronUpCircle />
							:	<ChevronDownCircle className='text-[#3E415C] hover:text-white' />
							}
						</Box>
					</Box>
				</Td>
			</Tr>
			<Tr
				key={'defispringdropdown' + idx}
				width={'100%'}
				height='4rem'
				position='absolute'
				cursor='pointer'
				pl='1rem'
				top={
					ccpDropdownSelected ?
						defiSpringDropdownSelected ?
							`${ccpUserData.length * 68 + 64 * 1.7 + 34}px`
						:	`${ccpUserData.length * 68}px`
					:	`${2 * 68 * 0.9}px`
				}>
				{defiSpringDropdownSelected && (
					<Box
						borderRadius='6px'
						mt='1rem'
						mr='2rem'
						ml='2rem'
						border={'1px solid #676D9A48'}
						borderBottom={'1px solid #676D9A48'}>
						{dataRoundwiseAlloc.map(
							(data: DefiRound, idxDefi: number) => (
								<Box key={idxDefi}>
									<Box
										display='flex'
										justifyContent='space-between'
										cursor='pointer'
										padding='24px 48px 24px 48px'
										color='#F0F0F5'
										fontSize='14px'
										fontWeight='400'
										lineHeight='20px'
										onClick={() => {}}>
										<Text>Round {data.round}</Text>
										<Text>
											{formatDate(data.startTime)} -{' '}
											{formatDate(data.endTime)}
										</Text>
										<Box
											display='flex'
											gap='1.5rem'>
											<Text>
												{numberFormatter(
													data.allocation
												)}{' '}
												STRK tokens earned
											</Text>
										</Box>
									</Box>
									<Box
										borderBottom={
											(
												idxDefi !=
												dataRoundwiseAlloc.length - 1
											) ?
												isEpochOpen(idxDefi) ?
													''
												:	'1px solid #676D9A48'
											:	''
										}></Box>
								</Box>
							)
						)}
					</Box>
				)}
			</Tr>
		</>
	);
}

export default DefiSpringData;
