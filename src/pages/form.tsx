import Navbar from '@/components/Navbar'
import ContributorsChart from '@/components/charts/ContributorsChart'
import { Box,HStack,Text } from '@chakra-ui/react'
import React from 'react'
import DetailsForm from '@/components/Form/DetailsForm'
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
        pr="2rem"
        pl="2rem"
        alignItems="center"
        minHeight={"100vh"}
        pt="8rem"
      >
        <Text color="white" mb="1rem">
          Presale form
        </Text>
        {/* <ContributorsChart/> */}
        <HStack
      w="95%"
      h="30%"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
    >
        <DetailsForm/>
        {/* <DetailsForm/> */}


      </HStack>
   
        <Text color="white" mb="1rem">
          Tokenomics
        </Text>
        <ContributorsChart/>

        
        </Box>
    
    </Box>
  )
}

export default form