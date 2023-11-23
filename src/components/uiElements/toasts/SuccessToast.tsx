import CancelIcon from '@/assets/icons/cancelIcon';
import SuccessTick from '@/assets/icons/successTick';
import { Box, Button, Text, useToast } from '@chakra-ui/react';
import CancelSuccessToast from '@/assets/icons/cancelSuccessToast';
import Link from 'next/link';
const SuccessToast= () => {
  const toast = useToast();

  toast({
    variant:'subtle',
    position:'bottom-right',
    render:()=>(
        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" bg="rgba(40, 167, 69, 0.5)" height="48px" borderRadius="6px" border="1px solid rgba(74, 194, 107, 0.4)" padding="8px" color="white" mb="4rem">
            <Box padding="8px" mr="0.4rem"><SuccessTick/></Box>
            <Box display="flex">
            <Text fontSize="14px" lineHeight="20px" fontWeight="400">You have successfully supplied 1000 USDT to check go to 
            <Link
              href="/your-borrow"
            >
                <Text >
                Your Supply
                </Text>
            </Link>
            </Text>
            <Box padding="8px" ml="0.4rem" cursor="pointer" ><CancelSuccessToast/></Box>
            </Box>
        </Box>
  ),
duration:700000000000,
    isClosable: false,
  });
  return null;

  
};

export default SuccessToast;
