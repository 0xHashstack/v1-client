import { HStack, Text } from "@chakra-ui/react";
import React from "react";

const Footer = () => {
  return (
    <HStack
      zIndex="14"
      position="fixed"
      bottom="0"
      backgroundColor="#161B22"
      width="100vw"
      boxShadow="rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      color="#FFF"
      height="2rem"
      bgColor="red"
      border="1px solid #2B2F35"
    >
      <Text>hey</Text>
    </HStack>
  );
};

export default Footer;
