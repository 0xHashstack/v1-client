export interface GetRewardsResponse {
	totalRewards: string;
	claimedRewards: string;
	unclaimedRewards: string;
	proof: string[];
	claimableAmount: string;
	nextClaimEligibleAt?: string;
	lastUpdated: string;
	zkLendRewards?: string;
	hashstackRewards?: string;
}

export interface DefiRound {
	round: number;
	startTime: string;
	endTime: string;
	allocation: string;
	status: 'PENDING' | 'CLAIMABLE' | 'CLAIMED';
	proof?: string[];
	claimedAt?: string;
	transactionHash?: string;
}

export interface GetRoundsResponse {
	address: string;
	rounds: DefiRound[];
	summary: {
		totalRounds: number;
		totalAllocated: string;
		totalClaimed: string;
		remainingClaimable: string;
	};
}
