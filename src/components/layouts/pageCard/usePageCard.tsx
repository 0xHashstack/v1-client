'use client';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	useAccount,
	useConnect,
	useDisconnect,
	useNetwork,
} from '@starknet-react/core';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AccountInterface } from 'starknet';
import {
	selectUserDeposits,
	selectUserType,
	setMessageHash,
	setSignature,
	selectreferral,
} from '@/store/slices/readDataSlice';

interface ExtendedAccountInterface extends AccountInterface {
	provider?: {
		chainId: string;
	};
}

export const usePageCard = () => {
	const [render, setRender] = useState(true);
	const [whitelisted, setWhitelisted] = useState(true);
	const [uniqueToken, setUniqueToken] = useState('');
	const [referralLinked, setRefferalLinked] = useState(false);
	const [validRTokens, setValidRTokens] = useState([]);

	const { account, address, status } = useAccount();
	const extendedAccount: any = account as ExtendedAccountInterface;
	const { connect, connectors } = useConnect();
	const { disconnect } = useDisconnect();
	const router = useRouter();
	const dispatch = useDispatch();
	const { chain } = useNetwork();

	const ref = useSelector(selectreferral);
	const userType = useSelector(selectUserType);
	const userDepositsRedux = useSelector(selectUserDeposits);

	useEffect(() => {
		setRender(true);
	}, []);

	useEffect(() => {
		const walletConnected = (
			typeof window !== 'undefined' ?
				window.localStorage
			:	null)?.getItem('lastUsedConnector');
		const connected = (
			typeof window !== 'undefined' ?
				window.localStorage
			:	null)?.getItem('connected');

		if (walletConnected === '') {
			router.push('/');
			return;
		}

		if (!account) {
			if (walletConnected === 'braavos') {
				(typeof window !== 'undefined' ?
					window.localStorage
				:	null
				)?.setItem('connected', 'braavos');
				connectors.map((connector: any) => {
					if (connector.id === 'braavos') {
						connect({ connector });
					}
				});
			} else if (walletConnected === 'argentX') {
				(typeof window !== 'undefined' ?
					window.localStorage
				:	null
				)?.setItem('connected', 'argentX');
				connectors.map((connector) => {
					if (connector.id === 'argentX') {
						connect({ connector });
					}
				});
			} else {
				if (connected === 'braavos') {
					(typeof window !== 'undefined' ?
						window.localStorage
					:	null
					)?.setItem('lastUsedConnector', 'braavos');
					connectors.map((connector: any) => {
						if (connector.id === 'braavos') {
							connect({ connector });
						}
					});
				} else if (connected === 'argentX') {
					(typeof window !== 'undefined' ?
						window.localStorage
					:	null
					)?.setItem('lastUsedConnector', 'argentX');
					connectors.map((connector) => {
						if (connector.id === 'argentX') {
							connect({ connector });
						}
					});
				} else {
					router.push('/v1');
				}
			}
		}
	}, [account, connect, connectors, router]);

	const isCorrectNetwork = useCallback(() => {
		const walletConnected = (
			typeof window !== 'undefined' ?
				window.localStorage
			:	null)?.getItem('lastUsedConnector');
		const network = process.env.NEXT_PUBLIC_NODE_ENV;

		if (walletConnected === 'braavos') {
			if (network === 'testnet') {
				return (
					extendedAccount?.provider.chainId ===
					'0x534e5f5345504f4c4941'
				);
			}
			return extendedAccount?.provider.chainId === '0x534e5f4d41494e';
		}

		if (walletConnected === 'argentX') {
			if (network === 'testnet') {
				return (
					extendedAccount?.provider?.chainId ===
					'0x534e5f5345504f4c4941'
				);
			}
			return (
				extendedAccount?.provider?.chainId === '0x534e5f4d41494e' ||
				extendedAccount?.channel?.chainId === '0x534e5f4d41494e'
			);
		}
	}, [extendedAccount]);

	useEffect(() => {
		const checkWhitelist = async () => {
			try {
				if (!address) return;

				if (userType === 'U1') {
					const response = await axios.post(
						'https://hstk.fi/nft-sign',
						{ address }
					);
					if (response) {
						dispatch(setMessageHash(response?.data?.msg_hash));
						dispatch(setSignature(response?.data?.signature));
					}
				}
			} catch (err) {
				console.error('Error in whitelist check:', err);
			}
		};

		const checkReferral = async () => {
			try {
				if (process.env.NEXT_PUBLIC_NODE_ENV !== 'testnet' && ref) {
					const response = await axios.get(
						`https://hstk.fi/get_token/${ref}`
					);
					if (response) {
						const linkResponse = await axios.post(
							'https://hstk.fi/link-referral',
							{ address },
							{ headers: { reftoken: response.data } }
						);
						setRefferalLinked(linkResponse?.data?.success);
						setUniqueToken(response.data);
					}
				}
			} catch (err) {
				console.error('Error in referral check:', err);
			}
		};

		checkWhitelist();
		checkReferral();

		if (account && !isCorrectNetwork()) {
			setRender(false);
		} else {
			setRender(true);
		}
	}, [
		account,
		whitelisted,
		referralLinked,
		userType,
		address,
		dispatch,
		ref,
		isCorrectNetwork,
	]);

	const fetchUserDeposits = useCallback(async () => {
		try {
			if (!address) return;

			const reserves = userDepositsRedux;
			const rTokens: any = [];

			if (reserves) {
				reserves.map((reserve: any) => {
					if (reserve.rTokenAmountParsed > 0) {
						rTokens.push({
							rToken: reserve.rToken,
							rTokenAmount: reserve.rTokenAmountParsed,
						});
					}
				});
			}

			if (rTokens.length === 0) return;
			setValidRTokens(rTokens);
		} catch (err) {
			console.error('Error fetching protocol reserves:', err);
		}
	}, [address, userDepositsRedux]);

	useEffect(() => {
		if (validRTokens.length === 0) {
			fetchUserDeposits();
		}
	}, [validRTokens, userDepositsRedux, address, fetchUserDeposits]);

	return {
		render,
		whitelisted,
		validRTokens,
		isCorrectNetwork: isCorrectNetwork(),
	};
};
