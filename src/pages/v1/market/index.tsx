import { Box, Button, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";

import MarketDashboard from "@/components/layouts/marketDashboard";
import NavButtons from "@/components/layouts/navButtons";
import PageCard from "@/components/layouts/pageCard";
import StatsBoard from "@/components/layouts/statsBoard";
import useDataLoader from "@/hooks/useDataLoader";

const Market: NextPage = () => {
  useDataLoader();

  return (
    <PageCard>
      <Box
        position="relative"
        width={"95%"}
        height={"150px"}
        marginTop="-7"
        marginBottom="8"
        paddingX="20"
      >
        <Image
          src="/defi_spring_banner.svg"
          alt="DeFi Spring"
          fill
          style={{ objectFit: "cover", borderRadius: "8px" }}
        />
        <Box
          position="absolute"
          //  top="2"
          top="7"
          left="7"
        >
          <Box
            color="#E6EDF3"
            fontSize="2.1rem"
            display="flex"
            alignItems="center"
            gap="2"
            fontWeight="bold"
          >
            Starknet
            <Text color="#7554E9">Defi Spring</Text>
            Is Live!
          </Box>
          <Box
            color="#BDBFC1"
            fontSize="1.4rem"
            display="flex"
            alignItems="center"
            gap="2"
            fontWeight="normal"
            marginTop="0"
          >
            Earn
            <Text
              bgGradient="linear-gradient(#7554E9, #FFFFFF)"
              bgClip="text"
              fontWeight="bold"
            >
              $STRK Tokens
            </Text>
          </Box>
          {/* <Button
            marginTop="2.5"
            color="white"
            bgGradient="linear-gradient(#7956EC, #1B29AE)"
            paddingY="0.3px"
            fontSize="sm"
            height="2rem"
            _hover={{ bgGradient: "linear-gradient(#1B29AE, #7956EC)" }}
          >
            Learn more
          </Button> */}
        </Box>
      </Box>
      <StatsBoard />
      <NavButtons width={95} marginBottom="1.125rem" />
      <MarketDashboard />
    </PageCard>
  );
};

export default Market;
