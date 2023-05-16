import { Button, Box, ButtonProps } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SuccessButton from "./SuccessButton";
interface Props extends ButtonProps {
  children: ReactNode;
}

const AnimatedButton: React.FC<Props> = ({ children, className, ...rest }) => {
  const classes = [];
  if (className) classes.push(className);
  const strings = [
    "Deposit Amount approved",
    "Successfully transferred to Hashstack’s supply vault.",
    "Determining the rToken amount to mint.",
    "rTokens have been minted successfully.",
    "Transaction complete.",
    "Supply success",
  ];
  const [currentStringIndex, setCurrentStringIndex] = useState(-1);
  const [isAnimationStarted, setIsAnimationStarted] = useState(false);
  const progressBarWidth = `${
    ((currentStringIndex + 1) / strings.length) * 100
  }%`;

  const handleClick = () => {
    console.log("clicked");
    if (!isAnimationStarted) {
      setIsAnimationStarted(true);
      setCurrentStringIndex(0);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isAnimationStarted) {
      interval = setInterval(() => {
        setCurrentStringIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex === strings.length) {
            setIsAnimationStarted(false);
            return -1; // Reset currentStringIndex to -1 after the animation completes
          }
          return nextIndex % strings.length;
        });
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isAnimationStarted]);
  const { bgColor } = rest;
  return (
    <Button
      onClick={handleClick}
      // w="35rem"
      // h="2.5rem"
      borderRadius="8px"
      // color="white"
      position="relative"
      overflow="hidden"
      className={classes.join(" ")}
      bgColor={isAnimationStarted ? "white" : bgColor}
      _hover={{ bg: "white",color:"black !important" }}
      _active={{border:"3px solid grey",bgColor:"white"}}
      {...rest}
      // _hover={{ color: "#010409" }}
    >
      <Box height="100%" width="100%" position="relative" overflow="hidden">
        <AnimatePresence initial={false}>
        {currentStringIndex === -1 ? 
        <motion.div
              key={currentStringIndex}
              initial={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -50 }}
              transition={{ duration: 1 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: "1",
                color: isAnimationStarted ? "#010409" : rest.color,
              }}
            >
              Supply
            </motion.div>
           :
          <motion.div
            key={currentStringIndex}
            initial={{ translateY: "100%" }}
            animate={{ translateY: "0%" }}
            exit={{ translateY: "-100%" }}
            transition={{ duration: 1 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: "1",
              color: isAnimationStarted ? "#010409" : `${rest.color}`,
              // __hover: {},
            }}
          >
            {currentStringIndex === -1 ? "Supply" : strings[currentStringIndex]}
            {/* {strings[currentStringIndex]} */}
          </motion.div>}
          {/* )} */}
        </AnimatePresence>
      </Box>
      <Box
        bgColor="#2DA44E"
        position="absolute"
        bottom={0}
        left={0}
        width={progressBarWidth}
        height="100%"
        zIndex={0}
        transition="width 0.5s ease-in-out"
      />
    </Button>
  );
};

export default AnimatedButton;
