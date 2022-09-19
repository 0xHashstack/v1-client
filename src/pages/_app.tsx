// import "../styles/globals.css";

import type { AppProps } from 'next/app';
import loadable from '@loadable/component';

import Layout from '../components/layout';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { DetailsProvider } from '../hooks/contextHooks/recordContext';
import store from '../store';
import '../assets/scss/theme.scss';
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
					// new SequencerProvider({ baseUrl: 'http://52.77.185.41:5050/' })
					new SequencerProvider({ baseUrl: 'http://127.0.0.1:5050/' })
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
