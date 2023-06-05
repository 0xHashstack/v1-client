import React from 'react';
import { Box, Text, keyframes, css } from '@chakra-ui/react';

const marqueeAnimation = keyframes`
0% { transform: translateX(0); }
100% { transform: translateX(-100%); }
`;

const Banner = () => {
    return (
        <Box display="flex" flexDirection="column" width="100%" position="fixed" top="90px" left="0px" right="0px" zIndex="1">

        <Box
            display="flex"
            alignItems="center"
            height="28px"
            background="black"
            width="100%"
            color="white"

        //   display="flex"
        //   alignItems="center"
        //   justifyContent="center"
        >
            <Box
                margin="0px auto"
                whiteSpace="nowrap"
                overflow="hidden"
                position="absolute"
                width="100%"
            >
                <Box
                    animation={`${marqueeAnimation} 5s linear 0s  infinite normal none running `}
                    gap="10px"
                >
                    <Box display="flex" justifyContent="space-between" width="100%">
                        <Box display="flex" alignItems="center" justifyContent="space-between" flexDirection="row" width="100%">

                        <Text as="span" pr="100px">
                            Welcome to our website!
                        </Text>
                        <Text as="span">
                            Welcome to our website!
                        </Text>
                        </Box>
                        {/* <Box display="flex" alignItems="center" justifyContent="space-between" flexDirection="row" width="100%">

<Text as="span" pr="100px">
    Welcome to our website!
</Text>
<Text as="span">
    Welcome to our website!
</Text>
</Box> */}
                    </Box>

                </Box>

                {/* <Text
        fontSize="xl"
        whiteSpace="nowrap"
        animation={`${marqueeAnimation} 10s linear  infinite normal none running `}
        mt="5px"
        css={css`
          &:hover {
            animation-play-state: paused;
          }
        `}
        gap="10px"
      >

      </Text> */}
            </Box>

        </Box>
        </Box>
    );
};

export default Banner;
