import { Checkbox as Cb, Text } from '@chakra-ui/react'

interface CheckboxProps {}

export const Checkbox = ({ ...props }: CheckboxProps) => {
  return (
    <Cb size="md" colorScheme="customPurple" borderColor="#2B2F35" {...props}>
      <Text fontSize="sm" color="#6E7681" fontStyle="normal" ml=".2rem">
        I would like to stake the rTokens.
      </Text>
    </Cb>
  )
}
