
import {
    useAccount,
    useContract,
    useStarknetCall,
    useStarknetExecute,
    useTransactionReceipt,
    UseTransactionReceiptResult,
  } from "@starknet-react/core";
  import React, { useEffect, useState } from "react";
  import { toast } from "react-toastify";
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
  import {
    diamondAddress,
    ERC20Abi,
    getTokenFromName,
    isTransactionLoading,
    tokenAddressMap,
  } from "../../../../blockchain/stark-constants";
  import starknetLogo from "../../../assets/images/starknetLogo.svg";
  import Slider from "react-custom-slider";
  import { BNtoNum, GetErrorText, NumToBN } from "../../../../blockchain/utils";
  import { getPrice } from "../../../../blockchain/priceFeed";
  import { TxToastManager } from "../../../../blockchain/txToastManager";
  import BorrowData from "../../borrow-section/borrow-data";
  import OffchainAPI from "../../../../services/offchainapi.service";
  import Image from "next/image";
  import arrowDown from "../../../assets/images/arrowDown.svg";
  import arrowUp from "../../../assets/images/arrowUp.svg";
  import { Abi, uint256 } from "starknet";
  import { ICoin } from "../../../dashboard/dashboard-body";
  import MySpinner from "../../../mySpinner";
  import { MinimumAmount } from "../../../../blockchain/constants";
  

const SpendLoan = () => {
  return (
    <>
 <Table>
   {/* <Table className="table table-nowrap  mb-0"> */}
   <Row
     style={{
       borderStyle: "hidden",
       color: "white",
       fontWeight: "600",
       margin: "1px 1px 1px 10px",
       alignItems: "center",
       gap: "100px",
       fontSize: "11px",
       backgroundColor:"black",
       borderRadius:"10px"
     }}
   >
     <Col
       style={{
         width: "10px",
         padding: "20px 40px",
       }}
     >
       Borrow Market
     </Col>
     <Col
       style={{
         width: "100px",
         padding: "20px 10px",
       }}
     >
       Available Borrow Amount
     </Col>
     <Col style={{ width: "100px", padding: "20px 10px" }}>
       Collateral Market
     </Col>
     <Col
       scope="col"
       style={{ width: "100px", padding: "20px 10px" }}
     >
        Collateral Amount
     </Col>
   </Row>
   {/* </Table> */}
 </Table>
 </>
  )
}

export default SpendLoan

 