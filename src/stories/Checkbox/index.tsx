import { Checkbox as Cb, Text } from '@chakra-ui/react'

interface CheckboxProps {}

export const Checkbox = ({ ...props }: CheckboxProps) => {
  return (
    <Cb
      defaultChecked
      mt="0.7rem"
      w="410px"
      size="md"
      iconSize="1rem"
      _focus={{ boxShadow: 'none' }}
      borderColor="#2B2F35"
      {...props}
    >
      <Text
        fontSize="10.5px"
        color="#6E7681"
        fontStyle="normal"
        fontWeight="400"
        lineHeight="20px"
      >
        Ticking would stake the received rTokens unchecking wouldn&apos;t stake
        rTokens
      </Text>
    </Cb>
  )
}
