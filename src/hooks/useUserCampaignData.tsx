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
import { defiServices } from '@/services/defi.service';
import { DefiRound } from '@/types/web3.types';

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
	const [dataRoundwiseAlloc, setdataRoundwiseAlloc] = useState<DefiRound[]>(
		[]
	);
	const [toastId, setToastId] = useState<any>();
	const [nextClaimableDate, setNextClaimableDate] = useState('');

	const dispatch = useDispatch();
	const { address } = useAccount();
	const { setstrkAmount, setProof, writeAsyncstrkClaim } = useClaimStrk();
	const posthog = usePostHog();
	const [defiLoading, setDefiLoading] = useState(false);

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

	const fetchStrkClaimedBalance = async (address: string) => {
		try {
			const [claimData = 0, rewardsData] = await Promise.all([
				getUserSTRKClaimedAmount(processAddress(address)),
				defiServices.getStrkRewardsData({ address }),
			]);

			setstrkClaimedRewards(claimData);
			setProof(rewardsData?.proof);
			const totalStrkRewards = parseAmount(
				String(rewardsData?.totalRewards),
				18
			);
			settotalStrkRewards(totalStrkRewards);
			setstrkAmount(totalStrkRewards - claimData);
			setNextClaimableDate(rewardsData?.nextClaimEligibleAt!);
		} catch (error) {
			setstrkClaimedRewards(0);
			settotalStrkRewards(0);
			setstrkAmount(0);
		}
	};

	const fetchRoundData = async (address: string) => {
		try {
			const { rounds = [] } = await defiServices.getStrkRoundsData({
				address,
			});
			setdataRoundwiseAlloc(
				rounds.map((round) => ({
					...round,
					allocation: parseAmount(String(round.allocation), 18),
				})) as unknown as DefiRound[]
			);
		} catch (error) {
			setdataRoundwiseAlloc([]);
		}
	};

	const proceedWithDefiCalls = async (address: string) => {
		try {
			setDefiLoading(true);
			await Promise.all([
				fetchStrkClaimedBalance(address),
				fetchRoundData(address),
			]);
		} catch (error) {
		} finally {
			setDefiLoading(false);
		}
	};

	useEffect(() => {
		if (!address) return;
		proceedWithDefiCalls(address);
	}, [address]);

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
		nextClaimableDate,
		defiLoading,
	};
};
