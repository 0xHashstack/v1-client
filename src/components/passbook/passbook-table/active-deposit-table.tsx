import React from "react";
import { Table } from "reactstrap";
import { CoinClassNames, EventMap } from "../../../blockchain/constants";
import { BNtoNum } from "../../../blockchain/utils";

const ActiveDepositTable = ({
  activeDepositsData,
}: {
  activeDepositsData: any;
}) => {
  return (
    // Active Deposits
    <div className="table-responsive">
      <Table className="table table-nowrap align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Deposit Market</th>
            <th scope="col">Commitment</th>
            <th scope="col">Amount</th>
            {/* <th scope="col" colSpan={2}>Interest Earned</th> */}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(activeDepositsData) &&
          activeDepositsData.length > 0 ? (
            activeDepositsData.map((asset, key) => (
              <tr key={key}>
                <th scope="row">
                  <div className="d-flex align-items-center">
                    <div className="avatar-xs me-3">
                      <img
                        src={
                          CoinClassNames[
                            EventMap[asset.market?.toUpperCase()]
                          ] || asset.market?.toUpperCase()
                        }
                      />
                    </div>
                    <span>{asset?.market?.toUpperCase()}</span>
                  </div>
                </th>
                <td>
                  <div className="text-muted">{EventMap[asset.commitment]}</div>
                </td>
                <td>
                  <div className="text-muted">
                    {BNtoNum(Number(asset.amount))}
                  </div>
                </td>
                {/* <td>
                    <div className="text-muted">{Number(asset.acquiredYield).toFixed(3)}</div>
                  </td>  */}
              </tr>
            ))
          ) : (
            <tr
            // align="center"
            >
              <td colSpan={5}>No Records Found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ActiveDepositTable;
