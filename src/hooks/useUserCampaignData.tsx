import { useState, useEffect } from 'react';
import { useAccount } from '@starknet-react/core';
import { useDispatch, useSelector } from 'react-redux';
import { processAddress } from '@/Blockchain/stark-constants';
import { parseAmount } from '@/Blockchain/utils/utils';
import { getUserSTRKClaimedAmount } from '@/Blockchain/scripts/Rewards';
import {
	loadStrkReward,
	loadStrkRewards,
} from '@/utils/functions/loadStrkRewards';
import useClaimStrk from '@/Blockchain/hooks/Writes/useStrkClaim';
import { toast } from 'react-toastify';
import { setActiveTransactions } from '@/store/slices/readDataSlice';
import { usePostHog } from 'posthog-js/react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Text } from '@/components/ui/typography/Text';

export const useUserCampaignData = ({
	leaderBoardData,
	snapshotsData,
}: {
	leaderBoardData: any;
	snapshotsData: any;
}) => {
	const [epochDropdownSelected, setepochDropdownSelected] = useState(false);
	const [defiSpringDropdownSelected, setdefiSpringDropdownSelected] =
		useState(false);
	const [groupedSnapshots, setGroupedSnapshots] = useState([[], [], [], []]);
	const [loading, setLoading] = useState<boolean>(true);
	const [openEpochs, setOpenEpochs] = useState<any>([]);
	const [ccpDropdownSelected, setccpDropdownSelected] = useState(false);
	const [strkRewards, setstrkRewards] = useState<any>(0);
	const [totalStrkRewards, settotalStrkRewards] = useState<any>();
	const [strkRewardsZklend, setstrkRewardsZklend] = useState<any>();
	const [strkClaimedRewards, setstrkClaimedRewards] = useState<any>();
	const [dataRoundwiseAlloc, setdataRoundwiseAlloc] = useState<any>([]);
	const [toastId, setToastId] = useState<any>();

	const dispatch = useDispatch();
	const { address } = useAccount();
	const { setstrkAmount, setProof, writeAsyncstrkClaim } = useClaimStrk();
	const posthog = usePostHog();

	const handleClaimStrk = async () => {
		try {
			const getTokens = await writeAsyncstrkClaim();
			posthog.capture('Claim Strk', {
				'Clicked Claim': true,
			});
			if (getTokens?.transaction_hash) {
				const toastid = toast.info('Transaction pending', {
					position: toast.POSITION.BOTTOM_RIGHT,
					autoClose: false,
				});
				setToastId(toastId);
				const uqID = 0;
				const trans_data = {
					transaction_hash: getTokens?.transaction_hash.toString(),
					message: `Successfully Claimed STRKToken`,
					toastId: toastid,
					setCurrentTransactionStatus: () => {},
					uniqueID: uqID,
				};
				dispatch(setActiveTransactions([trans_data]));
				posthog.capture('Get Tokens Status', { Status: 'Success' });
			}
		} catch (err: any) {
			console.log(err);
			posthog.capture('Get Claim Status', { Status: 'Failure' });
			const toastContent = (
				<div>
					Failed to Claim $STRK
					{/* @ts-ignore */}
					<CopyToClipboard text={err}>
						{/* @ts-ignore */}
						<Text>copy error!</Text>
					</CopyToClipboard>
				</div>
			);
			toast.error(toastContent, {
				position: toast.POSITION.BOTTOM_RIGHT,
				autoClose: false,
			});
		}
	};

	// useEffect(() => {
	// 	const fetchClaimedBalance = async () => {
	// 		if (address) {
	// 			const data: any = await getUserSTRKClaimedAmount(
	// 				processAddress(address)
	// 			);
	// 			const dataStrkRewards31 = await loadStrkReward(31);
	// 			const dataAmount: any = (dataStrkRewards31 as any)[
	// 				processAddress(address)
	// 			];
	// 			if (dataAmount) {
	// 				setstrkAmount(dataAmount?.amount);
	// 				setProof(dataAmount?.proofs);
	// 				setstrkRewards(
	// 					parseAmount(String(dataAmount?.amount), 18) - data
	// 				);
	// 				settotalStrkRewards(
	// 					parseAmount(String(dataAmount?.amount), 18)
	// 				);
	// 				setstrkClaimedRewards(data);
	// 			} else {
	// 				setstrkRewards(0);
	// 				settotalStrkRewards(0);
	// 			}
	// 		}
	// 	};
	// 	fetchClaimedBalance();
	// }, [address]);

	// useEffect(() => {
	// 	if (address) {
	// 		const fetchRewardsData = async () => {
	// 			const allRewardsData = await loadStrkRewards(1, 1);
	// 			const roundwiseAllocations = [];

	// 			for (let i = 0; i < allRewardsData.length - 1; i++) {
	// 				const currentRound =
	// 					allRewardsData[i][processAddress(address)];
	// 				const nextRound =
	// 					allRewardsData[i + 1][processAddress(address)];

	// 				const currentAmount = parseAmount(
	// 					currentRound?.amount || '0',
	// 					18
	// 				);
	// 				const nextAmount = parseAmount(
	// 					nextRound?.amount || '0',
	// 					18
	// 				);

	// 				if (i === 0) {
	// 					roundwiseAllocations.push(currentAmount);
	// 				}
	// 				roundwiseAllocations.push(nextAmount - currentAmount);
	// 			}

	// 			setdataRoundwiseAlloc([]);
	// 		};

	// 		fetchRewardsData();
	// 	}
	// }, [address]);

	useEffect(() => {
		if (leaderBoardData.length > 0) {
			setLoading(false);
		}
	}, [leaderBoardData]);

	const toggleEpochSelection = (idxEpoch: any): any => {
		setOpenEpochs((prevOpenEpochs: any[]) => {
			if (prevOpenEpochs.includes(idxEpoch)) {
				return prevOpenEpochs.filter(
					(index: any) => index !== idxEpoch
				);
			} else {
				return [...prevOpenEpochs, idxEpoch];
			}
		});
	};

	const isEpochOpen = (idxEpoch: any) => {
		return openEpochs.includes(idxEpoch);
	};

	useEffect(() => {
		const groupSize = 6;
		const numGroups = Math.ceil(snapshotsData.length / groupSize);
		const newGroupedSnapshots = Array.from(
			{ length: numGroups },
			(_, groupIndex) =>
				snapshotsData
					.slice(groupIndex * groupSize, (groupIndex + 1) * groupSize)
					.sort(
						(a: any, b: any) =>
							a.snapshot_number - b.snapshot_number
					)
		);

		setGroupedSnapshots(newGroupedSnapshots);
	}, [snapshotsData]);

	const datesDefiSpringRounds = [
		'14 Mar 2024 - 28 Mar 2024',
		'28 Mar 2024 - 4 Apr 2024',
		'4 Apr 2024 - 18 Apr 2024',
		'18 Apr 2024 - 2 May 2024',
		'2 May 2024 - 16 May 2024',
		'16 May 2024 - 30 May 2024',
		'30 May 2024 - 13 June 2024',
		'13 June 2024 - 27 June 2024',
		'27 June 2024 - 11 July 2024',
		'11 July 2024 - 25 July 2024',
		'25 July 2024 - 1 Aug 2024',
		'1 Aug 2024 - 8 Aug 2024',
		'8 Aug 2024 - 18 Aug 2024',
		'18 Aug 2024 - 25 Aug 2024',
		'25 Aug 2024 - 1 Sept 2024',
		'1 Sept 2024 - 8 Sept 2024',
		'8 Sept 2024 - 15 Sept 2024',
		'15 Sept 2024 - 22 Sept 2024',
		'22 Sept 2024 - 29 Sept 2024',
		'29 Sept 2024 - 6 Oct 2024',
		'6 Oct 2024 - 13 Oct 2024',
		'13 Oct 2024 - 20 Oct 2024',
		'20 Oct 2024 - 27 Oct 2024',
		'27 Oct 2024 - 2 Nov 2024',
		'2 Nov 2024 - 10 Nov 2024',
		'10 Nov 2024 - 17 Nov 2024',
		'17 Nov 2024 - 24 Nov 2024',
		'24 Nov 2024 - 1 Dec 2024',
		'1 Dec 2024 - 8 Dec 2024',
		'8 Dec 2024 - 15 Dec 2024',
		'15 Dec 2024 - 22 Dec 2024',
		'22 Dec 2024 - 29 Dec 2024',
		'29 Dec 2024 - 5 Jan 2025',
	];

	return {
		loading,
		epochDropdownSelected,
		setepochDropdownSelected,
		defiSpringDropdownSelected,
		setdefiSpringDropdownSelected,
		ccpDropdownSelected,
		setccpDropdownSelected,
		strkRewards,
		totalStrkRewards,
		dataRoundwiseAlloc,
		groupedSnapshots,
		handleClaimStrk,
		toggleEpochSelection,
		isEpochOpen,
		openEpochs,
		datesDefiSpringRounds,
	};
};
