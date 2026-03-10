# Hashstack V1 Client

> **Live:** [app.hashstack.finance](https://app.hashstack.finance)

This is the frontend client for Hashstack V1 — currently in **withdrawal-only mode**. The money markets product has been suspended. Users can connect their wallets and withdraw any remaining supplied assets.

---

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (Static Export)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Blockchain:** Starknet (ArgentX, Braavos wallets)

---

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/0xHashstack/v1-client.git
cd v1-client
```

### 2. Install dependencies

```bash
# using bun (recommended)
bun install

# or yarn
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_NODE_ENV=mainnet
NEXT_PUBLIC_TESTNET_CHAINID=0x534e5f474f45524c49
NEXT_PUBLIC_MAINNET_CHAINID=0x534e5f4d41494e
NEXT_PUBLIC_METRICS_API=https://metricsapimainnet.hashstack.finance
NEXT_PUBLIC_FEEDBACK_API=https://metricsapimainnet.hashstack.finance

# Secrets — get these from the team
NEXT_PUBLIC_MIXPANEL_KEY=
NEXT_PUBLIC_ALCHEMY_MAINNET=
NEXT_PUBLIC_INFURA_MAINNET=
NEXT_PUBLIC_INFURA_TESTNET=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_HOSTHOG_HOST=
```

### 4. Run the dev server

```bash
bun dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

The app is deployed to **GitHub Pages** at [app.hashstack.finance](https://app.hashstack.finance) via GitHub Actions.

- **Workflow file:** `.github/workflows/nextjs.yml`
- **Triggers:** Push to `mainnet-V1` or `feature/github-pages-deployment`, or manual dispatch from the Actions tab
- **Secrets required** (set in GitHub repo Settings → Secrets):
  - `NEXT_PUBLIC_MIXPANEL_KEY_MAINNET`
  - `NEXT_PUBLIC_ALCHEMY_MAINNET`
  - `NEXT_PUBLIC_INFURA_MAINNET`
  - `NEXT_PUBLIC_INFURA_TESTNET`
  - `NEXT_PUBLIC_POSTHOG_KEY`
  - `NEXT_PUBLIC_HOSTHOG_HOST`

---

## Key Pages

| Route | Description |
|---|---|
| `/v1/your-supply` | View and withdraw your supplied assets |
| `/withdrawal-guide` | Step-by-step guide for withdrawals |
