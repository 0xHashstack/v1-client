import { http, createConfig } from '@wagmi/core'
import { baseSepolia, mainnet, sepolia } from '@wagmi/core/chains'
import { cookieStorage, createStorage } from 'wagmi'
import { coinbaseWallet, metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [baseSepolia],
  connectors:[coinbaseWallet(),metaMask()],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [baseSepolia.id]: http(),
  },
})