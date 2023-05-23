import { Box, Text } from "@chakra-ui/react";
import TickIcon from "@/assets/icons/tickIcon";
import { motion } from "framer-motion";
import React, { ReactNode, useEffect, useState } from "react";
const SuccessButton = ({ successText }: any) => {
  const iconAnimation = {
    scale: [0, 1], // Scale from 0 to 1
    transition: {
      duration: 2, // Animation duration in seconds
    },
  };
  return (
    <Box
      color="white"
      fontSize="14px"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <motion.div initial={{ scale: 0 }} animate={iconAnimation}>
        <TickIcon />
      </motion.div>
      <Text ml="0.4rem">{successText}</Text>
    </Box>
  );
};

export default SuccessButton;
