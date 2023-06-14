import AnimatedButton from "@/components/uiElements/buttons/AnimationButton";
import ErrorButton from "@/components/uiElements/buttons/ErrorButton";
import SuccessButton from "@/components/uiElements/buttons/SuccessButton";
import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { selectToastTransactionStarted } from "@/store/slices/userAccountSlice";
import { useSelector } from "react-redux";
const TransactionToast = () => {
  const toastTransactionStarted = useSelector(selectToastTransactionStarted);

  useEffect(() => {}, [toastTransactionStarted]);
  return (
    <Box
      backgroundColor="inherit"
      // display={toastTransactionStarted ? "block" : "hidden"}
      visibility={toastTransactionStarted ? "visible" : "hidden"}
      position="fixed"
      width="20vw"
      height="2rem"
      bottom="3rem"
      right="2rem"
      color="white"
    >
      <AnimatedButton
        position="fixed"
        bgColor="#101216"
        // p={0}
        color="#8B949E"
        size="sm"
        width="20%"
        // mt="1.5rem"
        // mb="1.5rem"
        // right="2rem"
        // bottom="3rem"
        borderRadius="2px"
        labelSuccessArray={[
          "Deposit Amount approved",
          "Successfully transferred to Hashstack’s supply vault.",
          "Determining the rToken amount to mint.",
          "rTokens have been minted successfully.",
          "Transaction complete.",
          // <ErrorButton errorText="Transaction failed" />,
          // <ErrorButton errorText="Copy error!" />,
          <SuccessButton key={"successButton"} successText={"Success"} />,
        ]}
        labelErrorArray={[
          // "Deposit Amount approved",
          // "Successfully transferred to Hashstack’s supply vault.",
          <ErrorButton errorText="Transaction failed" />,
          <ErrorButton errorText="Copy error!" />,
        ]}
        // transactionStarted={(depostiTransactionHash!="" || transactionFailed==true)}
        _disabled={{ bgColor: "white", color: "black" }}
        isDisabled={toastTransactionStarted != true}
        // onClick={}
      >
        Supply
      </AnimatedButton>
    </Box>
  );
};

export default TransactionToast;
