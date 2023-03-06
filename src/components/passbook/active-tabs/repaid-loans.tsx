import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Form,
  Table,
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
import RepaidLoan from "./repaid-loans/repaid-loan";

const RepaidLoansTab = ({
  repaidLoansData,
  customActiveTabs,
}: {
  repaidLoansData: any;
  customActiveTabs: any;
}) => {
  // console.log("inside repay: ", customActiveTabs);
  // console.log("repayedss loans damta",repaidLoansData);
  

  return (
    <div className="table-responsive  mt-3" style={{ overflow : "hidden"}}>
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
          // console.log(asset);
          return (
            <RepaidLoan
              key={key}
              asset={asset}
              customActiveTabs={customActiveTabs}
            />
          );
        })
      ) : (
        <Table>
          <tbody>
            <tr>
              <td colSpan={5}>No Records Found.</td>
            </tr>
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default RepaidLoansTab;
