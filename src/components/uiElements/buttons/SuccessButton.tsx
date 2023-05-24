import { Box, Text } from "@chakra-ui/react";
import TickIcon from "@/assets/icons/tickIcon";
import { motion, useMotionValue, useTransform } from "framer-motion";
import React, { ReactNode, useEffect, useState } from "react";
import { relative } from "path";
const SuccessButton = ({ successText }: any) => {
  const iconAnimation = {
    scale: [0, 1], // Scale from 0 to 1
    transition: {
      duration: 2, // Animation duration in seconds
    },
  };
  let progress: any = useMotionValue(90);
  const circleLength = useTransform(progress, [0, 100], [0, 1]);
  const checkmarkPathLength = useTransform(progress, [0, 95, 100], [0, 0, 1]);
  return (
    <Box
      color="white"
      fontSize="14px"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: 100 }}
        style={{ x: progress }}
        transition={{ duration: 1 }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 258 258"
        >
          {/* Check mark  */}
          <motion.path
            transform="translate(60 85)"
            d="M3 50L45 92L134 3"
            fill="transparent"
            stroke="#FFFFFF"
            strokeWidth={16}
            style={{ pathLength: checkmarkPathLength }}
          />
        </motion.svg>
      </motion.div>
      {/* <motion.div initial={{ scale: 0 }} animate={iconAnimation}>
        <TickIcon />
      </motion.div> */}
      <Text ml="0.4rem">{successText}</Text>
    </Box>
  );
};

export default SuccessButton;
