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
import useWithdrawCollateral from "../../../blockchain/hooks/repaid-loans/useWithdrawCollateral";
import { diamondAddress } from "../../../blockchain/stark-constants";
import { BNtoNum } from "../../../blockchain/utils";
import TxHistoryTable from "../../dashboard/tx-history-table";

const RepaidLoansTab = ({
  repaidLoansData,
  customActiveTabs,
}: {
  repaidLoansData: any;
  customActiveTabs: any;
}) => {
  const [
    handleWithdrawCollateralTransactionDone,
    setHandleWithdrawCollateralTransactionDone,
  ] = useState(false);
  console.log("inside repay: ", customActiveTabs);

  const handleWithdrawCollateral = async (handleWithdrawCollateral: any) => {
    await handleWithdrawCollateral();
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
          const { withdrawCollateral } = useWithdrawCollateral(
            diamondAddress,
            asset.loanId
          );
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
                              {asset.commitment}
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
                                            onClick={() => {
                                              handleWithdrawCollateral(
                                                withdrawCollateral
                                              );
                                            }}
                                            style={{
                                              color: "#4B41E5",
                                            }}
                                          >
                                            {true ? (
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
                                      type="repaid"
                                      market={asset.loanMarket}
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
    </div>
  );
};

export default RepaidLoansTab;
