import { Box, Text } from "@chakra-ui/react";
import TickIcon from "@/assets/icons/tickIcon";
import React, { ReactNode, useEffect, useState } from "react";
const SuccessButton = ({ successText }: any) => {
  return (
    <Box
      color="white"
      fontSize="14px"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <TickIcon />
      <Text ml="0.4rem">{successText}</Text>
    </Box>
  );
};

export default SuccessButton;
