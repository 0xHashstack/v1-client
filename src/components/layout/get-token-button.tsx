import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, Spinner } from "reactstrap";
import useGetToken from "../../blockchain/mockups/useGetToken";
import { useTransactionReceipt } from "@starknet-react/core";
import { InvokeFunctionResponse } from "starknet";
import { TxToastManager } from "../../blockchain/txToastManager";
import {
  getTokenFromName,
  isTransactionLoading,
} from "../../blockchain/stark-constants";
import MySpinner from "../mySpinner";

const GetTokenButton = ({ token, idx }: { token: string; idx: number }) => {
  let tokenInfo = getTokenFromName(token);
  const { handleGetToken, returnTransactionParameters } = useGetToken({
    token: tokenInfo?.address || "",
  });

  const { data, loading, reset, error } = returnTransactionParameters();
  const [transaction, setTransaction] = useState("");
  const transactionReceipt = useTransactionReceipt({
    hash: transaction,
    watch: true,
  });

  const handleClickToken = async (
    token: string,
    loading: boolean,
    error: any,
    handleGetToken: () => Promise<InvokeFunctionResponse>
  ) => {
    try {
      const val = await handleGetToken();
      if (val) {
        setTransaction(val.transaction_hash);
      } else {
      }
    } catch (err) {
      // console.log(err, "err get tokens");
    }
  };

  useEffect(() => {
    TxToastManager.handleTxToast(
      transactionReceipt,
      `Mint Testnet tokens: ${token}`
    );
  }, [transactionReceipt]);

  return (
    <Col sm={3} key={idx}>
      <Button
        className="btn-block btn-lg"
        color="light"
        outline
        onClick={async () =>
          await handleClickToken(
            token,
            loading as boolean,
            error,
            handleGetToken
          )
        }
      >
        {isTransactionLoading(transactionReceipt) ? (
          <MySpinner text={token} />
        ) : (
          token
        )}
      </Button>
    </Col>
  );
};

export default GetTokenButton;
