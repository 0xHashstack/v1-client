import { cache } from 'react';

type StrkRewardData = {
	[key: string]: any;
};

export const loadStrkReward = cache(
	async (round: number): Promise<StrkRewardData> => {
		try {
			const data = await import(
				`../../components/layouts/strkDashboard/round_${round}.json`
			);
			return data.default;
		} catch (error) {
			console.error(
				`Error loading STRK reward data for round ${round}:`,
				error
			);
			return {};
		}
	}
);

export const loadStrkRewards = async (
	startRound: number,
	endRound: number
): Promise<StrkRewardData[]> => {
	const promises = [];
	for (let round = startRound; round <= endRound; round++) {
		promises.push(loadStrkReward(round));
	}
	return Promise.all(promises);
};
