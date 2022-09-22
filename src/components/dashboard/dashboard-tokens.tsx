import useBorrowAPR from "../../blockchain/hooks/aprs/useBorrowAPR";
import useSavingsAPR from "../../blockchain/hooks/aprs/useSavingsAPR";
import useDeposit from "../../blockchain/hooks/useDeposit";
import Borrow from "../borrow";
import Deposit from "../deposit";
import { ICoin } from "./dashboard-body";

const DashboardTokens = ({
  coin,
  idx,
  borrowCommitment,
  depositCommitment,
}: {
  coin: ICoin;
  idx: number;
  borrowCommitment: string;
  depositCommitment: string;
}) => {
  const { data: borrow } = useBorrowAPR(coin.name, borrowCommitment);
  const { data: deposit } = useSavingsAPR(coin.name, depositCommitment);
  return (
    <tr key={idx}>
      <th scope="row">
        <div className="d-flex align-items-center">
          <div className="avatar-xs me-3">
            <span
              className={
                "avatar-title rounded-circle bg-soft bg-" +
                "warning" +
                " text-" +
                "warning" +
                " font-size-18"
              }
            >
              <i className={`mdi ${coin.icon}`} />
            </span>
          </div>
          <span>{coin.name}</span>
        </div>
      </th>
      <td>
        <div className="text-muted">
          {/* {DepositInterestRates[props.depositInterestChange]} */}
          {deposit ? deposit[0].apr.toNumber() / 100 : "NaN"}%
        </div>
      </td>
      <td>
        <div className="text-muted">
          {/* {BorrowInterestRates[props.borrowInterestChange]} */}
          {borrow ? borrow[0].apr.toNumber() / 100 : "NaN"}%
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
