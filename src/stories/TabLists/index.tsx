import React, { useState } from 'react'
import { Box, Tab, TabList, Tabs, Text } from '@chakra-ui/react'

interface TabsProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean
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

/**
 * Primary UI component for user interaction
 */
export const TabLists = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: TabsProps) => {
  const [openDropdown, setopenDropdown] = useState(false)
  const mode = primary
    ? 'storybook-button--primary'
    : 'storybook-button--secondary'
  return (
    <Box display="flex" gap="3rem">
      <Box  flexDirection="column">
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
      <Box  flexDirection="column">
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
