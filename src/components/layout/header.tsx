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
  Navbar,
} from "reactstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useStarknetCall,
  useStarknet,
  useConnectors,
  useStarknetInvoke,
  useStarknetExecute,
  useTransactionManager,
  useAccount,
  useStarknetBlock,
  useBlock,
} from "@starknet-react/core";

import { ConnectWallet } from "../wallet";
import { useERC20Contract } from "../../hooks/starknet-react/starks";
import { tokenAddressMap } from "../../blockchain/stark-constants";
import useGetToken from "../../blockchain/mockups/useGetToken";
import "react-toastify/dist/ReactToastify.css";
import GetTokenButton from "./get-token-button";
import OffchainAPI from "../../services/offchainapi.service";
import "./header.module.scss";
import useMyAccount from "../../blockchain/hooks/evmWallets/getAddress";
import { IdentifierContext } from "../../blockchain/hooks/context/identifierContext";
// toast.configure({ autoClose: 4000 });

const Header = ({
  handleDisconnectWallet,
  handleConnectWallet,
}: {
  handleDisconnectWallet: () => void;
  handleConnectWallet: (connector: any) => void;
}) => {
  const [offchainCurrentBlock, setOffchainCurrentBlock] = useState("");
  const [get_token, setGet_token] = useState(false);
  const [isTransactionDone, setIsTransactionDone] = useState(false);
  const [currentProcessingToken, setCurrentProcessingToken] = useState(null);

  const { data: blockInfo } = useBlock();
  const { available, connect, disconnect } = useConnectors();
  const { transactions } = useTransactionManager();

  const { address: account } = useAccount();
  const _address = useMyAccount();

  let value = useContext(IdentifierContext);

  useEffect(() => {
    console.log("address", {_address});
    if (value) {
      value.setState({
        walletName: `wa`,
        address: `${_address}`,
        balance: `--`,
      });
    }
  }, [_address]);

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
        setOffchainCurrentBlock(stats.lastProcessedBlock?.blockNumber);
      },
      (err) => {
        console.error(err);
      }
    );

    console.log("transactions:::::::::", transactions);
  }, [transactions, blockInfo]);

  console.log(available);

  const Tokens = ["USDT", "USDC", "BTC", "BNB"];
  const options = [
    // 'mainnet', 'Goerli-1',
    "Goerli-2",
  ];
  // const defaultOption = options[1];

  const [selected, setSelected] = useState(options[0]);
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
    <Container className="headerContainer">
      <Row
        style={{ marginTop: "5px", position: "fixed", bottom: 0, left: "15px" }}
      >
        <div className="d-flex flex-wrap gap-2 block-status">
          <div style={{ color: "rgb(255 255 255 / 50%)" }}>
            Latest synced block:{" "}
          </div>
          <div className="sc-chPdSV hxkAVa css-x9zcw6" style={{ opacity: 0.6 }}>
            {offchainCurrentBlock}
          </div>
          <div className="green-circle"></div>
        </div>
      </Row>
      <Row>
        <Col
          className="d-flex flex-column justify-content-between"
          style={{ padding: "0 20px" }}
        >
          {/* <div className="navbar"> */}
          <Navbar>
            <div className="d-flex">
              <div>
                <Link href="/">
                  <div>
                    <img
                      src="https://common-static-assets.s3.ap-southeast-1.amazonaws.com/1111-44.png"
                      alt=""
                      style={{
                        height: "40px",
                      }}
                    ></img>
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
                          window.open(
                            // "https://faucet.goerli.starknet.io/"
                            "https://goerli2-bridge.hashstack.finance"
                          );
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

              <Dropdown isOpen={dropDownOpen} toggle={toggleDropdown}>
                <DropdownToggle caret>{selected}</DropdownToggle>

                <DropdownMenu>
                  {options.map((option) => (
                    <DropdownItem
                      key={option}
                      disabled
                      onClick={() => handleChange(option)}
                    >
                      {option}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              {account ? (
                <>
                  <Button
                    color="success"
                    outline
                    className="btn-outline"
                    onClick={handleDisconnectWallet}
                  >
                    <i className="fas fa-wallet font-size-16 align-middle me-2"></i>{" "}
                    {`${account.substring(0, 3)}...${account.substring(
                      account.length - 3,
                      account.length
                    )}`}{" "}
                    | Disconnect
                  </Button>
                </>
              ) : (
                <ConnectWallet />
              )}
            </div>
          </Navbar>
          {(blockInfo?.block_number || 0) - Number(offchainCurrentBlock) > 3 ? (
            <Container>
              <Row>
                <Alert
                  color="info"
                  style={{ marginTop: "10px", fontWeight: "bold" }}
                  className="text-center"
                >
                  ⚠️ Delay in syncing blocks. Not all data may be upto date.
                  Current network block: {blockInfo?.block_number} (
                  {(blockInfo?.block_number || 0) - offchainCurrentBlock} blocks
                  to sync)
                </Alert>
              </Row>
            </Container>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
