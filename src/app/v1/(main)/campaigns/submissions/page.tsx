'use client';
import { Box, Button, HStack, Skeleton, Text } from '@chakra-ui/react';
import axios from 'axios';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import PageCard from '@/components/layouts/pageCard';
import numberFormatter from '@/utils/functions/numberFormatter';

const filterButtons = [
	'Medium Article',
	'Twitter Tweet',
	'Twitter (X) Post',
	'Twitter (X) Thread',
	'Youtube Video',
	'Telegram Post',
	'Instagram Post',
	'Instagram Reels',
	'Reddit Post',
	'TikTok Video',
	'Memes',
	'Others',
];

interface SubmissionData {
	'Content Platform': string;
	Link: string;
	Timestamp: string;
	'Wallet Address (StarkNet)': string;
	Allocated: string;
	'Recommended (Community Team)': string;
}

export const dynamic = 'force-static';
export const runtime = 'nodejs';

const CcpSubmissions: NextPage = () => {
	const [selectedFilter, setSelectedFilter] = useState('All');
	const [submissionData, setSubmissionData] = useState<SubmissionData[]>([]);
	const [loading, setLoading] = useState(true);

	const router = useRouter();
	const searchParams = useSearchParams();
	const address = searchParams.get('address');

	useEffect(() => {
		try {
			setLoading(true);
			const fetchUserCCPData = async () => {
				const res = await axios.get(
					`https://hstk.fi/api/ccp/submission/${address}`
				);

				console.log(res.data, 'data');
				if (selectedFilter === 'All') {
					setSubmissionData(res.data);
				} else {
					const filteredData = res.data.filter(
						(item: SubmissionData) =>
							item['Content Platform'] === selectedFilter
					);
					setSubmissionData(filteredData);
				}
			};
			if (address) {
				fetchUserCCPData();
			}
			setLoading(false);
		} catch (err) {
			console.log(err);
			setLoading(false);
		}
	}, [selectedFilter, address]);

	return (
		<>
			<HStack
				display='flex'
				alignItems='flex-start'
				flexDirection='column'
				width='95%'>
				<Box
					bg='transparent'
					fontSize='14px'
					lineHeight='20px'
					letterSpacing='-0.15px'
					padding='1.125rem 0.4rem'
					borderRadius='0px'
					borderBottom={'2px solid #4D59E8'}
					color='#B1B0B5'
					marginTop='.5rem'
					display='flex'>
					Leaderboard/Submissions/CCP/{' '}
					<Text color='#fff'>
						{address?.toString().substring(0, 5)}...
						{address
							?.toString()
							.substring(address?.length - 5, address?.length)}
					</Text>
				</Box>

				<Box
					display='flex'
					alignItems='flex-start'
					flexWrap='wrap'
					gap={{ base: '.5rem', sm: '1rem' }}
					marginTop='2.6rem'
					overflowX='auto'
					width='100%'>
					<Button
						color={selectedFilter === 'All' ? 'white' : '#676C9B'}
						background={
							selectedFilter === 'All' ? '#4D59E8' : '#140E2D'
						}
						padding={{ base: '0rem .5rem', sm: '0rem .7rem' }}
						borderRadius='md'
						fontSize={{ base: '12px', sm: '14px' }}
						fontWeight='semibold'
						height='2rem'
						_hover={{ bg: '#4D59E8', color: 'white' }}
						onClick={() => setSelectedFilter('All')}>
						All
					</Button>
					{filterButtons.map((item, i) => (
						<Button
							key={i}
							color={
								selectedFilter === item ? 'white' : '#676C9B'
							}
							background={
								selectedFilter === item ? '#4D59E8' : '#140E2D'
							}
							padding={{ base: '0rem .5rem', sm: '0rem .7rem' }}
							borderRadius='md'
							fontSize={{ base: '12px', sm: '14px' }}
							fontWeight='semibold'
							height='2rem'
							_hover={{ bg: '#4D59E8', color: 'white' }}
							onClick={() => setSelectedFilter(item)}>
							{item === 'Medium Article' ? 'Article' : item}
						</Button>
					))}
				</Box>
			</HStack>

			<HStack
				display='grid'
				gridTemplateColumns={{
					sm: 'auto',
					md: 'auto auto',
					lg: 'auto auto auto',
				}}
				gap='1.5rem'
				width='95%'
				marginTop='1.5rem'>
				{loading ?
					<Box>
						<Skeleton
							width='6rem'
							height='4rem'
							startColor='#101216'
							endColor='#2B2F35'
							borderRadius='6px'
						/>
					</Box>
				: !(submissionData.length <= 0) ?
					submissionData?.map((item, i) => (
						<Box
							borderRadius='lg'
							border='1px solid #282A44'
							key={i}
							maxWidth={submissionData.length > 1 ? '500' : ''}>
							<Box
								height={200}
								width='100%'
								display='flex'
								alignItems='center'
								justifyContent='center'>
								<Image
									src='/submission_placeholder.svg'
									width={137}
									height={81}
									alt='img'
									style={{
										borderTopLeftRadius: '8px',
										borderTopRightRadius: '8px',
									}}
								/>
							</Box>
							<Box
								background='#16162C'
								display='flex'
								flexDirection='column'
								alignItems='start'
								width='100%'
								padding='.8rem .8rem'
								gap='.8rem'>
								<Box
									display='flex'
									justifyContent='space-between'
									alignItems='center'
									width='100%'>
									<Text color='white'>
										CCP 1 - {item['Content Platform']}
									</Text>
									<Box
										color='black'
										background='#B3894D'
										height='1.5rem'
										paddingX='.4rem'
										fontSize='md'
										fontWeight='semibold'
										borderRadius='md'>
										Points -{' '}
										{item['Recommended (Community Team)'] ?
											(
												numberFormatter(
													item[
														'Recommended (Community Team)'
													]
												) === '0.0000'
											) ?
												'0.000'
											:	numberFormatter(
													item[
														'Recommended (Community Team)'
													]
												)

										:	'0.000'}
									</Box>
								</Box>
								<Link
									href={item.Link}
									target='_blank'>
									<Text
										color='#4F59E9'
										fontSize='sm'
										// isTruncated={item.Link.length > 30}
									>
										{item.Link.length > 30 ?
											item.Link.substring(0, 40) + '...'
										:	item.Link}
										{/* {item.Link} */}
									</Text>
								</Link>
							</Box>
						</Box>
					))
				:	<Box>
						<Text color='#fff'>No data found</Text>
					</Box>
				}
			</HStack>
		</>
	);
};

export default CcpSubmissions;
