import { GetRewardsResponse, GetRoundsResponse } from '@/types/web3.types';
import { axiosInstance } from './axios';
import { ENDPOINTS } from '@/constants/endpoints.constant';

export const defiServices = {
	getStrkRewardsData: async ({
		address,
	}: {
		address: string;
	}): Promise<GetRewardsResponse> => {
		try {
			const { data } = await axiosInstance.get(
				ENDPOINTS.DEFI.STRK_REWARDS(address)
			);
			return data;
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
		const path = ENDPOINTS.DEFI.ROUNDS(address);
		try {
			const queryParams = new URLSearchParams();

			if (startRound !== undefined) {
				queryParams.append('startRound', startRound.toString());
			}
			if (endRound !== undefined) {
				queryParams.append('endRound', endRound.toString());
			}
			if (includeProofs !== undefined) {
				queryParams.append('includeProofs', includeProofs.toString());
			}
			const queryString = queryParams.toString();
			const url = queryString ? `${path}?${queryString}` : path;

			const { data } = await axiosInstance.get(url);
			return data;
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
