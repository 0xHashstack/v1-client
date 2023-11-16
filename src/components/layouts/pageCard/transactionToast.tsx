// // import AnimatedButton from "@/components/uiElements/buttons/AnimationButton";
// import ErrorButton from "@/components/uiElements/buttons/ErrorButton";
// import SuccessButton from "@/components/uiElements/buttons/SuccessButton";
// import { Box } from "@chakra-ui/react";
// import React, { useEffect } from "react";
// import {
//   selectToastTransactionStarted,
//   selectCurrentTransactionStatus,
//   setCurrentTransactionStatus,
// } from "@/store/slices/userAccountSlice";
// import { useDispatch, useSelector } from "react-redux";
// const TransactionToast = () => {
//   const toastTransactionStarted = useSelector(selectToastTransactionStarted);
//   const currentTransactionStatus = useSelector(selectCurrentTransactionStatus);
//   const dispatch = useDispatch();
//   const [toastVisible, setToastVisible] = useState(false);
//   useEffect(() => {
//     if (toastTransactionStarted && currentTransactionStatus) {
//       const timer = setTimeout(() => {
//         setToastVisible(toastTransactionStarted);
//         dispatch(setCurrentTransactionStatus(""));
//         // dispatch(setToastTransactionStarted(false));
//         return;
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//     setToastVisible(toastTransactionStarted);
//   }, [toastTransactionStarted]);
//   return (
//     <Box
//       backgroundColor="inherit"
//       display={toastVisible ? "block" : "none"}
//       // visibility={toastTransactionStarted ? "visible" : "hidden"}
//       position="fixed"
//       width="20vw"
//       height="2rem"
//       bottom="3rem"
//       right="2rem"
//       color="white"
//       zIndex="10"
//     >
//       <AnimatedButtonToast
//         position="fixed"
//         bgColor="#101216"
//         // p={0}
//         color="#8B949E"
//         size="sm"
//         width="20%"
//         // mt="1.5rem"
//         // mb="1.5rem"
//         // right="2rem"AnimatedButtonToast
//         // bottom="3rem"
//         borderRadius="2px"
//         labelSuccessArray={[
//           "Deposit Amount approved",
//           "Successfully transferred to Hashstack’s supply vault.",
//           "Determining the rToken amount to mint.",
//           "rTokens have been minted successfully.",
//           "Transaction complete.",
//           // <ErrorButton errorText="Transaction failed" />,
//           // <ErrorButton errorText="Copy error!" />,
//           <SuccessButton key={"successButton"} successText={"Success"} />,
//         ]}
//         labelErrorArray={[
//           // "Deposit Amount approved",
//           // "Successfully transferred to Hashstack’s supply vault.",
//           <ErrorButton errorText="Transaction failed" key={"error 1"} />,
//           <ErrorButton errorText="Copy error!" key={"error 2"} />,
//         ]}
//         // transactionStarted={(depostiTransactionHash!="" || transactionFailed==true)}
//         _disabled={{ bgColor: "white", color: "black" }}
//         isDisabled={toastTransactionStarted === false}
//         // onClick={}
//       >
//         {/* Supply */}
//       </AnimatedButtonToast>
//     </Box>
//   );
// };

// export default TransactionToast;

// import { Button, ButtonProps } from "@chakra-ui/react";
// import { ReactNode, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// // import SuccessButton from "./SuccessButton";
// import {
//   selectCollateralCoinSelectedBorrowModal,
//   selectTransactionStatus,
//   setToastTransactionStarted,
// } from "@/store/slices/userAccountSlice";
// // import { useSelector } from "react-redux";
// interface Props extends ButtonProps {
//   children: ReactNode;
//   labelSuccessArray: Array<string | ReactNode>;
//   labelErrorArray: Array<string | ReactNode>;
// }

// const AnimatedButtonToast: React.FC<Props> = ({
//   labelSuccessArray,
//   labelErrorArray,
//   children,
//   className,
//   ...rest
// }) => {
//   const classes = [];
//   if (className) classes.push(className);

//   const dispatch = useDispatch();
//   //Below array is previously static data which is now used as labelArray as props

//   // const strings = [
//   //   "Deposit Amount approved",
//   //   "Successfully transferred to Hashstack’s supply vault.",
//   //   "Determining the rToken amount to mint.",
//   //   "rTokens have been minted successfully.",
//   //   "Transaction complete.",
//   //   "Supply success",
//   // ];

//   const [currentStringIndex, setCurrentStringIndex] = useState(-1);
//   const [progressBarWidth, setProgressBarWidth] = useState("0%");
//   const [isAnimationStarted, setIsAnimationStarted] = useState(false);
//   const transactionStatus = useSelector(selectTransactionStatus);
//   const [toastTransactionStatus, setToastTransactionStatus] = useState("");
//   const currentTransactionStatus = useSelector(selectCurrentTransactionStatus);
//   ////console.log(transactionStatus,"transaction from button");

//   useEffect(() => {
//     if (
//       isAnimationStarted &&
//       (toastTransactionStatus == "success" || transactionStatus == "success")
//     ) {
//       setProgressBarWidth(
//         `${((currentStringIndex + 1) / labelSuccessArray.length) * 100 + 2}%`
//       );

//       // setProgressBarWidth(
//       //   `${((currentStringIndex + 1) / labelArray.length) * 100 + 2}%`
//       // );
//       let interval: any = setInterval(() => {
//         setProgressBarWidth(
//           `${((currentStringIndex + 1) / labelSuccessArray.length) * 100 + 1}%`
//         );
//       }, 500);

//       return () => clearInterval(interval);
//     } else if (
//       isAnimationStarted &&
//       (toastTransactionStatus == "failed" || transactionStatus == "failed")
//     ) {
//       setProgressBarWidth(
//         `${((currentStringIndex + 1) / labelErrorArray.length) * 100 + 2}%`
//       );

//       // setProgressBarWidth(
//       //   `${((currentStringIndex + 1) / labelArray.length) * 100 + 2}%`
//       // );
//       let interval: any = setInterval(() => {
//         setProgressBarWidth(`${100}%`);
//       }, 500);

//       return () => clearInterval(interval);
//     }
//   }, [currentStringIndex]);

//   useEffect(() => {
//     if (
//       isAnimationStarted &&
//       (toastTransactionStatus == "success" || transactionStatus == "success")
//     ) {
//       // setProgressBarWidth(
//       //   `${((currentStringIndex + 1) / labelArray.length) * 100 + 4}%`
//       // );

//       let interval: any = setInterval(() => {
//         setProgressBarWidth(
//           `${((currentStringIndex + 1) / labelSuccessArray.length) * 100}%`
//         );
//       }, 1500);

//       return () => clearInterval(interval);
//     } else if (
//       isAnimationStarted &&
//       (toastTransactionStatus == "failed" || transactionStatus == "failed")
//     ) {
//       // let interval: any = setInterval(() => {
//       //   setProgressBarWidth(
//       //     `${((currentStringIndex + 1) / labelErrorArray.length) * 100}%`
//       //   );
//       // }, 1500);
//       // return () => clearInterval(interval);
//     }
//   }, [currentStringIndex]);

//   // const handleClick = () => {
//   //   ////console.log("clicked");
//   //   if (!isAnimationStarted && currentStringIndex != labelSuccessArray.length - 1) {
//   //     setIsAnimationStarted(true);
//   //     setCurrentStringIndex(-1);
//   //   }
//   // };
//   useEffect(() => {
//     if (transactionStatus == "success" || transactionStatus == "failed") {
//       setIsAnimationStarted(true);
//       setToastTransactionStatus(transactionStatus);
//     }
//   }, [transactionStatus]);

//   useEffect(() => {
//     let interval: any;
//     if (
//       isAnimationStarted &&
//       (toastTransactionStatus == "success" || transactionStatus == "success")
//     ) {
//       interval = setInterval(() => {
//         setCurrentStringIndex((prevIndex) => {
//           const nextIndex = prevIndex + 1;
//           if (nextIndex === labelSuccessArray?.length - 3) {
//             if (!currentTransactionStatus) return prevIndex;
//           }
//           if (nextIndex === labelSuccessArray.length) {
//             setIsAnimationStarted(false);
//             dispatch(setToastTransactionStarted(false));
//             return prevIndex; // Reset currentStringIndex to -1 after the animation completes
//           }
//           // return nextIndex % labelArray.length;
//           return nextIndex % labelSuccessArray.length;
//         });
//       }, 2000);
//     } else if (
//       isAnimationStarted &&
//       (toastTransactionStatus == "failed" || transactionStatus == "failed")
//     ) {
//       interval = setInterval(() => {
//         setCurrentStringIndex((prevIndex) => {
//           const nextIndex = prevIndex + 1;
//           if (nextIndex === labelErrorArray?.length) {
//             setIsAnimationStarted(false);
//             dispatch(setToastTransactionStarted(false));

//             return prevIndex; // Reset currentStringIndex to -1 after the animation completes
//           }
//           // return nextIndex % labelArray.length;
//           return nextIndex % labelErrorArray?.length;
//         });
//       }, 2000);
//     }

//     return () => clearInterval(interval);
//   }, [isAnimationStarted, currentTransactionStatus]);
//   const { bgColor } = rest;
//   return (
//     <Button
//       // onClick={handleClick}
//       // w="35rem"
//       // h="2.5rem"
//       borderRadius="8px"
//       // color="white"
//       position="relative"
//       overflow="hidden"
//       className={classes.join(" ")}
//       // _hover={{ bg: "white", color: "black !important" }}
//       _active={{ border: isAnimationStarted ? "" : "3px solid grey" }}
//       {...rest}
//       border={
//         isAnimationStarted &&
//         (toastTransactionStatus == "failed" || transactionStatus == "failed")
//           ? "1px solid #9A131D"
//           : "1px solid #8B949E"
//       }
//       bgColor={isAnimationStarted ? "#eeeff2" : bgColor}
//       color={isAnimationStarted ? "#010409" : "#6A737D"}
//       _hover={{ color: "#010409", bgColor: "#eeeff2" }}
//     >
//       <Box
//         height="100%"
//         width="100%"
//         position="relative"
//         overflow="hidden"
//         // borderRadius="8px"
//         // bgColor="blue"
//       >
//         <AnimatePresence initial={false}>
//           {currentStringIndex === -1 ? (
//             <motion.div
//               key={currentStringIndex}
//               initial={{ opacity: 0, translateY: 50 }}
//               animate={{ opacity: 1, translateY: 0 }}
//               exit={{ opacity: 0, translateY: -50 }}
//               transition={{ duration: 0.4 }}
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 zIndex: "1",
//               }}
//             >
//               {children}
//             </motion.div>
//           ) : (
//             <motion.div
//               key={currentStringIndex}
//               initial={{ translateY: "100%" }}
//               animate={{ translateY: "0%" }}
//               exit={{ translateY: "-100%" }}
//               transition={{ duration: 0.4 }}
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 zIndex: "1",
//                 // color: isAnimationStarted ? "#010409" : `${rest.color}`,
//                 // __hover: {},
//               }}
//             >
//               {currentStringIndex === -1
//                 ? children
//                 : toastTransactionStatus == "success" ||
//                   transactionStatus == "success"
//                 ? labelSuccessArray[currentStringIndex]
//                 : labelErrorArray[currentStringIndex]}
//               {/* {labelArray[currentStringIndex]} */}
//             </motion.div>
//           )}
//           {/* )} */}
//         </AnimatePresence>
//       </Box>
//       <Box
//         bgColor={
//           toastTransactionStatus == "success" || transactionStatus == "success"
//             ? "#2DA44E"
//             : currentStringIndex == labelErrorArray?.length - 2 ||
//               currentStringIndex == labelErrorArray?.length - 1
//             ? "#CF222E"
//             : "#2DA44E"
//         }
//         position="absolute"
//         bottom={0}
//         left={0}
//         width={progressBarWidth}
//         height="100%"
//         zIndex={0}
//         transition="width 0.5s ease-in-out"
//         // borderLeftRadius="8px"
//       />
//     </Button>
//   );
// };

// // export default AnimatedButton;
