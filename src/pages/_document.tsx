import Document, { Head, Html, Main, NextScript } from "next/document";

export default function MyDocument() {
  return (
    <Html lang="en">
      <Head>
        {process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MJGKKD55');`,
            }}
          />
        ) : (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l] = w[l] || [];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WFFTL28');`,
            }}
          />
        )}
        <meta httpEquiv="Cache-Control" content="no-cache, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <link rel="shortcut icon" href="/static/favicon-32x32.png" />
        {/* Rest of your <Head> content */}
      </Head>
      <body>
        {process.env.NEXT_PUBLIC_NODE_ENV == "mainnet" ? (
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-MJGKKD55"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        ) : (
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-WFFTL28"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
