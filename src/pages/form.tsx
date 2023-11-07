import Navbar from '@/components/Navbar'
import ContributorsChart from '@/components/charts/ContributorsChart'
import { Box,HStack,Text, useMediaQuery } from '@chakra-ui/react'
import React from 'react'
import DetailsForm from '@/components/Form/DetailsForm'
const form = () => {
  const [isLargerThan2000] = useMediaQuery('(min-width: 2000px)')
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
        // mb="4rem"
      
        pr="2rem"
        pl={isLargerThan2000 ?"6rem":"2rem"} 
        display="flex"
        flexDirection="column"
        minHeight={"100vh"}
        pt="8rem"
      >
        <Text    color="white" mb="4rem">
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
   
        <Text color="white" mt="3rem" mb="2rem">
          Tokenomics
        </Text>
        <ContributorsChart/>

        
        </Box>
    
    </Box>
  )
}

export default form