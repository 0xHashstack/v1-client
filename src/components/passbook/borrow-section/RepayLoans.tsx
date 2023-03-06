import React,{useEffect,useState} from 'react'
import {
    Button,
    Col,
    Form,
    FormGroup,
    Input,
    InputGroup,
    Modal,
    Row,
    Table,
    UncontrolledAccordion,
  } from "reactstrap";
  // import { EventMap } from '../../../blockchain/constants';
import { tokenAddressMap } from '../../../blockchain/stark-constants';
import { weiToEtherNumber } from '../../../blockchain/utils';
import {
  CoinClassNames,
  EventMap,
  MinimumAmount,
} from "../../../blockchain/constants";

const RepayLoans = ({assets}:{assets:any}) => {

 // console.log(assets);
 
    
  return (
    <>
     <UncontrolledAccordion
        defaultOpen="0"
        open="false"
        style={{
          color: "white",
          textAlign: "left",
          marginLeft: "20px",
        }}
      >
        <Row
          style={{
            margin: "15px 0px 15px 20px",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <Col style={{ marginLeft: "-10px", textAlign: "left" }}>
            ID {assets.loanId}
          </Col>

          <Col>
            <div style={{ marginTop: "10px" }}>
              <img
                src={
                  assets
                    ? CoinClassNames[
                    EventMap[assets.loanMarket.toUpperCase()]
                    ] || assets.loanMarket.toUpperCase()
                    : null
                }
                height="15px"
              />
              <div
                className="mr-6"
                style={{
                  display: "inline-block",
                  fontSize: "13px",
                }}
              >
                &nbsp; &nbsp;
                {EventMap[assets.loanMarket.toUpperCase()]}
              </div>{" "}
            </div>
          </Col>

          <Col className="mr-4 ">
            <div>
              <img
                src={
                  assets
                    ? CoinClassNames[
                    EventMap[assets.loanMarket.toUpperCase()]
                    ] || assets.loanMarket.toUpperCase()
                    : null
                }
                height="15px"
              />
              &nbsp;&nbsp;
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                {parseFloat(weiToEtherNumber(assets.loanAmount,tokenAddressMap[assets.loanMarket]||"").toString())}
              </span>
            </div>
          </Col>

          <Col>
            <div
              style={{ fontSize: "14px", fontWeight: "600", width: "110px" }}
            >
              {parseFloat(weiToEtherNumber(assets.interestPaid,tokenAddressMap[assets.loanMarket]||"").toString()).toFixed(6)}
              &nbsp;
              {EventMap[assets.loanMarket.toUpperCase()]}
            </div>
            <div
              className="mr-6"
              style={{
                display: "inline-block",
                fontSize: "13px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#8B8B8B",
                }}
              >
                {/* {parseFloat(currentBorrowInterest).toFixed(2)}% APR */}
              </div>
            </div>
          </Col>

          <Col style={{ marginLeft: "-8px" }}>0.00</Col>

          <Col>{assets?.commitment}</Col>

          <Col>
            <div>
              <img
                src={
                  assets
                    ? CoinClassNames[
                    EventMap[assets.collateralMarket.toUpperCase()]
                    ] || assets.collateralMarket.toUpperCase()
                    : null
                }
                height="15px"
              />
              <div
                className="mr-6"
                style={{
                  display: "inline-block",
                  fontSize: "13px",
                }}
              >
                &nbsp; &nbsp;
                {EventMap[assets.collateralMarket.toUpperCase()]}
              </div>
            </div>
          </Col>

          <Col>
            <div>
              <img
                src={
                  assets
                    ? CoinClassNames[
                    EventMap[assets.collateralMarket.toUpperCase()]
                    ] || assets.collateralMarket.toUpperCase()
                    : null
                }
                height="15px"
              />
              &nbsp;&nbsp;
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                {parseFloat(weiToEtherNumber(assets.collateralAmount,tokenAddressMap[assets.collateralMarket]||"" ).toString())}
              </span>
            </div>
          </Col>


        </Row>
        <hr style={{ color: "#00000080" }} />
      </UncontrolledAccordion>
      </>
  )
}

export default RepayLoans