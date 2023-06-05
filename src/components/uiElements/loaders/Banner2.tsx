import React from 'react';
import { Box, Text, keyframes, css } from '@chakra-ui/react';

const marqueeAnimation = keyframes`
0% { transform: translateX(0); }
100% { transform: translateX(-200%); }
`;
const Banner2 = () => {
  return (
    <Box display="flex" flexDirection="column" width="100%" position="fixed" top="90px" left="0px" right="0px" zIndex="1">
    <Box display="flex" justifyContent="flex-start" background="black" overflow="hidden" width="100%">
        <Text whiteSpace="nowrap" padding="0 6rem" animation={`${marqueeAnimation} 6000ms linear infinite`} width="100%" color="white">Welcome</Text>
        <Text whiteSpace="nowrap" padding="0 6rem" animation={`${marqueeAnimation} 6000ms linear infinite`} width="100%" color="white">Welcome</Text>
        <Text whiteSpace="nowrap" padding="0 6rem" animation={`${marqueeAnimation} 6000ms linear infinite`} width="100%" color="white">Welcome</Text>
        <Text whiteSpace="nowrap" padding="0 6rem" animation={`${marqueeAnimation} 6000ms linear infinite`} width="100%" color="white">Welcome</Text>
    </Box>
    </Box>
  )
}

export default Banner2