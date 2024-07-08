import { TextDecoder, TextEncoder } from 'util'
const axios = require('axios')

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

describe('get amm aprs', () => {
  const prices = []

  it('all the values should be greater than 0', async () => {
    const { data } = await axios.get(
      'https://metricsapimainnet.hashstack.finance/api/amm-aprs'
    )

    console.log(data)

    for (let i = 0; i < data.length; i++) {
      const apr = data[i].apr
      const tvl = data[i].tvl

      expect(apr).toBeGreaterThan(0)
      expect(tvl).toBeGreaterThan(0)
    }

    console.log(data)
  }, 20000)
})
