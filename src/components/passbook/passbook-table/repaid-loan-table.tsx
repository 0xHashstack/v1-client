import React from "react";
import { Table } from "reactstrap";
import PassbookTBody from "../passbook-body";

const RepaidLoanTable = ({ repaidLoansData }: { repaidLoansData: any }) => {
  return (
    <div className="table-responsive">
      <Table className="table table-nowrap align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Borrow Market</th>
            <th scope="col">Borrow Amount</th>
            <th scope="col">Commitment</th>
            <th scope="col">Collateral Market</th>
            <th scope="col">Collateral Amount</th>
            <th scope="col">Swap Status</th>
            <th scope="col">Borrow Market(Current)</th>
            <th scope="col">Borrow Amount(Current)</th>
            {/* <th scope="col" colSpan={2}>Interest</th> */}
          </tr>
        </thead>

        <tbody>
          <PassbookTBody
            isloading={isLoading}
            assets={repaidLoansData}
          ></PassbookTBody>
        </tbody>
      </Table>
    </div>
  );
};

export default RepaidLoanTable;
