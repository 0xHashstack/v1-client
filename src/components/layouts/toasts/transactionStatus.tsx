import { Text } from '@chakra-ui/react';
import { useWaitForTransaction } from '@starknet-react/core';
// import React from "react";
import { toast } from 'react-toastify';
export const useFetchToastStatus = (transaction: any) => {
	// useState
	const data = useWaitForTransaction({
		hash: transaction?.transaction_hash,
		watch: true,
	});
	return data;
};

export default useFetchToastStatus;
