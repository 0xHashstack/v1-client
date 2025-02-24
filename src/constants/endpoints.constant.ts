export const ENDPOINTS = {
	DEFI: {
		STRK_REWARDS: (address: string) => `/api/rewards/strk/${address}`,
		ROUNDS: (address: string) => `/api/rewards/strk/${address}/rounds`,
	},
};
