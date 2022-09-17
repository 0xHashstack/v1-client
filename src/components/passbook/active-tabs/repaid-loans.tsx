import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Form,
  Input,
  Table,
  Nav,
  NavItem,
  NavLink,
  Spinner,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  UncontrolledAccordion,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import { CoinClassNames, EventMap } from "../../../blockchain/constants";
import { BNtoNum } from "../../../blockchain/utils";
import TxHistoryTable from "../../dashboard/tx-history-table";

const RepaidLoansTab = ({
  repaidLoansData,
  customActiveTabs,
  loanActionTab,
  collateral_active_loan,
  repay_active_loan,
  withdraw_active_loan,
  swap_active_loan,
  swap_to_active_loan,
  isTransactionDone,
  depositRequestSel,
  inputVal1,
}: {
  repaidLoansData: any;
  customActiveTabs: any;
  loanActionTab: any;
  collateral_active_loan: any;
  repay_active_loan: any;
  withdraw_active_loan: any;
  swap_active_loan: any;
  swap_to_active_loan: any;
  isTransactionDone: any;
  depositRequestSel: any;
  inputVal1: any;
}) => {
  const [
    handleWithdrawCollateralTransactionDone,
    setHandleWithdrawCollateralTransactionDone,
  ] = useState(false);

  const handleRepay = async (loanMarket: string, commitment: string) => {
    // try {
    //   setIsTransactionDone(true);
    //   setHandleRepayTransactionDone(true);
    //   const _loanOption: string | undefined = loanOption;
    //   const market = SymbolsMap[loanMarket];
    //   const decimal = DecimalsMap[loanMarket];
    //   const _commit: string | undefined = commitment.replace(/\s/g, "");
    //   const approveTransactionHash = await wrapper
    //     ?.getMockBep20Instance()
    //     .approve(market, inputVal1, decimal);
    //   await approveTransactionHash.wait();
    //   const tx1 = await wrapper
    //     ?.getLoanInstance()
    //     .repayLoan(market, CommitMap[_commit], inputVal1, decimal);
    //   const tx = await tx1.wait();
    //   SuccessCallback(
    //     tx.events,
    //     "LoanRepaid",
    //     "Loan Repaid Successfully",
    //     inputVal1
    //   );
    // } catch (err) {
    //   setIsTransactionDone(false);
    //   setHandleRepayTransactionDone(false);
    //   toast.error(`${GetErrorText(err)}`, {
    //     position: toast.POSITION.BOTTOM_RIGHT,
    //     closeOnClick: true,
    //   });
    // }
  };

  return (
    <div className="table-responsive  mt-3">
      <Table className="table table-nowrap align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Borrow Market</th>
            <th scope="col">Collateral Balance</th>
            <th scope="col">Commitment</th>
            {/* <th scope="col" colSpan={2}>Interest</th> */}
          </tr>
        </thead>
      </Table>

      {Array.isArray(repaidLoansData) && repaidLoansData.length > 0 ? (
        repaidLoansData.map((asset, key) => {
          console.log(asset);
          return (
            <div key={key}>
              <UncontrolledAccordion defaultOpen="0" open="1">
                <Row>
                  <AccordionItem style={{ border: "2px" }}>
                    <AccordionHeader targetId="1">
                      <Col className="mr-4 ">
                        <Card className="mb-1" style={{ marginTop: "20px" }}>
                          <CardBody>
                            <div>
                              <img
                                src={
                                  CoinClassNames[
                                    EventMap[asset.loanMarket.toUpperCase()]
                                  ] || asset.loanMarket.toUpperCase()
                                }
                                height="18px"
                              />

                              <div
                                className="mr-6"
                                style={{
                                  display: "inline-block",
                                  fontSize: "18px",
                                }}
                                // align="right"
                              >
                                &nbsp; &nbsp;
                                {EventMap[asset.loanMarket.toUpperCase()]}
                              </div>
                            </div>
                            <CardTitle tag="h5"></CardTitle>
                            <CardSubtitle
                              className=" text-muted"
                              tag="h6"
                            ></CardSubtitle>
                          </CardBody>
                        </Card>
                      </Col>

                      <Col className="mr-4 ">
                        <Card className="mb-1" style={{ marginTop: "20px" }}>
                          <CardBody>
                            <div>
                              <img
                                src={
                                  CoinClassNames[
                                    EventMap[
                                      asset.collateralMarket.toUpperCase()
                                    ]
                                  ] || asset.collateralMarket.toUpperCase()
                                }
                                height="18px"
                              />

                              <div
                                className="mr-6"
                                style={{
                                  display: "inline-block",
                                  fontSize: "18px",
                                }}
                                // align="right"
                              >
                                &nbsp; &nbsp;
                                {EventMap[asset.collateralMarket.toUpperCase()]}
                              </div>
                            </div>
                            <CardTitle tag="h5"></CardTitle>

                            <CardSubtitle className=" text-muted" tag="h6">
                              <span style={{ fontSize: "14px" }}>
                                &nbsp; &nbsp;&nbsp;{" "}
                                {parseFloat(
                                  BNtoNum(Number(asset.collateralAmount))
                                ).toFixed(6)}
                              </span>
                              &nbsp; &nbsp;
                            </CardSubtitle>
                          </CardBody>
                        </Card>
                      </Col>

                      <Col className="mr-4 ">
                        <Card className="mb-1" style={{ marginTop: "20px" }}>
                          <CardBody>
                            <div
                              className="mr-6"
                              style={{
                                display: "inline-block",
                                fontSize: "14px",
                              }}
                              // align="right"
                            >
                              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{" "}
                              {EventMap[asset.commitment]}
                            </div>
                            <CardTitle tag="h5"></CardTitle>
                          </CardBody>
                        </Card>
                      </Col>
                    </AccordionHeader>
                    <AccordionBody accordionId="1">
                      <div style={{ borderWidth: 1 }}>
                        <CardBody>
                          <form>
                            <div className="mb-4 ">
                              <Row>
                                <Col lg="4 mb-3">
                                  <div
                                    className="block-example border"
                                    style={{
                                      padding: "15px",
                                      borderRadius: "5px",
                                    }}
                                  >
                                    {customActiveTabs === "3" && ( //here repaid
                                      <Form>
                                        <div className="d-grid gap-2">
                                          <Button
                                            className="w-md"
                                            disabled={
                                              handleWithdrawCollateralTransactionDone
                                            }
                                            onClick={() => {
                                              handleRepay(
                                                asset.loanMarket,
                                                asset.commitment
                                              );
                                            }}
                                            style={{
                                              color: "#4B41E5",
                                            }}
                                          >
                                            {!handleWithdrawCollateralTransactionDone ? (
                                              "Withdraw Collateral"
                                            ) : (
                                              <Spinner>Loading...</Spinner>
                                            )}
                                          </Button>
                                        </div>
                                      </Form>
                                    )}
                                  </div>
                                </Col>

                                <Col lg="8">
                                  {
                                    <TxHistoryTable
                                      asset={asset}
                                      type="loans"
                                      market={asset.loanMarket}
                                      isTrasactionDone={isTransactionDone}
                                    />
                                  }
                                </Col>
                              </Row>
                            </div>
                          </form>
                        </CardBody>
                      </div>
                    </AccordionBody>
                  </AccordionItem>
                </Row>
              </UncontrolledAccordion>
            </div>
          );
        })
      ) : (
        <div>No records found</div>
      )}
      {/* <tbody>
                <PassbookTBody
                  isloading={isLoading}
                  assets={repaidLoansData}
                ></PassbookTBody>
              </tbody>
            </Table> */}
    </div>
  );
};

export default RepaidLoansTab;
