import { ReactNode } from 'react';
import '@/styles/globals.scss';
import RootContextProvider from '@/context/RootContextProvider';
import { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import GTMScript from '@/components/analytics/GTMScript';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Hashstack | Under-collateralised loans | Defi',
	description:
		'Hashstack provides a permissionless zk-native money market protocol enabling secure under-collateralised loans to the crypto retail. Built on Starknet L2 [announcement], Hashstack leverages the capability of zero-knowledge proofs to provide a cost & capital-efficient lending solution.',
	other: {
		'google-site-verification':
			'9U0-YnKdWueBdZmj8Y5_JEkGNPOiV-_d8cPrmjIgifs',
	},
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang='en'
			className={inter.className}>
			<head>
				<GTMScript />
			</head>
			<body>
				<RootContextProvider>{children}</RootContextProvider>
			</body>
		</html>
	);
}
