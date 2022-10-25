// import "../styles/globals.css";

import type { AppProps } from 'next/app';
import loadable from '@loadable/component';

import Layout from '../components/layout';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { DetailsProvider } from '../hooks/contextHooks/recordContext';
import store from '../store';
import '../assets/scss/theme.scss';
import "./scrollbar.css"

import {
	getInstalledInjectedConnectors,
	StarknetProvider,
} from '@starknet-react/core';
import { SequencerProvider } from 'starknet';

function MyApp({ Component, pageProps }: AppProps) {
	const connectors = getInstalledInjectedConnectors();
	return (
		<>
			<StarknetProvider
				connectors={connectors}
				autoConnect
				defaultProvider={
					new SequencerProvider({ baseUrl: 'https://alpha4.starknet.io' })
				}
			>
				<Provider store={store}>
					<DetailsProvider>
						<Layout>
							<Component {...pageProps} />
						</Layout>
						<ToastContainer />
					</DetailsProvider>
				</Provider>
			</StarknetProvider>
		</>
	);
}

export default MyApp;
