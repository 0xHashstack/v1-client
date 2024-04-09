import React, { useState } from 'react'
import { Box, RadioGroup, Radio as RD, Stack,  } from '@chakra-ui/react'

interface TabsProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean
  /**
   * What background color to use
   */
  backgroundColor?: string
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Button contents
   */
  label: string
  /**
   * Optional click handler
   */
  onClick?: () => void
}

/**
 * Primary UI component for user interaction
 */
export const Radio = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: TabsProps) => {
  const [openDropdown, setopenDropdown] = useState(false)
  const [radioValue, setRadioValue] = useState('1')
  const mode = primary
    ? 'storybook-button--primary'
    : 'storybook-button--secondary'
  return (
    <Box>
                    <RadioGroup onChange={setRadioValue} value={radioValue}>
                      <Stack spacing={4} direction="row" color="#fff">
                        <RD
                          // variant="primary"
                          value="1"
                          // border

                          borderColor="#2B2F35"
                          colorScheme="customPurple"
                          // bg="black"
                          _checked={{
                            bg: 'black',
                            color: 'white',
                            borderWidth: '5px',
                            borderColor: '#4D59E8',
                          }}
                          _focus={{ boxShadow: 'none', outline: '0' }}
                          // onClick={() => {
                          //   setMethod("ADD_LIQUIDITY");
                          // }}
                        >
                          Liquidity provisioning
                        </RD>
                        <RD
                          fontSize="sm"
                          value="2"
                          // bg="#2B2F35"
                          borderColor="#2B2F35"
                          colorScheme="customPurple"
                          // bg="black"
                          _checked={{
                            bg: 'black',
                            color: 'white',
                            borderWidth: '5px',
                            borderColor: '#4D59E8',
                          }}
                          _focus={{ boxShadow: 'none', outline: '0' }}
                          // onClick={() => {
                          //   setMethod("SWAP");
                          // }}
                        >
                          {process.env.NEXT_PUBLIC_NODE_ENV == 'testnet'
                            ? 'Trade'
                            : 'Swap'}
                        </RD>
                      </Stack>
                    </RadioGroup>
    </Box>
  )
}
