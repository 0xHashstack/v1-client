import React, { useState, useContext, useCallback, useEffect } from "react";
// import { Link } from "react-router-dom";
import Link from "next/link";
import { Col, Modal, Button, Form, Spinner } from "reactstrap";
// import { Web3ModalContext } from "../../contexts/Web3ModalProvider";
// import { Web3WrapperContext } from "../../contexts/Web3WrapperProvider";
// import { GetErrorText, BNtoNum } from "../../blockchain/utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useStarknetCall,
  useStarknet,
  useConnectors,
  useStarknetInvoke,
  useStarknetExecute,
} from "@starknet-react/core";
import { ConnectWallet } from "../wallet";
import { useERC20Contract } from "../../hooks/starknet-react/starks";
import { tokenAddressMap } from "../../blockchain/stark-constants";

// toast.configure({ autoClose: 4000 });

const Header = ({
  handleDisconnectWallet,
  handleConnectWallet,
}: {
  handleDisconnectWallet: () => void;
  handleConnectWallet: (connector: any) => void;
}) => {
  const [get_token, setGet_token] = useState(false);
  const [isTransactionDone, setIsTransactionDone] = useState(false);
  const [currentProcessingToken, setCurrentProcessingToken] = useState(null);

  const { available, connect, disconnect } = useConnectors();
  const { account } = useStarknet();

  const {
    data: dataUSDC,
    loading: loadingUSDC,
    error: errorUSDC,
    reset: resetUSDC,
    execute: USDC,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap["USDC"] as string,
      entrypoint: "mint",
      calldata: [account],
    },
  });

  const {
    data: dataUSDT,
    loading: loadingUSDT,
    error: errorUSDT,
    reset: resetUSDT,
    execute: USDT,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap["USDT"] as string,
      entrypoint: "mint",
      calldata: [account],
    },
  });

  const {
    data: dataBNB,
    loading: loadingBNB,
    error: errorBNB,
    reset: resetBNB,
    execute: BNB,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap["BNB"] as string,
      entrypoint: "mint",
      calldata: [account],
    },
  });

  const {
    data: dataBTC,
    loading: loadingBTC,
    error: errorBTC,
    reset: resetBTC,
    execute: BTC,
  } = useStarknetExecute({
    calls: {
      contractAddress: tokenAddressMap["BTC"] as string,
      entrypoint: "mint",
      calldata: [account],
    },
  });

  async function handleGetToken(token: string) {
    let val;
    switch (token) {
      case "BTC":
        val = await BTC();
        console.log(val);
        return;
      case "BNB":
        val = await BNB();
        console.log(val);
        return;
      case "USDC":
        val = await USDC();
        console.log(val);
        return;
      case "USDT":
        val = await USDT();
        console.log(val);
        return;
      default:
        console.log("invalid");
    }
  }

  const onSuccessCallback = (data: any, tokenName: any) => {
    // setIsTransactionDone(false);
    // setCurrentProcessingToken(null);
    // let _amount;
    // data.forEach((e) => {
    //   if (e.event == "TokensIssued") {
    //     _amount = e.args.amount.toBigInt();
    //   }
    // });
    // const amount = BNtoNum(_amount, 8);
    // toast.success(`${amount} ${tokenName} tokens Received Successfully.`, {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    //   closeOnClick: true,
    // });
  };

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  function tog_token() {
    setGet_token(!get_token);
    removeBodyCss();
  }

  console.log(available);

  const Tokens = ["USDT", "USDC", "BTC", "BNB"];
  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header" style={{ paddingRight: "2%" }}>
          <div className="d-flex">
            <div className="navbar-brand-box">
              {/* className="logo logo-dark" */}
              {/* <button
                onClick={() => {
                  BTC({
                    args: [account],
                  });
                }}
              >
                GetTokens
              </button> */}
              <Link href="/">
                <div>
                  <img
                    src="./main_logo.png"
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  ></img>
                  <span className="logo-sm">
                    <strong
                      style={{
                        color: "white",
                        fontSize: "22px",
                        fontWeight: "600",
                      }}
                    >
                      Hashstack
                    </strong>
                  </span>
                </div>
              </Link>
              {/* className="logo logo-light" */}
            </div>
          </div>

          <div className="d-flex flex-wrap gap-4">
            <Button
              color="light"
              outline
              className="btn-outline"
              style={{ float: "right" }}
              disabled={account === null}
              onClick={() => {
                tog_token();
              }}
            >
              Get Tokens
            </Button>
            <Modal
              isOpen={get_token}
              toggle={() => {
                tog_token();
              }}
              centered
            >
              <div className="modal-body">
                <Form>
                  <h5 style={{ textAlign: "center" }}>Get Token</h5>
                  <hr />
                  <div className="row mb-4">
                    {Tokens.map((token, idx) => {
                      return (
                        <Col sm={3} key={idx}>
                          <Button
                            className="btn-block btn-lg"
                            color="light"
                            outline
                            onClick={async () => {
                              const val = await handleGetToken(token);
                              console.log(val);
                            }}
                          >
                            {isTransactionDone &&
                            currentProcessingToken === "BTC" ? (
                              <Spinner>Loading...</Spinner>
                            ) : (
                              token
                            )}
                          </Button>
                        </Col>
                      );
                    })}
                  </div>
                </Form>
              </div>
            </Modal>
            <Button
              color="light"
              outline
              className="btn-outline"
              style={{ float: "right" }}
              disabled={account === null}
              onClick={() => {
                window.open(
                  "https://discord.com/channels/907151419650482217/907151709485277214"
                );
              }}
            >
              Join Discord
            </Button>
            {account ? (
              <>
                <Button
                  color="success"
                  outline
                  className="btn-outline"
                  onClick={handleDisconnectWallet}
                >
                  <i className="fas fa-wallet font-size-16 align-middle me-2"></i>{" "}
                  Disconnect
                </Button>
              </>
            ) : (
              <ConnectWallet
              // available={available}
              // handleConnectWallet={handleConnectWallet}
              />
            )}
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
