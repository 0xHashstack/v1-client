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
    <div style={{}}>
      <TabPane tabId="1">
        <div className="table-responsive" style={{ paddingTop: "12px" }}>
          <Table className="table table-nowrap  mb-0">
            <thead>
              <tr
                style={{
                  borderStyle: "hidden",
                  color: "black",
                }}
              >
                <th style={{ width: "35px" }}></th>
                <th
                  scope="col"
                  style={{
                    width: "100px",
                    padding: "20px 10px",
                  }}
                >
                  Markets
                </th>
                <th
                  scope="col"
                  style={{ width: "100px", padding: "20px 10px" }}
                >
                  Oracle Price
                </th>
                <th
                  scope="col"
                  style={{ width: "100px", padding: "20px 10px" }}
                >
                  Fair Price
                </th>
                <th
                  scope="col"
                  style={{ width: "100px", padding: "20px 10px" }}
                >
                  Total Supply
                </th>
                <th
                  scope="col"
                  style={{ width: "100px", padding: "20px 10px" }}
                >
                  Supply APR
                </th>
                <th scope="col" style={{ width: "155px" }}>
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
                    style={{
                      color: "white",
                      padding: "8px 16px ",
                      fontSize: "15px",
                    }}
                  >
                    <option value={"NONE"}>Savings APR</option>
                    <option value={"TWOWEEKS"}>Two Weeks</option>
                    <option value={"ONEMONTH"}>One Month</option>
                    <option value={"THREEMONTHS"}>Three Month</option>
                  </select>
                </th>
                <th scope="col" style={{ width: "150px" }}>
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
                    style={{
                      color: "white",
                      padding: "8px 16px",
                      fontSize: "15px",
                    }}
                  >
                    <option value={"NONE"}>Borrow APR</option>
                    <option value={"ONEMONTH"}>One Month</option>
                  </select>
                </th>
                {/* <th scope="col">Savings Interest</th> */}
                {/* <th scope="col">Borrow Interest</th> */}
                <th
                  scope="col"
                  style={{ width: "100px", padding: "20px 20px" }}
                >
                  Supply
                </th>
                <th
                  scope="col"
                  style={{ width: "100px", padding: "20px 20px" }}
                  colSpan={2}
                >
                  Borrow
                </th>
              </tr>
              {/* <tr>
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
            </tr> */}
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
    </div>
  );
};

export default LoanBorrowCommitment;
