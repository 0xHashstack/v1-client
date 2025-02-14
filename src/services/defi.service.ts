import { GetRewardsResponse, GetRoundsResponse } from '@/types/web3.types';
import { axiosInstance } from './axios';
import { ENDPOINTS } from '@/constants/endpoints.constant';

const MOCKDATA: {
	Rewards: GetRewardsResponse;
	Rounds: GetRoundsResponse;
} = {
	Rewards: {
		totalRewards: '1000000000000000000',
		claimedRewards: '500000000000000000',
		unclaimedRewards: '500000000000000000',
		lastUpdated: '2024-02-12T08:42:30Z',
		proof: [],
		claimableAmount: '500000000000000000',
		nextClaimEligibleAt: '2024-02-12T08:42:30Z',
	},
	Rounds: {
		address: '0x0000000000000000000000000000000000000000',
		rounds: [
			{
				round: 1,
				startTime: '2024-01-01T00:00:00Z',
				endTime: '2024-01-15T23:59:59Z',
				allocation: '200000000000000000',
				status: 'CLAIMED',
				claimedAt: '2024-01-16T10:30:00Z',
				transactionHash: '0x9876...',
			},
		],
		summary: {
			totalRounds: 6,
			totalAllocated: '1000000000000000000',
			totalClaimed: '500000000000000000',
			remainingClaimable: '500000000000000000',
		},
	},
};

export const defiServices = {
	getStrkRewardsData: async ({
		address,
	}: {
		address: string;
	}): Promise<GetRewardsResponse> => {
		try {
			// const { data } = await axiosInstance.get(
			// 	ENDPOINTS.DEFI.STRK_REWARDS(address)
			// );
			// return data;
			return MOCKDATA.Rewards;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(
					`Failed to fetch STRK rewards data: ${error.message}`
				);
			}
			throw new Error(
				'An unexpected error occurred while fetching STRK rewards data'
			);
		}
	},
	getStrkRoundsData: async ({
		address,
		startRound,
		endRound,
		includeProofs = false,
	}: {
		address: string;
		startRound?: number;
		endRound?: number;
		includeProofs?: boolean;
	}): Promise<GetRoundsResponse> => {
		// add rounds to query if present
		const path = ENDPOINTS.DEFI.ROUNDS(address);
		try {
			// const queryParams = new URLSearchParams();

			// if (startRound !== undefined) {
			// 	queryParams.append('startRound', startRound.toString());
			// }
			// if (endRound !== undefined) {
			// 	queryParams.append('endRound', endRound.toString());
			// }
			// if (includeProofs !== undefined) {
			// 	queryParams.append('includeProofs', includeProofs.toString());
			// }
			// const queryString = queryParams.toString();
			// const url = queryString ? `${path}?${queryString}` : path;

			// const { data } = await axiosInstance.get(url);
			// return data;
			return MOCKDATA.Rounds;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(
					`Failed to fetch STRK rounds data: ${error.message}`
				);
			}
			throw new Error(
				'An unexpected error occurred while fetching STRK rounds data'
			);
		}
	},
};
