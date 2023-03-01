import { DecimalsMap } from "./constants";
import { BigNumber } from "bignumber.js";
import { number } from "starknet";
import Fortmatic from "fortmatic";
import { Bitski } from "bitski";
import { toast } from "react-toastify";
import { utils } from "ethers";
import { Logger } from "ethers/lib/utils";
import OffchainAPI from "../services/offchainapi.service";
import { intersection } from "lodash";
import { time } from "console";
import {
  getCommitmentIndexStringFromNameDeposit,
  getTokenFromAddress,
  getTokenFromName,
} from "./stark-constants";

export const fixedSpecial = (num: number, n: number) => {
  var str = num.toPrecision();
  if (str.indexOf("e+") === -1) return str;

  str = str
    .replace(".", "")
    .split("e+")
    .reduce(function (b, p: any) {
      return b + Array(p - b.length + 2).join("0");
    });

  if (n > 0) str += "." + Array(n + 1).join("0");

  return str;
};

export const BNtoNum = (value: number, decimal: number = 18) => {
  const val = new BigNumber(value).shiftedBy(-decimal).toNumber();
  return val < 1 ? val.toPrecision() : Number(fixedSpecial(val, 0)).toFixed(4);
};

export const NumToBN = (value: number, decimal: number = 18) => {
  const val = new BigNumber(value).shiftedBy(decimal).toNumber();
  return val < 1 ? val.toPrecision() : fixedSpecial(val, 0);
};

export const GetErrorText = (err: any) => {
  if (err.code === Logger.errors.CALL_EXCEPTION)
    return `Transaction failed! \n ${err.transactionHash}`;
  if (err.data) {
    console.log(1);
    return err.data.message;
  } else if (err.message) {
    console.log("Erro: ", err.message);
    return err.message;
  } else if (typeof err == "string") {
    return err;
  } else return "Oops! Something went wrong.";
};

export const toFixed = (num: number, digit: number) => {
  if (isNaN(num)) return 0;
  var fixed_num = Number(num).toFixed(digit);
  return Number(fixed_num.toString());
};

export const OnSuccessCallback = (
  data: any,
  eventName: any,
  key: any,
  message: any
) => {};

export const OnErrorCallback = (err: any) => {};
export const bytesToString = (bytes: string) => {
  return utils.parseBytes32String(bytes);
};

export const depositInterestAccrued = (asset: any, historicalData: any[]) => {
  const compare = (entryA: any, entryB: any) => {
    if (entryA.timestamp > entryB.timestamp) {
      return -1;
    } else if (entryA < entryB) {
      return 1;
    }
    return 0;
  };
  let marketCommitmentSpecificData = historicalData
    .filter((entry) => {
      return (
        entry["market"] === asset.marketAddress &&
        parseInt(entry["commitment"]) === asset.commitmentIndex
      );
    })
    .sort(compare);

  let currentTime = Date.now() / 1000;
  const secondsInYear_bn = new BigNumber(31536000);

  const result_bn: BigNumber = marketCommitmentSpecificData.reduce(
    (accumulator, entry, index) => {
      let interest = 0;
      let timeDifference = 0;
      // let rate = parseInt(entry.apr100x) / 100;
      if (index === 0) {
        timeDifference = currentTime - entry.timestamp;
      } else {
        timeDifference =
          marketCommitmentSpecificData[index - 1].timestamp - entry.timestamp;
      }
      // amount * difference/seconds in year * rate/100
      let rate = new BigNumber(parseFloat(entry?.apr100x) / 100);
      //   let rate = new BigNumber(parseFloat("200") / 100);
      let timeDifference_bn = new BigNumber(timeDifference);
      let amount_bn = new BigNumber(asset.amount);

      const result_bn: BigNumber = timeDifference_bn
        .multipliedBy(amount_bn)
        .multipliedBy(rate)
        .dividedBy(secondsInYear_bn)
        .dividedBy(100);
      return result_bn.plus(accumulator);
    },
    new BigNumber(0)
  );

  return result_bn.dividedBy(10e18).toFixed(6);
};

export const borrowInterestAccrued = (asset: any) => {
  return BigNumber(asset.loanInterest).dividedBy(BigNumber(1e18)).toFixed(6);
  //   return new BigNumber(0).toFixed(6);
};

export const currentDepositInterestRate = (asset: any, historicalAPRs: any) => {
  const marketHistoricalAPRs = historicalAPRs.filter((aprRecords: any) => {
    // console.log(aprRecords, asset);
    return (
      aprRecords.market === asset.marketAddress &&
      parseInt(aprRecords.commitment) === asset.commitmentIndex
    );
  });
  const aprWithMultiplier =
    marketHistoricalAPRs[marketHistoricalAPRs.length - 1]?.apr100x;
  const multiplier = new BigNumber("100");
  const aprWithMultiplierBigNumber = new BigNumber(aprWithMultiplier);
  const aprBigNumber = aprWithMultiplierBigNumber.dividedBy(multiplier);
  return aprBigNumber.toFixed(6);
};

export const currentBorrowInterestRate = (asset: any, historicalAPRs: any) => {
  console.log(historicalAPRs, asset);
  let key = `${getTokenFromName(asset.loanMarket).address}__${
    asset.commitmentIndex
  }`;
  console.log("currentBorrowInterestRate", key);
  return (historicalAPRs[key]?.borrowAPR?.apr100x / 100).toFixed(2);
  // const marketHistoricalAPRs = historicalAPRs.filter((aprRecords: any) => {
  //   return (
  //     aprRecords.market === asset.loanMarketAddress &&
  //     parseInt(aprRecords.commitment) === asset.commitmentIndex
  //   );
  // });
  // console.log(marketHistoricalAPRs);
  // const aprWithMultiplier =
  //   marketHistoricalAPRs[marketHistoricalAPRs.length - 1].apr100x;
  // const multiplier = new BigNumber("100");
  // const aprWithMultiplierBigNumber = new BigNumber(aprWithMultiplier);
  // const aprBigNumber = aprWithMultiplierBigNumber.dividedBy(multiplier);
  // return aprBigNumber.toFixed(6);
};

export const etherToWeiBN = (amount: number, tokenAddress: string) => {
  const token = getTokenFromAddress(tokenAddress);
  const decimals = token?.decimals || 18; // @todo should avoid using 18 default
  const factor = 1000_000;
  const amountBN = number
    .toBN(amount * factor)
    .mul(number.toBN(10).pow(number.toBN(decimals)))
    .div(number.toBN(factor));
  return amountBN;
};

export const weiToEtherNumber = (amount: string, tokenAddress: string) => {
  const token = getTokenFromAddress(tokenAddress);
  const decimals = token?.decimals || 18; // @todo should avoid using 18 default
  const factor = 1000_000;
  const amountBN = number
    .toBN(amount).mul(number.toBN(factor))
    .div(number.toBN(10).pow(number.toBN(decimals)));
  return amountBN.toNumber() / factor;
}