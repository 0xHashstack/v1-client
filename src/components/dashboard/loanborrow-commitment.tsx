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
                  color: "#8C8C8C",
                }}
              >
                <th style={{ width: "35px" }}></th>
                <th
                  scope="col"
                  style={{
                    width: "100px",
                    padding: "35px 10px",
                  }}
                >
                  Markets
                </th>
                <th
                  scope="col"
                  style={{ width: "100px", padding: "35px 10px" }}
                >
                  Oracle Price
                </th>
                <th
                  scope="col"
                  style={{ width: "100px", padding: "35px 10px" }}
                >
                  Fair Price
                </th>
                <th
                  scope="col"
                  style={{ width: "100px", padding: "35px 10px" }}
                >
                  Total Supply
                </th>
                <th
                  scope="col"
                  style={{ width: "100px", padding: "35px 10px" }}
                >
                  Supply APR
                </th>
                <th scope="col" style={{ width: "155px" }}>
                  <div style={{ textAlign: "center", margin: "8px auto" }}>
                    {" "}
                    Supply APR
                  </div>
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
                      margin: "0 auto",
                      width: "120px",
                      color: "#8C8C8C",
                      padding: "4px 8px ",
                      fontSize: "12px",
                      backgroundColor: "#393D4F",
                    }}
                  >
                    <option value={"TWOWEEKS"}>Two Weeks</option>
                    <option value={"ONEMONTH"}>One Month</option>
                    <option value={"THREEMONTHS"}>Three Month</option>
                  </select>
                </th>
                <th scope="col" style={{ width: "150px" }}>
                  <div style={{ textAlign: "center", margin: "8px auto" }}>
                    {" "}
                    Borrow APR
                  </div>
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
                      margin: "0 auto",
                      width: "120px",
                      color: "#8C8C8C",
                      padding: "4px 8px",
                      fontSize: "12px",
                      backgroundColor: "#393D4F",
                    }}
                  >
                    <option value={"TWOWEEKS"}>Two Weeks</option>
                    <option value={"ONEMONTH"}>One Month</option>
                    <option value={"THREEMONTHS"}>Three Month</option>
                  </select>
                </th>
                {/* <th scope="col">Savings Interest</th> */}
                {/* <th scope="col">Borrow Interest</th> */}
                <th
                  scope="col"
                  style={{ width: "100px", padding: "35px 20px" }}
                >
                  Supply
                </th>
                <th
                  scope="col"
                  style={{ width: "100px", padding: "35px 20px" }}
                  colSpan={2}
                >
                  Borrow
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
    </div>
  );
};

export default LoanBorrowCommitment;
