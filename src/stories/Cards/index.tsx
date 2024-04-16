import Stats from '@/components/layouts/stats'
import { Checkbox as Cb, Flex, HStack, Text } from '@chakra-ui/react'

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

export const Cards = ({ ...props }: CheckBoxProps) => {
  return (
    <Flex
      display="flex"
      flexDirection="column"
      h="6.4rem"
      w="1500px"
      flexWrap="wrap"
      marginBottom="6"
    >
      <HStack
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        h="100%"
        flexWrap="wrap"
      >
        <Stats
          header={["Your Net Worth", "Your Supply", "Your Borrow", "Net APR"]}
          statsData={[199,200,300,121.45]}
          arrowHide={false}
          onclick={()=>{}}
        />
        <Stats
          header={[
            "Total Reserves",
            "Available Reserves",
            "Avg. Asset Utillization",
          ]}
          statsData={[1000000,200000,80]}
          arrowHide={false}
          onclick={()=>{}}
        />
      </HStack>
    </Flex>
  )
}
