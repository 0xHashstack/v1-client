import { Box, NumberInput, NumberInputField, Text } from '@chakra-ui/react'

interface InputProps {}

export const Input = ({ ...props }: InputProps) => {
  {
    /* border={`${
    depositAmount > walletBalance
      ? 
      : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
          depositAmount > maximumDepositAmount
        ? '1px solid #CF222E'
        : depositAmount < 0
          ? '1px solid #CF222E'
          : isNaN(depositAmount)
            ? '1px solid #CF222E'
            : process.env.NEXT_PUBLIC_NODE_ENV == 'mainnet' &&
                depositAmount < minimumDepositAmount &&
                depositAmount > 0
              ? '1px solid #CF222E'
              : depositAmount > 0 &&
                  depositAmount <= walletBalance
                ? '1px solid #00D395'
                : '1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))'
  }`} */
  }
  return (
    <>
      <Box display="flex" flexDirection="column" gap=".1rem" mt=".8rem">
        <Text color="#f9f8f9" fontSize="sm">
          Default
        </Text>
        <Box
          width="16rem"
          color="white"
          borderRadius="6px"
          border="1px solid #2B2F35"
          justifyContent="space-between"
          mt="0.3rem"
        >
          <NumberInput
            paddingInlineEnd="0px"
            border="0px"
            min={0}
            keepWithinRange={true}
            color="white"
            outline="none"
            precision={4}
            _disabled={{ cursor: 'pointer' }}
          >
            <NumberInputField
              paddingInlineEnd="0px"
              placeholder="Enter the number value"
              _disabled={{ color: '#00D395' }}
              border="0px"
              _placeholder={{
                color: '#3E415C',
                fontSize: '.89rem',
                fontWeight: '600',
                outline: 'none',
              }}
              _focus={{
                outline: '0',
                boxShadow: 'none',
              }}
            />
          </NumberInput>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap=".1rem" mt=".8rem">
        <Text color="#f9f8f9" fontSize="sm">
          Error
        </Text>
        <Box
          width="16rem"
          color="white"
          borderRadius="6px"
          border="1px solid #CF222E"
          justifyContent="space-between"
          mt="0.3rem"
        >
          <NumberInput
            paddingInlineEnd="0px"
            border="0px"
            min={0}
            keepWithinRange={true}
            color="white"
            outline="none"
            precision={4}
            _disabled={{ cursor: 'pointer' }}
          >
            <NumberInputField
              paddingInlineEnd="0px"
              placeholder="Enter the number value"
              _disabled={{ color: '#00D395' }}
              border="0px"
              _placeholder={{
                color: '#3E415C',
                fontSize: '.89rem',
                fontWeight: '600',
                outline: 'none',
              }}
              _focus={{
                outline: '0',
                boxShadow: 'none',
              }}
            />
          </NumberInput>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap=".1rem" mt=".8rem">
        <Text color="#f9f8f9" fontSize="sm">
          Success
        </Text>
        <Box
          width="16rem"
          color="white"
          borderRadius="6px"
          border="1px solid #00D395"
          justifyContent="space-between"
          mt="0.3rem"
        >
          <NumberInput
            paddingInlineEnd="0px"
            border="0px"
            min={0}
            keepWithinRange={true}
            color="white"
            outline="none"
            precision={4}
            _disabled={{ cursor: 'pointer' }}
          >
            <NumberInputField
              paddingInlineEnd="0px"
              placeholder="Enter the number value"
              _disabled={{ color: '#00D395' }}
              border="0px"
              _placeholder={{
                color: '#3E415C',
                fontSize: '.89rem',
                fontWeight: '600',
                outline: 'none',
              }}
              _focus={{
                outline: '0',
                boxShadow: 'none',
              }}
            />
          </NumberInput>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap=".1rem" mt=".8rem">
        <Text color="#f9f8f9" fontSize="sm">
          Disabled
        </Text>
        <Box
          width="16rem"
          color="white"
          borderRadius="6px"
          border="1px solid #2B2F35"
          justifyContent="space-between"
          mt="0.3rem"
        >
          <NumberInput
            paddingInlineEnd="0px"
            border="0px"
            min={0}
            keepWithinRange={true}
            color="white"
            outline="none"
            precision={4}
            isDisabled
          >
            <NumberInputField
              paddingInlineEnd="0px"
              placeholder="Enter the number value"
              border="0px"
              _placeholder={{
                color: '#3E415C',
                fontSize: '.89rem',
                fontWeight: '600',
                outline: 'none',
              }}
              _focus={{
                outline: '0',
                boxShadow: 'none',
              }}
            />
          </NumberInput>
        </Box>
      </Box>
    </>
  )
}
