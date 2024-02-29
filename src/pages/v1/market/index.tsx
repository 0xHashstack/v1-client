import "react-toastify/dist/ReactToastify.css";

import MarketDashboard from "@/components/layouts/marketDashboard";
import NavButtons from "@/components/layouts/navButtons";
import PageCard from "@/components/layouts/pageCard";
import StatsBoard from "@/components/layouts/statsBoard";
import useDataLoader from "@/hooks/useDataLoader";
import { Box, Button, Text } from "@chakra-ui/react";
import Image from "next/image";

export default function Market() {
  useDataLoader();

  return (
    <PageCard>
      <Box
        position="relative"
        width={"95%"}
        height={"200px"}
        marginTop="-6"
        marginBottom="8"
        paddingX="20"
      >
        <Image
          src="/defi_spring_banner.svg"
          alt="DeFi Spring"
          fill
          style={{ objectFit: "cover", borderRadius: "8px" }}
        />
        <Box position="absolute" top="8" left="7">
          <Box
            color="#E6EDF3"
            fontSize="2.6rem"
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
            fontSize="1.8rem"
            display="flex"
            alignItems="center"
            gap="2"
            fontWeight="normal"
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
          <Button
            marginTop="3"
            color="white"
            bgGradient="linear-gradient(#7956EC, #1B29AE)"
            paddingY="0.3px"
            fontSize="sm"
            height="2rem"
            _hover={{ bgGradient: "linear-gradient(#7956EC, #1B29AE)" }}
          >
            Learn more
          </Button>
        </Box>
      </Box>
      <StatsBoard />
      <NavButtons width={95} marginBottom={"1.125rem"} />
      <MarketDashboard />
    </PageCard>
  );
}
