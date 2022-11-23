import React, { useState, useContext, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Col,
  Modal,
  Button,
  Form,
  Spinner,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert,
  Row,
  Container,
} from "reactstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useStarknetCall,
  useStarknet,
  useConnectors,
  useStarknetInvoke,
  useStarknetExecute,
  useStarknetTransactionManager,
} from "@starknet-react/core";

import { ConnectWallet } from "../wallet";
import { useERC20Contract } from "../../hooks/starknet-react/starks";
import { tokenAddressMap } from "../../blockchain/stark-constants";
import useGetToken from "../../blockchain/mockups/useGetToken";
import "react-toastify/dist/ReactToastify.css";
import GetTokenButton from "./get-token-button";
import OffchainAPI from "../../services/offchainapi.service";

// toast.configure({ autoClose: 4000 });

const Header = ({
  handleDisconnectWallet,
  handleConnectWallet,
}: {
  handleDisconnectWallet: () => void;
  handleConnectWallet: (connector: any) => void;
}) => {
  const [get_token, setGet_token] = useState(false);
  const [offchainCurrentBlock, setOffchainCurrentBlock] = useState("");

  const { available, connect, disconnect } = useConnectors();
  const { transactions } = useStarknetTransactionManager();

  const { account } = useStarknet();

  const handleClickToken = async (
    token: string,
    loading: boolean,
    error: any,
    handleGetToken: (token: string) => Promise<void>
  ) => {
    const val = await handleGetToken(token);
    if (!loading && !error) {
      toast.success(`${token} received!`, {
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

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }

  function tog_token() {
    setGet_token(!get_token);
    removeBodyCss();
  }

  useEffect(() => {
    if (
      transactions.length > 0 &&
      transactions[transactions.length - 1]?.status === "ACCEPTED_ON_L2"
    ) {
      toast.success(`Token received!`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        closeOnClick: true,
      });
    }

    OffchainAPI.getDashboardStats().then(
      (stats) => {
        setOffchainCurrentBlock(stats.lastProcessedBlock.blockNumber);
      },
      (err) => {
        console.error(err);
      }
    );

    console.log("transactions:::::::::", transactions);
  }, [transactions]);

  console.log(available);

  const Tokens = ["USDT", "USDC", "BTC", "BNB"];
  const options = ["mainnet", "Goerli-1", "Goerli-2"];
  // const defaultOption = options[1];

  const [selected, setSelected] = useState(options[1]);
  const [dropDownOpen, setdropDownOpen] = useState(false);

  const handleChange = (network: any) => {
    setSelected(network);
    console.log("network selected --> ", network);
  };

  const toggleDropdown = () => {
    setdropDownOpen(!dropDownOpen);
  };

  return (
    // <div className="container">
    <Container>
      <Row>
        <Col id="" className="d-flex flex-column justify-content-center">
          <div className="navbar-header" style={{ marginRight: "15%" }}>
            <div className="d-flex">
              <div className="navbar-brand-box">
                <Link href="/">
                  <div>
                    <img
                      src="./main_logo.png"
                      alt=""
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
                          <GetTokenButton token={token} idx={idx} key={idx} />
                        );
                      })}

                      <Button
                        color="light"
                        outline
                        className="btn-outline"
                        style={{
                          margin: "18px",
                          width: "90%",
                        }}
                        disabled={account === null}
                        onClick={() => {
                          window.open("https://faucet.goerli.starknet.io/");
                        }}
                      >
                        Get ETH for gas fee
                      </Button>
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
                <ConnectWallet />
              )}

              <Dropdown isOpen={dropDownOpen} toggle={toggleDropdown}>
                <DropdownToggle caret>{selected}</DropdownToggle>

                <DropdownMenu>
                  <DropdownItem
                    disabled
                    onClick={() => handleChange(options[0])}
                  >
                    {options[0]}
                  </DropdownItem>
                  <DropdownItem
                    disabled
                    onClick={() => handleChange(options[1])}
                  >
                    {options[1]}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleChange(options[2])}>
                    {options[2]}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <Container>
            <Row>
              <Alert
                color="warning"
                style={{ marginRight: "15%" }}
                className="text-center"
              >
                Offchain block processed {offchainCurrentBlock}
              </Alert>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
    // </div>
  );
};

export default Header;
