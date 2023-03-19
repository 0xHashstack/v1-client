import { Col, Button, Form, Modal, InputGroup, Input } from "reactstrap"
import Image from "next/image"

import "react-toastify/dist/ReactToastify.css"
import React from "react"
import { ToastContainer, toast } from "react-toastify"
import starknetLogoBordered from "../../assets/images/starknetLogoBordered.svg"
import OffchainAPI from "../../services/offchainapi.service"

const WhitelistModal = ({ accountAddress }: { accountAddress: any }) => {
  const [clicked, setClicked] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")

  const postUserData = async () => {
    let email = (document.getElementById("email") as HTMLInputElement).value
    let name = (document.getElementById("name") as HTMLInputElement).value
    //   toast.error(`${(`Could not add to waitlist. Please try again.`)}`, {
    //     position: toast.POSITION.BOTTOM_RIGHT,
    //     closeOnClick: true,
    // });
    try {
      const result = await OffchainAPI.setWhitelistData(
        accountAddress,
        email,
        name
      )
      console.log("whitelistSuccess?", result)
      if (result !== false) {
        console.log("Is function entered")
        setClicked(true)
      }
    } catch (err) {
      console.log("whitelist", err)
    }
  }

  const isName = () => {
    return name
  }

  const isEmail = () => {
    return email
  }

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
          {accountAddress ? (
            clicked ? (
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
                      You have been added in the queue. We will send you an
                      email from allowlist@hashstack.finance when you are
                      whitelisted
                    </h5>
                  </Col>
                </div>
              </Form>
            ) : (
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
                        fontSize: "20px",
                        textAlign: "center",
                      }}
                    >
                      Whitelist registration
                    </h5>
                  </Col>

                  <InputGroup>
                    <Input
                      style={{
                        backgroundColor: "#1D2131",
                        height: "45px",
                        marginBottom: "20px",
                        marginTop: "10px",
                      }}
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={`What should we call you ?`}
                    />
                  </InputGroup>

                  <InputGroup>
                    <Input
                      style={{
                        backgroundColor: "#1D2131",
                        height: "45px",
                      }}
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={`Your email address ?`}
                    />
                  </InputGroup>

                  <div
                    style={{
                      marginTop: "20px",
                      fontSize: "14px",
                      color: "#8b8b8b",
                    }}
                  >
                    <div>We have recorded your starknet address:</div>

                    <br />

                    <label
                      style={{
                        height: "38px",
                        backgroundColor: "#2A2E3F",
                        padding: "10px",
                        fontSize: "12px",
                        borderRadius: "5px",
                        color: "#FFF",
                        marginTop: "-10px",
                      }}
                    >
                      <>
                        <span
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          &nbsp;
                          <Image
                            alt="logo"
                            src={starknetLogoBordered}
                            width="12px"
                            height="12px"
                            style={{ cursor: "pointer" }}
                          />
                          <div style={{ fontSize: "12px" }}>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {`${accountAddress.substring(
                              0,
                              3
                            )}...${accountAddress.substring(
                              accountAddress.length - 10,
                              accountAddress.length
                            )}`}
                            &nbsp;&nbsp;&nbsp;
                          </div>
                        </span>
                      </>{" "}
                    </label>

                    <br />

                    <Button
                      color="white"
                      disabled={!isEmail() || !isName() ? true : false}
                      onClick={postUserData}
                      style={{
                        boxShadow: "rgba(0, 0, 0, 0.5) 3.4px 3.4px 5.2px 0px",
                        border: "none",
                        marginTop: "10px",
                        padding: "8px 0",
                        backgroundColor: "rgb(57, 61, 79)",
                      }}
                      className="w-md"
                    >
                      Join waitlist
                    </Button>
                  </div>
                </div>
              </Form>
            )
          ) : (
            <h2 style={{ color: "white" }}>Please connect your wallet</h2>
          )}
        </div>
      </Modal>
    </>
  )
}

export default WhitelistModal
