import { setTransactionStatus } from '@/store/slices/userAccountSlice';
import { Text } from '@chakra-ui/react';
import { useWaitForTransaction } from '@starknet-react/core';
// import React from "react";
import CopyToClipboard from '@/components/clipboard/clipboard';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export const useToastHandler = (transaction: any) => {
	// const dispatch = useDispatch();
	const data = useWaitForTransaction({
		hash: transaction?.transaction_hash,
		watch: true,
	});
	return data;
};

export default useToastHandler;
