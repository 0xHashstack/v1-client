import { Col, Button, Form, Modal, InputGroup, Input } from "reactstrap";
import Image from "next/image";

import "react-toastify/dist/ReactToastify.css";
import React from "react";

import starknetLogoBordered from "../../assets/images/starknetLogoBordered.svg";
import OffchainAPI from "../../services/offchainapi.service";


const ExistingWhitelistModal = ({ accountAddress }: { accountAddress: any }) => {


  return (
    <>
      <Modal isOpen={true} centered>
        <div
          className="modal-body"
          style={{
            backgroundColor: "#1D2131",
            color: "white",
            padding: "40px",
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
            </Form>
        </div>
      </Modal>
    </>
  );
};

export default ExistingWhitelistModal;
