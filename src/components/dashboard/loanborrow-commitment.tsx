import React, { useEffect, useState } from "react";
import { Table, TabPane } from "reactstrap";
import {
  getCommitmentIndexStringFromNameDeposit,
  getCommitmentIndexStringFromNameLoan,
} from "../../blockchain/stark-constants";
import DashboardTBody from "./dashboard-body";

const LoanBorrowCommitment = ({ isLoading }: { isLoading: boolean }) => {
  const [depositCommitment, setDepositCommitment] = useState<string>("");
  const [borrowCommitment, setBorrowCommitment] = useState<string>("");

  useEffect(() => {
    setDepositCommitment(
      getCommitmentIndexStringFromNameDeposit("NONE") as string
    );
    setBorrowCommitment(getCommitmentIndexStringFromNameLoan("NONE") as string);
  }, []);
  console.log(depositCommitment, borrowCommitment);

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
                  onChange={(e) => {
                    setDepositCommitment(
                      getCommitmentIndexStringFromNameDeposit(
                        e.target.value
                      ) as string
                    );
                  }}
                  defaultValue={"NONE"}
                >
                  {/* <option hidden>Commitment</option> */}
                  <option value={"NONE"}>Flexible</option>
                  <option value={"TWOWEEKS"}>Two Weeks</option>
                  <option value={"ONEMONTH"}>One Month</option>
                  <option value={"THREEMONTHS"}>Three Month</option>
                </select>
              </th>
              <th scope="col">
                <select
                  className="form-select form-select-sm"
                  onChange={(e) => {
                    setBorrowCommitment(
                      getCommitmentIndexStringFromNameLoan(
                        e.target.value
                      ) as string
                    );
                  }}
                  defaultValue={"NONE"}
                >
                  <option hidden>Commitment</option>
                  <option value={"NONE"}>Flexible</option>
                  <option value={"ONEMONTH"}>One Month</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            <DashboardTBody
              isloading={isLoading}
              borrowCommitment={borrowCommitment}
              depositCommitment={depositCommitment}
            ></DashboardTBody>
          </tbody>
        </Table>
      </div>
    </TabPane>
  );
};

export default LoanBorrowCommitment;
