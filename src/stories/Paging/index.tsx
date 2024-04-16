import React, { useState } from 'react'
import { Box, Button, ButtonGroup, HStack, RadioGroup, Radio as RD, Stack,  } from '@chakra-ui/react'
import Image from "next/image";
import { capitalizeWords } from '@/utils/functions/capitalizeWords';
import FireIcon from '@/assets/icons/fireIcon';
import Pagination from '@/components/uiElements/pagination';
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
export const Paging = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: TabsProps) => {
  const mode = primary
    ? 'storybook-button--primary'
    : 'storybook-button--secondary'
      const [currentPagination, setCurrentPagination] = useState<number>(1)
  return (
    <Box>
    <Pagination
              currentPagination={currentPagination}
              setCurrentPagination={(x: any) => setCurrentPagination(x)}
              max={80|| 0}
              rows={6}
            />
    </Box>
  )
}
