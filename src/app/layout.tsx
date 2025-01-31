import { ReactNode } from 'react';
import '@/styles/globals.css';
import RootContextProvider from '@/context/RootContextProvider';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
	title: 'Hashstack | Under-collateralised loans | Defi',
	description:
		'Hashstack provides a permissionless zk-native money market protocol enabling secure under-collateralised loans to the crypto retail. Built on Starknet L2 [announcement], Hashstack leverages the capability of zero-knowledge proofs to provide a cost & capital-efficient lending solution.',
	icons: {
		shortcut: '/favicon-32x32.png',
	},
	other: {
		'google-site-verification':
			'9U0-YnKdWueBdZmj8Y5_JEkGNPOiV-_d8cPrmjIgifs',
	},
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en'>
			<head>
				{process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' ?
					<Script
						id='gtm-script'
						dangerouslySetInnerHTML={{
							__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MJGKKD55');`,
						}}
					/>
				:	<Script
						id='gtm-script'
						dangerouslySetInnerHTML={{
							__html: `(function(w,d,s,l,i){w[l] = w[l] || [];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WFFTL28');`,
						}}
					/>
				}
				<link
					rel='shortcut icon'
					href='/static/favicon-32x32.png'
				/>
			</head>
			<body>
				<RootContextProvider>{children}</RootContextProvider>
			</body>
		</html>
	);
}
