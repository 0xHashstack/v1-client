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

const RepayLoans = ({asset}:{asset:any}) => {

 // console.log(asset);
 
    
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
            ID {asset.loanId}
          </Col>

          <Col>
            <div style={{ marginTop: "10px" }}>
              <img
                src={
                  asset
                    ? CoinClassNames[
                    EventMap[asset.loanMarket.toUpperCase()]
                    ] || asset.loanMarket.toUpperCase()
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
                {asset?.loanMarketSymbol}
              </div>{" "}
            </div>
          </Col>

          <Col className="mr-4 ">
            <div>
              <img
                src={
                  asset
                    ? CoinClassNames[
                    EventMap[asset?.loanMarket.toUpperCase()]
                    ] || asset?.loanMarket.toUpperCase()
                    : null
                }
                height="15px"
              />
              &nbsp;&nbsp;
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                {parseFloat(weiToEtherNumber(asset?.loanAmount?.toString(),tokenAddressMap[asset.loanMarket]?.toString()||"").toString())}
              </span>
            </div>
          </Col>

          <Col>
            <div
              style={{ fontSize: "14px", fontWeight: "600", width: "110px" }}
            >
              {parseFloat(weiToEtherNumber(asset?.interestPaid?.toString(),tokenAddressMap[asset.loanMarket]?.toString()||"").toString()).toFixed(6)}
              &nbsp;
              {asset?.loanMarketSymbol}
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

          <Col>{asset?.commitment}</Col>

          <Col>
            <div>
              <img
                src={
                  asset
                    ? CoinClassNames[
                    EventMap[asset?.collateralMarket?.toUpperCase()]
                    ] || asset?.collateralMarket?.toUpperCase()
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
                {asset?.collateralMarketSymbol}
              </div>
            </div>
          </Col>

          <Col>
            <div>
              <img
                src={
                  asset
                    ? CoinClassNames[
                    EventMap[asset?.collateralMarket?.toUpperCase()]
                    ] || asset?.collateralMarket?.toUpperCase()
                    : null
                }
                height="15px"
              />
              &nbsp;&nbsp;
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                {parseFloat(weiToEtherNumber(asset.collateralAmount,tokenAddressMap[asset.collateralMarket]||"" ).toString())}
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