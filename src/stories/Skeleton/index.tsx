import { Box, Skeleton as SK } from '@chakra-ui/react'
import React, { useState } from 'react'

interface SkeletonProps {
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
export const Skeleton = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: SkeletonProps) => {
  const [openDropdown, setopenDropdown] = useState(false)
  const mode = primary
    ? 'storybook-button--primary'
    : 'storybook-button--secondary'
  return (
    <Box display="flex" flexDirection="column" gap=".5rem">
      <SK
        width="6rem"
        height="1.4rem"
        startColor="#101216"
        endColor="#2B2F35"
        borderRadius="6px"
      />
      <SK
        width="6rem"
        height="1.4rem"
        startColor="#101216"
        endColor="#2B2F35"
        borderRadius="6px"
      />
      <SK
        width="6rem"
        height="1.4rem"
        startColor="#101216"
        endColor="#2B2F35"
        borderRadius="6px"
      />
    </Box>
  )
}
