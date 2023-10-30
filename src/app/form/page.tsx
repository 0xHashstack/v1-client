import Navbar from '@/components/Navbar'
import { Box } from '@chakra-ui/react'
import React from 'react'
const form = () => {
  return (
    <Box>
      <Box background="rgba(103, 109, 154, 0.10)"
        position={'fixed'} zIndex={3}
      >
        <Navbar/>
      </Box>
      <Box
        background={`
                radial-gradient(circle 1800px at top left, rgba(115, 49, 234, 0.15), transparent) top left,
                radial-gradient(circle 1300px at bottom right, rgba(115, 49, 234, 0.15), transparent) bottom right,
                black
              `}
        color="white"
        zIndex={1}
        padding="0"

        alignItems="center"
        minHeight={"100vh"}
        pt="8rem"
      >
        Form
      </Box>
    </Box>
  )
}

export default form