import { DecimalsMap } from "./constants";
import { BigNumber } from "bignumber.js";
import Fortmatic from "fortmatic";
import { Bitski } from "bitski";
import { toast } from "react-toastify";
import { utils } from "ethers";
import { Logger } from "ethers/lib/utils";
import OffchainAPI from "../services/offchainapi.service";
import { intersection } from "lodash";
import { time } from "console";

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
  return val < 1 ? val.toPrecision() : fixedSpecial(val, 0);
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
  console.log("timestamp", marketCommitmentSpecificData[0].timestamp);
  console.log("currentTime", currentTime);
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
      //   let rate = new BigNumber(parseFloat(entry.apr100x) / 100);
      let rate = new BigNumber(parseFloat("200") / 100);
      let timeDifference_bn = new BigNumber(timeDifference);
      let amount_bn = new BigNumber(asset.amount);
      console.log(rate.toFixed(6));
      console.log(timeDifference.toFixed(6));
      console.log(amount_bn.toFixed(6));
      console.log(secondsInYear_bn.toFixed(6));

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

export const borrowInterestAccrued = (asset: any, historicalData: any[]) => {
  const compare = (entryA: any, entryB: any) => {
    if (entryA.timestamp > entryB.timestamp) {
      return -1;
    } else if (entryA < entryB) {
      return 1;
    }
    return 0;
  };
  console.log(historicalData);
  console.log(asset);
  let marketCommitmentSpecificData = historicalData
    .filter((entry) => {
      return (
        entry["market"] === asset.loanMarketAddress &&
        parseInt(entry["commitment"]) === asset.commitmentIndex
      );
    })
    .sort(compare);

  let currentTime = Date.now();
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
      let rate = new BigNumber(parseInt(entry.apr100x) / 100);
      let timeDifference_bn = new BigNumber(timeDifference);
      let amount_bn = new BigNumber(asset.amount);
      console.log(parseFloat(entry.apr100x) / 100);
      console.log(rate.toFixed(6));
      console.log(timeDifference.toFixed(6));
      console.log(amount_bn.toFixed(6));
      console.log(secondsInYear_bn.toFixed(6));

      const result_bn: BigNumber = timeDifference_bn
        .multipliedBy(amount_bn)
        .multipliedBy(rate)
        .dividedBy(secondsInYear_bn)
        .dividedBy(100);
      return result_bn.plus(accumulator);
    },
    new BigNumber(0)
  );

  return result_bn.toFixed(6);
};
