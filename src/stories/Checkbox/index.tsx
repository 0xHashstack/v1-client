import { Box, Checkbox as Cb, Text } from '@chakra-ui/react'

interface CheckBoxProps {
  label?: string
}

export const Checkbox = ({ label }: CheckBoxProps) => {
  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <Cb size="md" colorScheme="customPurple" borderColor="#2B2F35">
        <Text fontSize="sm" color="#6E7681" fontStyle="normal" ml=".2rem">
          {label}
        </Text>
      </Cb>
      <Cb
        defaultChecked={true}
        size="md"
        colorScheme="customPurple"
        borderColor="#2B2F35"
      >
        <Text fontSize="sm" color="#6E7681" fontStyle="normal" ml=".2rem">
          {label}
        </Text>
      </Cb>
    </Box>
  )
}
