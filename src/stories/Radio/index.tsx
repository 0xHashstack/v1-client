import { Box, RadioGroup, Radio as RD, Stack } from '@chakra-ui/react'
import React, { useState } from 'react'

export const Radio = () => {
  const [radioValue, setRadioValue] = useState('1')

  return (
    <Box>
      <RadioGroup onChange={setRadioValue} value={radioValue}>
        <Stack spacing={4} direction="row" color="#fff">
          <RD
            value="1"
            borderColor="#2B2F35"
            colorScheme="customPurple"
            _checked={{
              bg: 'black',
              color: 'white',
              borderWidth: '5px',
              borderColor: '#4D59E8',
            }}
            _focus={{ boxShadow: 'none', outline: '0' }}
          >
            Liquidity provisioning
          </RD>
          <RD
            fontSize="sm"
            value="2"
            borderColor="#2B2F35"
            colorScheme="customPurple"
            _checked={{
              bg: 'black',
              color: 'white',
              borderWidth: '5px',
              borderColor: '#4D59E8',
            }}
            _focus={{ boxShadow: 'none', outline: '0' }}
          >
            {process.env.NEXT_PUBLIC_NODE_ENV == 'testnet' ? 'Trade' : 'Swap'}
          </RD>
        </Stack>
      </RadioGroup>
    </Box>
  )
}
