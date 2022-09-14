import React from "react";
import { Table, TabPane } from "reactstrap";
import DashboardTBody from "./dashboard-body";

const LoanBorrowCommitment = ({
  handleDepositInterestChange,
  handleBorrowInterestChange,
  depositInterestChange,
  borrowInterestChange,
  isLoading,
}: {
  handleDepositInterestChange: (e: any) => void;
  handleBorrowInterestChange: (e: any) => void;
  depositInterestChange: string;
  borrowInterestChange: string;
  isLoading: boolean;
}) => {
  return (
    <TabPane tabId="1">
      <div className="table-responsive" style={{ paddingTop: "12px" }}>
        <Table className="table table-nowrap  mb-0">
          <thead>
            <tr style={{ borderStyle: "hidden" }}>
              <th scope="col">Markets</th>
              <th scope="col">Savings Interest</th>
              <th scope="col">Borrow Interest</th>
              <th scope="col">Deposit</th>
              <th scope="col" colSpan={2}>
                Borrow
              </th>
            </tr>
            <tr>
              <th scope="col"></th>
              <th scope="col">
                <select
                  className="form-select form-select-sm"
                  onChange={handleDepositInterestChange}
                  defaultValue={"NONE"}
                >
                  <option hidden>Commitment</option>
                  <option value={"NONE"}>None</option>
                  <option value={"TWOWEEKS"}>Two Weeks</option>
                  <option value={"ONEMONTH"}>One Month</option>
                  <option value={"THREEMONTHS"}>Three Month</option>
                </select>
              </th>
              <th scope="col">
                <select
                  className="form-select form-select-sm"
                  onChange={handleBorrowInterestChange}
                  defaultValue={"NONE"}
                >
                  <option hidden>Commitment</option>
                  <option value={"NONE"}>None</option>
                  <option value={"ONEMONTH"}>One Month</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            <DashboardTBody
              isloading={isLoading}
              depositInterestChange={depositInterestChange}
              borrowInterestChange={borrowInterestChange}
            ></DashboardTBody>
          </tbody>
        </Table>
      </div>
    </TabPane>
  );
};

export default LoanBorrowCommitment;
