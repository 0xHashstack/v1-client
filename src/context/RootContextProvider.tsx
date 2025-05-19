'use client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { goerli, mainnet, sepolia } from '@starknet-react/chains';
import {
	StarknetConfig,
	alchemyProvider,
	argent,
	braavos,
	infuraProvider,
	useInjectedConnectors,
} from '@starknet-react/core';
import { PostHogProvider } from 'posthog-js/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import Layout from '@/components/layouts/toasts';
import { Suspense, useEffect, useMemo } from 'react';
import posthog from 'posthog-js';

export const theme = extendTheme({
	components: {
		Tabs: {
			baseStyle: {
				tab: {
					_disabled: {
						background: '#676D9A1A',
						opacity: '100%',
						cursor: 'pointer',
					},
					'> *:first-of-type': {
						background: '#676D9A1A',
						opacity: '100%',
					},
				},
			},
		},
		Checkbox: {
			baseStyle: {
				icon: {
					bg: '#4D59E8',
					color: 'white',
					borderWidth: '0px',
					_disabled: {
						borderWidth: '0px',
						padding: '0px',
						color: '#4D59E8',
						bg: '#4D59E8',
						colorScheme: '#4D59E8',
					},
				},
				control: {
					borderRadius: 'base',
					_disabled: {
						borderWidth: '2px',
						borderColor: '#2B2F35',
						padding: '0px',
						color: 'black',
						bg: 'transparent',
					},
				},
			},
		},
	},

	colors: {
		customBlue: {
			500: '#0969DA',
		},
		customPurple: {
			500: '#4D59E8',
		},
	},
	fonts: {
		body: 'Inter, sans-serif',
	},
});

const NoSSRWrapper = ({ children }: { children: React.ReactNode }) => (
	<>{typeof window === 'undefined' ? null : children}</>
);

export default function RootContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const apikey: string = process.env.NEXT_PUBLIC_INFURA_MAINNET as string;
	const provider = useMemo(
		() => alchemyProvider({ apiKey: apikey.split('/').at(-1)! }),
		[apikey]
	);

	const { connectors } = useInjectedConnectors({
		recommended: [argent(), braavos()],
		includeRecommended: 'onlyIfNoConnectors',
		order: 'random',
	});

	useEffect(() => {
		posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
			api_host: process.env.NEXT_PUBLIC_HOSTHOG_HOST,
			capture_pageview: false,
		});
	}, []);

	return (
		<NoSSRWrapper>
			<PostHogProvider client={posthog}>
				<ChakraProvider theme={theme}>
					<StarknetConfig
						chains={[mainnet, goerli, sepolia]}
						provider={provider}
						connectors={connectors}>
						<Provider store={store}>
							<Layout>
								<Suspense>{children}</Suspense>
							</Layout>
						</Provider>
					</StarknetConfig>
				</ChakraProvider>
			</PostHogProvider>
		</NoSSRWrapper>
	);
}
