import { Box, Tab, TabList, Tabs } from '@chakra-ui/react'

/**
 * Primary UI component for user interaction
 */
export const TabLists = () => {
  return (
    <Box display="flex" gap="3rem">
      <Box flexDirection="column">
        <Tabs variant="unstyled">
          <TabList borderRadius="md">
            <Tab
              py="5px"
              px="10px"
              color="#676D9A"
              fontSize="sm"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              borderLeftRadius="6px"
              fontWeight="normal"
              cursor="pointer"
              _selected={{
                color: 'white',
                bg: '#4D59E8',
                border: 'none',
              }}
            >
              Stake
            </Tab>
            <Tab
              py="5px"
              px="10px"
              color="#676D9A"
              fontSize="sm"
              cursor="pointer"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              borderRightRadius="6px"
              fontWeight="normal"
              _selected={{
                color: 'white',
                bg: '#4D59E8',
                border: 'none',
              }}
            >
              Unstake
            </Tab>
          </TabList>
        </Tabs>
      </Box>
      <Box flexDirection="column">
        <Tabs variant="unstyled">
          <TabList borderRadius="md">
            <Tab
              py="5px"
              px="10px"
              color="#676D9A"
              fontSize="sm"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              borderLeftRadius="6px"
              fontWeight="normal"
              cursor="pointer"
              _selected={{
                color: 'white',
                bg: '#4D59E8',
                border: 'none',
              }}
            >
              Borrow Actions
            </Tab>
            <Tab
              py="5px"
              px="10px"
              color="#676D9A"
              fontSize="sm"
              cursor="pointer"
              border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              borderRightRadius="6px"
              fontWeight="normal"
              _selected={{
                color: 'white',
                bg: '#4D59E8',
                border: 'none',
              }}
            >
              Add Collateral
            </Tab>
          </TabList>
        </Tabs>
      </Box>
    </Box>
  )
}
