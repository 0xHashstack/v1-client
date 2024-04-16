import { Checkbox as Cb, Text } from '@chakra-ui/react'

interface CheckBoxProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean

  checked?:boolean

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

export const Checkbox = ({ ...props }: CheckBoxProps) => {
  return (
    <Cb size="md" colorScheme="customPurple" borderColor="#2B2F35" {...props}>
      <Text fontSize="sm" color="#6E7681" fontStyle="normal" ml=".2rem">
        I would like to stake the rTokens.
      </Text>
    </Cb>
  )
}
