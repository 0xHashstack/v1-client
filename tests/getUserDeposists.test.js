import { TextDecoder, TextEncoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

const { Contract } = require('starknet')

const {
  getProvider,
  metricsContractAddress,
} = require('../src/Blockchain/stark-constants')
const metricsAbi = require('../src/Blockchain/abis_mainnet/metrics_abi.json')

describe('Get user deposits', () => {
  it('displays user deposits', () => {
    const accountAddress =
      '0x05d3a8f378500497479d3a16cfcd54657246dc37da8270b52e49319fac139939'

    const provider = getProvider()

    const metricsContract = new Contract(
      metricsAbi,
      metricsContractAddress,
      provider
    )

    let contractsEnv =
      process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
        ? DeployDetailsProd.sepolia
        : DeployDetailsProd.mainnet

    const tokens = contractsEnv?.TOKENS
    const promises = []

    for (let i = 0; i < tokens.length; ++i) {
      const token = tokens[i]
      const res = metricsContract.call(
        'get_user_deposit',
        [token?.rToken, accountAddress],
        {
          blockIdentifier: 'pending',
        }
      )
      promises.push(res)
      console.log(res, 'res-------------------')
    }

    expect(promises.length).toEqual(0)

    // const deposits = getUserDeposits(accountAddress)

    // expect(deposits.length).toEqual(0)

    // return new Promise((resolve, reject) => {
    //   Promise.allSettled([...promises]).then((val) => {
    //     const results = val
    //       .filter((deposit, idx) => {
    //         return deposit?.status == 'fulfilled' && deposit?.value
    //       })
    //       .map((deposit, idx) => {
    //         if (deposit?.status == 'fulfilled' && deposit?.value)
    //           return parseDeposit(deposit?.value?.deposit)
    //         else return {}
    //       })
    //     //console.log("supplies result: ", results);
    //     resolve(results)
    //   })
    // })
  })
})
