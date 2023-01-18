import React, { useEffect, useState, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Spinner } from "reactstrap";
import "./index.module.scss";

import { useSelector, useDispatch } from "react-redux";

import Footer from "./footer";
import PrimaryHeader from "./primaryHeader";

import "react-toastify/dist/ReactToastify.css";
import "./index.module.scss";
import {
  Connector,
  useAccount,
  useConnectors,
  useStarknet,
} from "@starknet-react/core";
import { ConnectWallet } from "../wallet";
import SecondaryHeader from "./temporaryHeader";

const Layout = (props: any) => {
  const dispatch = useDispatch();

  const { available, connect, disconnect } = useConnectors();
  const { address: account } = useAccount();

  const [isTransactionDone, setIsTransactionDone] = useState(false);

  const handleDisconnectWallet = () => {
    console.log(`should disconnect wallet`);
    disconnect();
  };

  const handleConnectWallet = (connector: Connector) => {
    if (connector) {
      console.log(connector);
      console.log(connect);
      connect(connector);
    }
  };

  let isPreloader = false;

  useEffect(() => {
    let timer: any;
    if (isPreloader === true) {
      document.getElementById("preloader")!.style.display = "block";
      document.getElementById("status")!.style.display = "block";

      timer = setTimeout(function () {
        document.getElementById("preloader")!.style.display = "none";
        document.getElementById("status")!.style.display = "none";
      }, 3000);
    } else {
      document.getElementById("preloader")!.style.display = "none";
      document.getElementById("status")!.style.display = "none";
    }
    console.log(account);
    return () => clearTimeout(timer);
  }, [isPreloader]);

  function switchScreens() {
    // if (account) {
    return (
      <>
        <SecondaryHeader
          handleConnectWallet={handleConnectWallet}
          handleDisconnectWallet={() => disconnect()}
        />
        <div style={{ margin: "0 200px" }} className="main-content">
          {props.children}
        </div>

        {/* <Footer /> */}

        {/* <Container>
            <Row style={{ marginTop: "25ch" }}>
              <Col lg="12">
                <div className="text-center mb-5">
                  <h4 className="font-weight-medium">
                    Welcome to Hashstack&apos;s public testnet !!
                  </h4>
                  <ConnectWallet />
                </div>
              </Col>
            </Row>
          </Container> */}
      </>
    );
    // } else if (!account) {
    //   return (
    //     <div id="layout-wrapper">
    //       <PrimaryHeader
    //         handleConnectWallet={handleConnectWallet}
    //         handleDisconnectWallet={() => disconnect()}
    //       />
    //   <div
    //     style={{ marginLeft: "200px", marginRight: "200px" }}
    //     className="main-content"
    //   >
    //     {props.children}
    //   </div>
    //   <Footer />
    // </div>
    //   );
    // } else {
    //   return null;
    // }
  }

  return (
    <React.Fragment>
      <div id="preloader">
        <div id="status">
          <div className="spinner-chase">
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
          </div>
        </div>
      </div>

      {switchScreens()}
    </React.Fragment>
  );
};

Layout.propTypes = {
  changeLayout: PropTypes.func /*  */,
  changeLayoutWidth: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.object,
  isPreloader: PropTypes.any,
  layoutWidth: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any,
};

export default Layout;
