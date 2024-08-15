import { http, createConfig } from '@wagmi/core'
import { baseSepolia, mainnet, sepolia } from '@wagmi/core/chains'

export const config = createConfig({
  chains: [mainnet, baseSepolia],
  transports: {
    [mainnet.id]: http(),
    [baseSepolia.id]: http(),
  },
})