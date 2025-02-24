import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { usePostHog } from 'posthog-js/react';
import { useOutsideClick } from '@chakra-ui/react';

import {
	selectCurrentDropdown,
	selectNavDropdowns,
	setNavDropdown,
} from '@/store/slices/dropdownsSlice';
import {
	resetState,
	selectCurrentNetwork,
	selectUserType,
	selectWhiteListed,
} from '@/store/slices/readDataSlice';
import {
	selectLanguage,
	setAccountReset,
	setLanguage,
} from '@/store/slices/userAccountSlice';
import { AccountInterface } from 'starknet';

interface ExtendedAccountInterface extends AccountInterface {
	provider?: {
		chainId: string;
	};
}

export const useNavbar = (validRTokens: any) => {
	const dispatch = useDispatch();
	const navDropdowns = useSelector(selectNavDropdowns);
	const language = useSelector(selectLanguage);
	const currentDropdown = useSelector(selectCurrentDropdown);
	const { account, address, status, isConnected } = useAccount();
	const [stakeHover, setStakeHover] = useState(false);
	const [domainName, setDomainName] = useState('');
	const [justifyContent, setJustifyContent] = useState('flex-start');
	const [whitelisted, setWhitelisted] = useState(true);
	const [referralLinked, setRefferalLinked] = useState(false);
	const [Render, setRender] = useState(true);

	const { connect, connectors } = useConnect();
	const { disconnect } = useDisconnect();
	const router = useRouter();
	const pathname = usePathname();
	const userWhitelisted = useSelector(selectWhiteListed);
	const posthog = usePostHog();

	const handleDropdownClick = (dropdownName: string) => {
		dispatch(setNavDropdown(dropdownName));
	};

	const toggleMode = () => {
		setJustifyContent(
			justifyContent === 'flex-start' ? 'flex-end' : 'flex-start'
		);
	};

	const handleFeedbackClick = () => {
		posthog.capture('Feedback Modal Clicked', { Clicked: true });
	};

	useEffect(() => {
		async function fetchDomainName() {
			if (account?.address) {
				try {
					const res: any = await axios.get(
						`https://api.starknet.id/addr_to_domain?addr=${account?.address}`
					);
					setDomainName(res?.data?.domain);
				} catch (error) {
					console.log('address to domain error', error);
				}
			}
		}
		fetchDomainName();
	}, [account?.address, domainName]);

	useEffect(() => {
		function isCorrectNetwork() {
			const walletConnected = (
				typeof window !== 'undefined' ?
					window.localStorage
				:	null)?.getItem('lastUsedConnector');
			const network = process.env.NEXT_PUBLIC_NODE_ENV;

			if (walletConnected == 'braavos') {
				if (network == 'testnet') {
					return (
						(account as ExtendedAccountInterface).provider
							?.chainId == process.env.NEXT_PUBLIC_TESTNET_CHAINID
					);
				} else {
					return (
						(account as ExtendedAccountInterface).provider
							?.chainId == process.env.NEXT_PUBLIC_MAINNET_CHAINID
					);
				}
			} else if (walletConnected == 'argentX') {
				if (network == 'testnet') {
					return (
						(account as ExtendedAccountInterface).provider
							?.chainId ===
						process.env.NEXT_PUBLIC_TESTNET_CHAINID
					);
				} else {
					return (
						(account as ExtendedAccountInterface).provider
							?.chainId ===
						process.env.NEXT_PUBLIC_MAINNET_CHAINID
					);
				}
			}
		}

		const isWhiteListed = async () => {
			try {
				if (!address) {
					return;
				}
				const url = `https://hstk.fi/is-whitelisted/${address}`;
				const response = await axios.get(url);
				setWhitelisted(response.data?.isWhitelisted);
			} catch (err) {}
		};
		isWhiteListed();

		if (account && !isCorrectNetwork()) {
			setRender(false);
		} else {
			setRender(true);
		}
	}, [account, whitelisted, userWhitelisted, referralLinked]);

	return {
		// State
		navDropdowns,
		language,
		account,
		domainName,
		stakeHover,
		Render,
		pathname,

		// Actions
		setStakeHover,
		handleDropdownClick,
		handleFeedbackClick,
		connect,
		disconnect,
		dispatch,
		router,
		connectors,
		setNavDropdown,
		resetState,
		setAccountReset,
	};
};
