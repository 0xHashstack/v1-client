import React, { useEffect, useState } from "react";
import { Table, TabPane } from "reactstrap";
import {
  getCommitmentIndexStringFromNameDeposit,
  getCommitmentIndexStringFromNameLoan,
} from "../../blockchain/stark-constants";
import DashboardTBody from "./dashboard-body";

const LoanBorrowCommitment = ({
  isLoading,
  activeDepositsData,
  activeLoansData,
}: {
  isLoading: boolean;
  activeDepositsData: any;
  activeLoansData: any;
}) => {
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
        <div className="table-responsive">
          <Table className="table table-nowrap  mb-0">
            <thead>
              <tr
                style={{
                  borderStyle: "hidden",
                  color: "#8C8C8C",
                  verticalAlign: "middle",
                }}
              >
                <th style={{ width: "35px" }}></th>
                <th scope="col" style={{ width: "100px" }}>
                  Markets
                </th>
                <th scope="col" style={{ width: "100px" }}>
                  Oracle Price
                </th>
                <th scope="col" style={{ width: "100px" }}>
                  Fair Price
                </th>
                <th scope="col" style={{ width: "100px" }}>
                  Total Supply
                </th>
                <th scope="col" style={{ width: "100px" }}>
                  Total Borrow
                </th>
                <th scope="col" style={{ width: "155px" }}>
                  <div style={{ textAlign: "center", paddingBottom: "5px" }}>
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
                    <option value={"NONE"}>Flexible</option>
                    <option value={"TWOWEEKS"}>Two Weeks</option>
                    <option value={"ONEMONTH"}>One Month</option>
                    <option value={"THREEMONTHS"}>Three Month</option>
                  </select>
                </th>
                <th scope="col" style={{ width: "150px" }}>
                  <div style={{ textAlign: "center", paddingBottom: "5px" }}>
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
                    <option value={"NONE"}>Flexible</option>
                    <option value={"ONEMONTH"}>One Month</option>
                  </select>
                </th>
                {/* <th scope="col">Savings Interest</th> */}
                {/* <th scope="col">Borrow Interest</th> */}
                <th scope="col" style={{ width: "100px" }}>
                  Supply
                </th>
                <th scope="col" style={{ width: "100px" }} colSpan={2}>
                  Borrow
                </th>
              </tr>
            </thead>
            <tbody>
              <DashboardTBody
                isloading={isLoading}
                borrowCommitment={borrowCommitment}
                depositCommitment={depositCommitment}
                activeDepositsData={activeDepositsData}
                activeLoansData={activeLoansData}
              />
            </tbody>
          </Table>
        </div>
      </TabPane>
    </div>
  );
};

export default LoanBorrowCommitment;
