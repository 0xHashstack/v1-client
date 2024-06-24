import { Box } from '@chakra-ui/react'
import React, { useState } from 'react'

import Pagination from '@/components/uiElements/pagination'

export const Paging = () => {
  const [currentPagination, setCurrentPagination] = useState<number>(1)

  return (
    <Box>
      <Pagination
        currentPagination={currentPagination}
        setCurrentPagination={(x: any) => setCurrentPagination(x)}
        max={80 || 0}
        rows={6}
      />
    </Box>
  )
}
