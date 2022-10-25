import React, {useEffect} from "react";
import { toast } from "react-toastify";
import { Button, Col, Spinner } from "reactstrap";
import useGetToken from "../../blockchain/mockups/useGetToken";
import {useStarknetTransactionManager} from '@starknet-react/core';

const GetTokenButton = ({ token, idx }: { token: string; idx: number }) => {
  const { handleGetToken, returnTransactionParameters } = useGetToken({
    token,
  });

  const {transactions} = useStarknetTransactionManager()

  const { data, loading, reset, error } = returnTransactionParameters(token);


  const handleClickToken = async (
    token: string,
    loading: boolean,
    error: any,
    handleGetToken: (token: string) => Promise<void>
  ) => {
    const val = await handleGetToken(token);
    if (transactions[transactions.length -1]?.status === 'RECIEVED') {
      toast.success(`${token} requested!`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }
    if (error) {
      toast.error(`${token} transfer unsucessful`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }
  };



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
        {loading ? <Spinner>Loading...</Spinner> : token}
      </Button>
    </Col>
  );
};

export default GetTokenButton;
