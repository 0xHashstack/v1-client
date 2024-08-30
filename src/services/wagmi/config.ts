import { http, createConfig } from '@wagmi/core'
import { baseSepolia, mainnet, sepolia } from '@wagmi/core/chains'
import { cookieStorage, createStorage } from 'wagmi'

export const config = createConfig({
  chains: [baseSepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [baseSepolia.id]: http(),
  },
})