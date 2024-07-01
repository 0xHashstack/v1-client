import { TextDecoder, TextEncoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

const { Contract, RpcProvider } = require('starknet')

const {
  getProvider,
  metricsContractAddress,
  contractsEnv,
} = require('../src/Blockchain/stark-constants')
const metricsAbi = require('../src/Blockchain/abis_mainnet/metrics_abi.json')

describe('Get user deposits', () => {
  it('displays user deposits', async () => {
    const accountAddress =
      '0x05d3a8f378500497479d3a16cfcd54657246dc37da8270b52e49319fac139939'

    const provider = new RpcProvider({
      nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
    })

    const metricsContract = new Contract(
      metricsAbi,
      metricsContractAddress,
      provider
    )

    const tokens = contractsEnv?.TOKENS
    const deposits = []

    for (let i = 0; i < tokens.length; ++i) {
      const token = tokens[i]
      const res = await metricsContract.call(
        'get_user_deposit',
        [token?.rToken, accountAddress],
        {
          blockIdentifier: 'pending',
        }
      )
      deposits.push(res)
    }

    expect(deposits.length).toEqual(6)
  }, 10000)
})
