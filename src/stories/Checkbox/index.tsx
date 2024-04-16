import { Checkbox as Cb, Text } from '@chakra-ui/react'

interface CheckboxProps {}

export const Checkbox = ({ ...props }: CheckboxProps) => {
  return (
    <Cb
      defaultChecked
      mt="0.7rem"
      w="410px"
      size="lg"
      iconSize="1rem"
      _focus={{ boxShadow: 'none' }}
      borderColor="#2B2F35"
      {...props}
    >
      <Text fontSize="sm" color="#6E7681" fontStyle="normal" ml=".4rem">
        I would like to stake the rTokens.
      </Text>
    </Cb>
  )
}
