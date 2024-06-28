import { TextDecoder, TextEncoder } from 'util'
import EmpiricAbi from '../src/Blockchain/abis_mainnet/empiric_proxy.json'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
const { contractsEnv } = require('../src/Blockchain/stark-constants')
const { RpcProvider, Contract, shortString, num } = require('starknet')

describe('get prices', () => {
  let prices = []

  beforeAll(async () => {
    const MEDIAN_AGGREGATION_MODE = shortString.encodeShortString('MEDIAN')
    const provider = new RpcProvider({
      nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
    })
    const empiricContract = new Contract(
      EmpiricAbi.abi,
      contractsEnv.EMPIRIC_PROXY_ADDRESS,
      provider
    )

    for (let i = 0; i < contractsEnv.TOKENS.length; ++i) {
      const token = contractsEnv.TOKENS[i]
      const result = await empiricContract.call('get_spot', [
        token.pontis_key,
        MEDIAN_AGGREGATION_MODE,
      ])

      const price = num.toBigInt(result.price.toString())
      const decimals = num.toBigInt(result.decimals.toString())
      const last_updated_timestamp = num.toBigInt(
        result.last_updated_timestamp.toString()
      )
      const lastUpdated = new Date(Number(last_updated_timestamp) * 1000)

      const oraclePrice = {
        name: token.name,
        address: token.address,
        price: (Number(price) * 100) / Math.pow(10, Number(decimals)) / 100,
        lastUpdated,
      }

      prices.push(oraclePrice)
    }
  }, 10000)

  it('should display prices', () => {
    expect(prices.length).toBe(6)
  }, 10000)

  it('should validate oracle price structure and values', () => {
    prices.forEach((oraclePrice) => {
      expect(oraclePrice).toHaveProperty('name')
      expect(oraclePrice).toHaveProperty('address')
      expect(oraclePrice).toHaveProperty('price')
      expect(oraclePrice).toHaveProperty('lastUpdated')

      expect(typeof oraclePrice.name).toBe('string')
      expect(typeof oraclePrice.address).toBe('string')
      expect(typeof oraclePrice.price).toBe('number')
      expect(oraclePrice.price).toBeGreaterThan(0)
      expect(oraclePrice.lastUpdated instanceof Date).toBe(true)
    })
  })
})
