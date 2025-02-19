export const ENDPOINTS = {
	DEFI: {
		STRK_REWARDS: (address: string) => `/strk/${address}`,
		ROUNDS: (address: string) => `/strk/${address}/rounds`,
	},
};
