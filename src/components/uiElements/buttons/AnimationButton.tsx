import { Button, Box, ButtonProps } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SuccessButton from "./SuccessButton";
import {
  selectCollateralCoinSelectedBorrowModal,
  selectTransactionStartedAndModalClosed,
  selectTransactionStatus,
  // setCurrentTransactionStatus,
  // selectCurrentTransactionStatus,
  setToastTransactionStarted,
} from "@/store/slices/userAccountSlice";
import { useDispatch, useSelector } from "react-redux";
import ErrorButton from "./ErrorButton";
interface Props extends ButtonProps {
  children: ReactNode;
  labelSuccessArray: Array<string | ReactNode>;
  labelErrorArray: Array<string | ReactNode>;
  currentTransactionStatus: any;
  setCurrentTransactionStatus: any;
}

const AnimatedButton: React.FC<Props> = ({
  labelSuccessArray,
  labelErrorArray,
  children,
  className,
  currentTransactionStatus,
  setCurrentTransactionStatus,
  ...rest
}) => {
  const classes = [];
  if (className) classes.push(className);
  const transactionFailed = [
    <ErrorButton errorText="Transaction failed" key={"error1"} />,
    <ErrorButton errorText="Copy error!" key={"error2"} />,
  ];
  //Below array is previously static data which is now used as labelArray as props

  // const strings = [
  //   "Deposit Amount approved",
  //   "Successfully transferred to Hashstack’s supply vault.",
  //   "Determining the rToken amount to mint.",
  //   "rTokens have been minted successfully.",
  //   "Transaction complete.",
  //   "Supply success",
  // ];

  const [currentStringIndex, setCurrentStringIndex] = useState(-1);
  const [progressBarWidth, setProgressBarWidth] = useState("0%");
  const [isAnimationStarted, setIsAnimationStarted] = useState(false);
  const transactionStatus = useSelector(selectTransactionStatus);
  const modalClosed = useSelector(selectTransactionStartedAndModalClosed);
  const [transFailed, setTransFailed] = useState(0);
  // const currentTransactionStatus = useSelector(selectCurrentTransactionStatus);
  // console.log(transactionStatus,"transaction from button");
  // useEffect(() => {
  //   if (modalClosed == true) {
  //     setCurrentStringIndex(-1);
  //     setProgressBarWidth("0%");
  //   }
  // }, [modalClosed]);
  console.log(modalClosed, "close");
  useEffect(() => {
    // console.log(transactionStatus);
    // if(modalClosed==true){
    //   setProgressBarWidth("0%");
    // }
    if (isAnimationStarted && transactionStatus == "success" && !modalClosed) {
      setProgressBarWidth(
        `${((currentStringIndex + 1) / labelSuccessArray.length) * 100 + 2}%`
      );

      // setProgressBarWidth(
      //   `${((currentStringIndex + 1) / labelArray.length) * 100 + 2}%`
      // );
      let interval: any = setInterval(() => {
        setProgressBarWidth(
          `${((currentStringIndex + 1) / labelSuccessArray.length) * 100 + 1}%`
        );
      }, 500);

      return () => clearInterval(interval);
    } else if (
      isAnimationStarted &&
      transactionStatus == "failed" &&
      !modalClosed
    ) {
      setProgressBarWidth(`${100}%`);

      // setProgressBarWidth(
      //   `${((currentStringIndex + 1) / labelArray.length) * 100 + 2}%`
      // );
      // let interval: any = setInterval(() => {
      //   setProgressBarWidth(
      //     `${((currentStringIndex + 1) / labelErrorArray.length) * 100 + 1}%`
      //   );
      // }, 500);

      // return () => clearInterval(interval);
    }
  }, [currentStringIndex, modalClosed]);

  useEffect(() => {
    if (isAnimationStarted && transactionStatus == "success" && !modalClosed) {
      // setProgressBarWidth(
      //   `${((currentStringIndex + 1) / labelArray.length) * 100 + 4}%`
      // );

      let interval: any = setInterval(() => {
        setProgressBarWidth(
          `${((currentStringIndex + 1) / labelSuccessArray.length) * 100}%`
        );
      }, 1500);

      return () => clearInterval(interval);
    } else if (isAnimationStarted && transactionStatus == "failed") {
      // let interval: any = setInterval(() => {
      //   setProgressBarWidth(
      //     `${((currentStringIndex + 1) / labelErrorArray.length) * 100}%`
      //   );
      // }, 1500);
      // return () => clearInterval(interval);
    }
  }, [currentStringIndex,modalClosed]);

  const dispatch = useDispatch();
  // const handleClick = () => {
  //   // console.log("clicked");
  //   if (!isAnimationStarted && currentStringIndex != labelSuccessArray.length - 1) {
  //     setIsAnimationStarted(true);
  //     setCurrentStringIndex(-1);
  //   }
  // };
  useEffect(() => {
    if (
      transactionStatus == "success" ||
      (transactionStatus == "failed" && !modalClosed)
    ) {
      setIsAnimationStarted(true);
    }
  }, [transactionStatus]);

  useEffect(() => {
    let interval: any;

    if (isAnimationStarted && transactionStatus == "success" && !modalClosed) {
      interval = setInterval(() => {
        setCurrentStringIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex === labelSuccessArray?.length - 2) {
            if (currentTransactionStatus === "") return prevIndex;
          }
          if (nextIndex === labelSuccessArray.length) {
            setIsAnimationStarted(false);
            // setCurrentTransactionStatus(false);
            return prevIndex; // Reset currentStringIndex to -1 after the animation completes
          }
          // return nextIndex % labelArray.length;
          return nextIndex % labelSuccessArray.length;
        });
      }, 2000);
    } else if (
      isAnimationStarted &&
      transactionStatus == "failed" &&
      !modalClosed
    ) {
      interval = setInterval(() => {
        setCurrentStringIndex((prevIndex) => {
          if (prevIndex == 1) return prevIndex;
          const nextIndex = prevIndex + 1;
          // if (nextIndex === labelErrorArray?.length - 1) {
          //   if (!currentTransactionStatus) return prevIndex;
          // }
          // if (nextIndex === labelErrorArray?.length) {
          if (transFailed === 0) {
            console.log("transaction animation before");
            setTransFailed((before) => before + 1);
            return 0;
          } else {
            console.log("transaction animation after");
            setIsAnimationStarted(false);
            dispatch(setToastTransactionStarted(false));
            return 1;
          }
          // if (nextIndex % labelErrorArray?.length === 0) {
          //   return nextIndex % labelErrorArray?.length;
          // }

          // // return prevIndex; // Reset currentStringIndex to -1 after the animation completes
          // // }
          // // return nextIndex % labelArray.length;
          // return nextIndex % labelErrorArray?.length;
        });
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isAnimationStarted, currentTransactionStatus]);
  useEffect(() => {
    console.log("Transaction animation failed", transFailed);
    if (transFailed > 2) setCurrentStringIndex(1);
  }, [transFailed]);
  const { bgColor } = rest;
  return (
    <Button
      // onClick={handleClick}

      // w="35rem"
      // h="2.5rem"
      borderRadius="8px"
      // color="white"
      position="relative"
      overflow="hidden"
      className={classes.join(" ")}
      // _hover={{ bg: "white", color: "black !important" }}
      _active={{ border: isAnimationStarted ? "" : "3px solid grey" }}
      {...rest}
      border={
        isAnimationStarted && !modalClosed && transactionStatus == "failed"
          ? "1px solid #9A131D"
          : "1px solid #8B949E"
      }
      bgColor={isAnimationStarted && !modalClosed ? "#eeeff2" : bgColor}
      color={isAnimationStarted && !modalClosed ? "#010409" : "#6A737D"}
      _hover={{ color: "#010409", bgColor: "#eeeff2" }}
    >
      <Box
        height="100%"
        width="100%"
        position="relative"
        overflow="hidden"
        // borderRadius="8px"
        // bgColor="blue"
      >
        <AnimatePresence initial={false}>
          {currentStringIndex === -1 ? (
            <motion.div
              key={currentStringIndex}
              initial={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -50 }}
              transition={{ duration: 0.4 }}
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
              }}
            >
              {children}
            </motion.div>
          ) : (
            <motion.div
              key={currentStringIndex}
              initial={{ translateY: "100%" }}
              animate={{ translateY: "0%" }}
              exit={{ translateY: "-100%" }}
              transition={{ duration: 0.4 }}
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
                // color: isAnimationStarted ? "#010409" : `${rest.color}`,
                // __hover: {},
              }}
            >
              {currentStringIndex === -1
                ? children
                : transactionStatus === "success"
                ? currentTransactionStatus === ""
                  ? labelSuccessArray[currentStringIndex]
                  : currentTransactionStatus === "success"
                  ? labelSuccessArray[currentStringIndex]
                  : currentStringIndex === labelSuccessArray.length - 1
                  ? transactionFailed[
                      labelSuccessArray.length - currentStringIndex === 1
                        ? 0
                        : 1
                    ]
                  : labelSuccessArray[currentStringIndex]
                : labelErrorArray[currentStringIndex]}
              {/* {labelArray[currentStringIndex]} */}
            </motion.div>
          )}
          {/* )} */}
        </AnimatePresence>
      </Box>
      <Box
        bgColor={
          transactionStatus === "success" ||
          (transactionStatus === "" &&
            (currentTransactionStatus === "" ||
              currentTransactionStatus === "success"))
            ? "#2DA44E"
            : "#CF222E"
        }
        position="absolute"
        bottom={0}
        left={0}
        width={progressBarWidth}
        height="100%"
        zIndex={0}
        transition="width 0.5s ease-in-out"
        // borderLeftRadius="8px"
      />
    </Button>
  );
};

export default AnimatedButton;
