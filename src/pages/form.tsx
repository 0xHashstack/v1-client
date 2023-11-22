import Navbar from '@/components/Navbar'
import ContributorsChart from '@/components/charts/ContributorsChart'
import { Box,HStack,Text, useMediaQuery } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import DetailsForm from '@/components/Form/DetailsForm'
import { useAccount, useBalance } from 'wagmi'
import { useRouter } from 'next/router'
const form = () => {
  const [isLargerThan2000] = useMediaQuery('(min-width: 2000px)')
  const { address, isConnecting, isDisconnected } = useAccount();
  const router = useRouter();
  const usdtBalance = useBalance({
    address: address,
    token:"0xdAC17F958D2ee523a2206206994597C13D831ec7"
  })
  const usdcBalance=useBalance({
    address: address,
    token:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  })
  const [loading, setLoading] = useState<Boolean>(false);
  // useEffect(()=>{
  //   if(address && (Number(usdtBalance?.data?.formatted) > 50 || Number(usdcBalance?.data?.formatted) > 50)){
  //     setLoading(false);
  //   }

  //   else{
  //     router.push('/');
  //   }
  // },[address])

  return (
 <Box>
        <Box background={`
            radial-gradient(circle 1800px at top left, rgba(115, 49, 234, 0.10), transparent) top left,
            radial-gradient(circle 1200px at bottom right, rgba(115, 49, 234, 0.10), transparent) bottom right,
            black
          `} position={'fixed'} zIndex={3} >
          <Navbar />
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
      w="100%"
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