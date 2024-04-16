import Stats from '@/components/layouts/stats'
import { Flex, HStack } from '@chakra-ui/react'

export const Cards = () => {
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
          header={['Your Net Worth', 'Your Supply', 'Your Borrow', 'Net APR']}
          statsData={[199, 200, 300, 121.45]}
          arrowHide={false}
          onclick={() => {}}
        />
        <Stats
          header={[
            'Total Reserves',
            'Available Reserves',
            'Avg. Asset Utillization',
          ]}
          statsData={[1000000, 200000, 80]}
          arrowHide={false}
          onclick={() => {}}
        />
      </HStack>
    </Flex>
  )
}
