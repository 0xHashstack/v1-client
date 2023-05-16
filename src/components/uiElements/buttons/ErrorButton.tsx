import { Box, Button, Text } from "@chakra-ui/react";
import TickIcon from "@/assets/icons/tickIcon";
import React, { ReactNode, useEffect, useState } from "react";
const ErrorButton = ({ errorText }: { errorText: string }) => {
  return (
    <Box
      color="white"
      fontSize="14px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      // bgColor="red"
      height="100%"
      width="100%"
    >
      <Text color="white" ml="0.4rem">
        {errorText}
      </Text>
    </Box>
  );
};

export default ErrorButton;
