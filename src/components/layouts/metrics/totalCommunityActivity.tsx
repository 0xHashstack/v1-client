import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import TotalAccountsChart from '../charts/totalAccountsChart';
import TotalTransactionChart from '../charts/totalTransaction';
const TotalCommunityActivity = ({ currentMarketCoin }: any) => {
	return (
		<Box
			display='flex'
			flexDir='column'
			gap='64px'>
			<Box
				display='flex'
				gap='30px'>
				<TotalAccountsChart />
				<TotalTransactionChart />
			</Box>
		</Box>
	);
};

export default TotalCommunityActivity;
