import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <title>Hashstack</title>
      <meta name="description" content="Hashstack provides a permissionless zk-native money market protocol enabling secure under-collateralised loans to the crypto retail. Built on Starknet L2 [announcement], Hashstack leverages the capability of zero-knowledge proofs to provide a cost & capital-efficient lending solution." />
        <link rel="shortcut icon" href="/favicon-32x32.png" />

      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
