import {
  Box,
  Input as In,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react'

interface InputProps {
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input = ({ value, onChange }: InputProps) => {
  return (
    <>
      <Box display="flex" flexDirection="column" gap=".1rem" mt=".8rem">
        <Text color="#f9f8f9" fontSize="sm">
          Default (Text)
        </Text>
        <Box
          width="16rem"
          color="white"
          borderRadius="6px"
          border="1px solid #2B2F35"
          justifyContent="space-between"
          mt="0.3rem"
        >
          <In
            border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
            placeholder={'Enter the string value'}
            fontSize="sm"
            _placeholder={{ color: '#676D9A' }}
            color="#f2f2f2"
            value={value}
            onChange={onChange}
          />
        </Box>
      </Box>

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
              color="#CF222E"
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
              color="#00D395"
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
