import { Col, Button, Form, Modal, InputGroup, Input, Row } from "reactstrap";
import Image from "next/image";

import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";

import starknetLogoBordered from "../../assets/images/starknetLogoBordered.svg";
import OffchainAPI from "../../services/offchainapi.service";


const ExistingWhitelistModal = ({ accountAddress }: { accountAddress: any }) => {

  console.log('waitime2', accountAddress)
  const [renderTime, setRenderTime] = React.useState(new Date());

  useEffect(() => {
    setTimeout(() => {
      window.location.href = "https://discord.gg/hashstack";
    }, 5000)
  }, []);


  function getRedirectText() {
    let now = new Date();
    const waitTime = 5 - (Math.round((now.getTime() - renderTime.getTime())) / 1000);
    return <h6 style={{
      textAlign: "center",
      fontSize: "13px",
      color: "#919191",
      marginTop: "20px",
    }}>Redirecting to our discord server in {waitTime} seconds...</h6>
  }

  return (
    <>
      <div
        className="modal-body"
        style={{
          backgroundColor: "#1D2131",
          color: "white",
          padding: "40px",
          width: '40%',
          margin: '15vh 30% 0'
        }}
      >
          <Form>
            <div>
              <Col
                sm={8}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <h5
                  style={{
                    color: "white",
                    fontSize: "15px",
                    textAlign: "center",
                  }}
                >
                  You are already in the queue. We will send you an email from allowlist@hashstack.finance when you are whitelisted.
                </h5>
              </Col>
            </div>
            <div>
              <Col>
                <div>
                  {getRedirectText()}
                </div>
              </Col>
            </div>
          </Form>
      </div>
    </>
  );
};

export default ExistingWhitelistModal;
