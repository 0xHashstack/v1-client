import { useEffect, useState } from "react";
import useBorrowAPR from "../../blockchain/hooks/aprs/useBorrowAPR";
import useSavingsAPR from "../../blockchain/hooks/aprs/useSavingsAPR";
import useDeposit from "../../blockchain/hooks/useDeposit";
import {
  getTokenFromAddress,
  getTokenFromName,
  tokenAddressMap,
} from "../../blockchain/stark-constants";
import OffchainAPI from "../../services/offchainapi.service";
import Borrow from "../borrow";
import Deposit from "../deposit";
import { ICoin } from "./dashboard-body";

const DashboardTokens = ({
  coin,
  idx,
  borrowCommitment,
  depositCommitment,
  depositLoanRates,
}: {
  coin: ICoin;
  idx: number;
  borrowCommitment: string;
  depositCommitment: string;
  depositLoanRates: any;
}) => {
  useEffect(() => {
    console.log(
      `%c Protocol deposit ${depositCommitment} ${borrowCommitment} ${coin.name}`,
      "background: #222; color: #bada55"
    );
  });

  return (
    <tr key={idx}>
      <th scope="row">
        <div className="d-flex align-items-center">
          <div className="avatar-xs me-3">
            <img
              src={`./${coin.name}.svg`}
              width="20px"
              height="20px"
              style={{ marginTop: "5px" }}
            ></img>
          </div>
          <span>{coin.name}</span>
        </div>
      </th>
      <td>
        <div className="text-muted">
          {/* {deposit ? deposit[0].apr.toNumber() / 100 : "NaN"}% */}
          {depositLoanRates && parseInt(depositCommitment) < 4
            ? parseFloat(
                depositLoanRates[
                  `${getTokenFromName(coin.name).address}__${depositCommitment}`
                ].depositAPR.apr100x
              ) / 100
            : "NaN"}
          %
        </div>
      </td>
      <td>
        <div className="text-muted">
          {/* {borrow ? borrow[0].apr.toNumber() / 100 : "NaN"}% */}
          {depositLoanRates && parseInt(borrowCommitment) < 2
            ? parseFloat(
                depositLoanRates[
                  `${getTokenFromName(coin.name).address}__${borrowCommitment}`
                ]?.borrowAPR.apr100x
              ) / 100
            : "NaN"}
          %
        </div>
      </td>
      <td style={{ width: "120px" }}>
        <Deposit asset={coin.name} />
      </td>
      <td style={{ width: "120px" }}>
        <Borrow asset={coin.name} title={coin.name} />
      </td>
    </tr>
  );
};
export default DashboardTokens;
