import React, { useEffect, useState } from "react";
import { Table, TabPane } from "reactstrap";
import {
  getCommitmentIndexStringFromNameDeposit,
  getCommitmentIndexStringFromNameLoan,
} from "../../blockchain/stark-constants";
import SupplyBody from "./supply-body";

const YourSupplyBody = ({ isLoading }: { isLoading: boolean }) => {
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
      <div
        className="table-responsive"
        style={{ paddingTop: "12px", width: "90vw", textAlign: "center" }}
      >
        <Table className="table table-nowrap  mb-0">
          <tr
            style={{
              borderStyle: "hidden",
              color: "black",
            }}
          >
            <th
              scope="col"
              style={{
                width: "100px",
                padding: "20px 10px",
              }}
            >
              Supply ID
            </th>
            <th
              scope="col"
              style={{
                width: "100px",
                padding: "20px 10px",
              }}
            >
              Market
            </th>
            <th scope="col" style={{ width: "100px", padding: "20px 10px" }}>
              Supply Amount
            </th>
            <th scope="col" style={{ width: "100px", padding: "20px 10px" }}>
              APR
            </th>
            <th scope="col" style={{ width: "100px", padding: "20px 10px" }}>
              MCP
            </th>
            <th scope="col" style={{ width: "100px", padding: "20px 10px" }}>
              Status
            </th>

            <th scope="col" style={{ width: "100px", padding: "20px 20px" }}>
              Actions
            </th>
          </tr>
          {/* <tbody>
            <SupplyBody
              isloading={isLoading}
              borrowCommitment={borrowCommitment}
              depositCommitment={depositCommitment}
            ></SupplyBody>
          </tbody> */}
        </Table>
      </div>
    </div>
  );
};
export default YourSupplyBody;
