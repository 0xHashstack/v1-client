import axios from "axios";
import {
  getTokenFromAddress,
  tokenAddressMap,
} from "../blockchain/stark-constants";
import OraclePrices from "./../../public/mock-data/OraclePrices.json";
import Reserves from "./../../public/mock-data/Reserves.json";
export default class OffchainAPI {
  // static ENDPOINT = 'http://52.77.185.41:3000'
  // static ENDPOINT = "https://offchainapi.testnet.starknet.hashstack.finance";
  // static ENDPOINT = "http://offchainstarknettestnetstaging-api.eba-uf3qrhac.ap-southeast-1.elasticbeanstalk.com";
  // static ENDPOINT =
  //   "http://offchainstarknettestnetstaging-api.eba-uf3qrhac.ap-southeast-1.elasticbeanstalk.com";
  static ENDPOINT =
    "http://offchainstarknetmainnetprodapi-env.eba-zacgkgi6.ap-southeast-1.elasticbeanstalk.com";
    // "http://localhost:3000"
  // static ENDPOINT = 'https://8992-106-51-78-197.in.ngrok.io'
  // static ENDPOINT = process.env.NEXT_PUBLIC_APP_ENV=='production' ?
  // 	'https://offchainapi.testnet.starknet.hashstack.finance' : 'http://localhost:3010'
  // static ENDPOINT = 'https://77dc-106-51-78-197.in.ngrok.io'
  // static ENDPOINT =
  //     process.env.NODE_ENV === "development"
  //       ? "http://localhost:3010"
  //       : "https://offchainapi.testnet.starknet.hashstjack.finance";

  static async httpGet(route: string) {
    try {
      let url = `${OffchainAPI.ENDPOINT}${route}`;
      // console.log("offchain url", url);
      let data = await axios.get(url);
      return data.data;
    } catch (err) {
      console.error("httpGet", route, err);
      return [];
    }
  }

  static async httpPost(route: string, data: any, type: string, token: string) {
    try {
      if (!token) {
        console.warn("no incoming token", route, data, type, token);
      }
      let url = `${this.ENDPOINT}${route}`;
      let res = await axios({
        method: "post",
        url,
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }

  static getLoans(address: string) {
    let url = `/api/loans/${address}`;
    return OffchainAPI.httpGet(url);
  }

  static async getActiveDeposits(address: string) {
    let url = `/api/deposits/${address}`;
    return OffchainAPI.httpGet(url);
  }

  static getRepaidLoans(address: string) {
    let url = `/api/repaid-loans/${address}`;
    return OffchainAPI.httpGet(url);
  }

  static getLiquidableLoans(address: string) {
    let url = `/api/get-liquidable-loans`;
    return OffchainAPI.httpGet(url);
  }

  static getDashboardStats() {
    let url = `/dashboard-stats`;
    return OffchainAPI.httpGet(url);
  }

  static async getTransactionEventsActiveDeposits(
    address: string,
    token: string
  ) {
    let route = `/api/transactions-by-events/${address}`;
    let data = JSON.stringify({
      events: ["NewDeposit", "AddDeposit", "WithdrawDeposit"],
    });
    const events = await OffchainAPI.httpPost(route, data, "deposits", token);
    console.log("getTransactionEventsActiveDeposits", events);
    return events
      .filter((event: any) => {
        return tokenAddressMap[token] === JSON.parse(event.eventInfo).market;
      })
      .map((event: any) => {
        return {
          txnHash: event.txHash,
          actionType: event.event,
          date: event.createdon,
          value: JSON.parse(event.eventInfo).amount,
          id: event.loanId,
        };
      });
  }

  static async getTransactionEventsActiveLoans(address: string, token: string) {
    let route = `/api/transactions-by-events/${address}`;
    let data = JSON.stringify({
      events: [
        "NewLoan",
        "WithdrawPartialLoan",
        "AddCollateral",
        "SushiSwapped",
        "RevertSushiSwapped",
        "LoanRepaid",
        "LoanInterestDeduction",
      ],
    });
    const events = await OffchainAPI.httpPost(route, data, "loans", token);
    return events
      .filter((event: any) => {
        console.log(event.event);
        if (event.event === "RevertSushiSwapped") {
          return true;
        }
        if (event.event === "WithdrawPartialLoan") {
          return tokenAddressMap[token] === JSON.parse(event.eventInfo).market;
        }
        return true;
        // intentionally removing check. Further in flow, there is anyways loanId check
        // return (
        //   tokenAddressMap[token] === JSON.parse(event.eventInfo).loanMarket
        // );
      })
      .map((event: any) => {
        let value = JSON.parse(event.eventInfo).loanAmount;
        let displayToken = token;
        let showSign = false;
        let isNegative = false;
        if (
          event.event === "RevertSushiSwapped" ||
          event.event == "SushiSwapped"
        ) {
          value = "all";
        }
        if (event.event === "AddCollateral") {
          const collateralAddress = JSON.parse(
            event.eventInfo
          ).collateralMarket;
          displayToken = getTokenFromAddress(collateralAddress).name;
          value = JSON.parse(event.eventInfo).currentCollateralAmount;
        } else if (event.event === "LoanInterestDeduction") {
          value = JSON.parse(event.eventInfo).interestDeducted;
          showSign = true;
          isNegative = true;
        } else if (event.event == "WithdrawPartialLoan") {
          value = JSON.parse(event.eventInfo).amount;
          showSign = true;
          isNegative = true;
        }
        return {
          txnHash: event.txHash,
          actionType: event.event,
          date: event.createdon,
          value,
          tokenName: displayToken,
          showSign,
          isNegative,
          id: event.loanId,
        };
      });
  }

  static async getProtocolDepositLoanRates() {
    let route = `/api/recent-aprs`;
    return OffchainAPI.httpGet(route);
  }

  static async getHistoricalDepositRates() {
    let route = `/api/deposit-aprs`;
    return OffchainAPI.httpGet(route);
  }

  static async getHistoricalBorrowRates() {
    let route = `/api/borrow-aprs`;
    return OffchainAPI.httpGet(route);
  }
  static async getTransactionEventsRepaid(address: string, token: string) {
    let route = `/api/transactions-by-events/${address}`;
    let data = JSON.stringify({
      events: [
        "NewLoan",
        "WithdrawPartialLoan",
        "AddCollateral",
        "SushiSwapped",
        "RevertSushiSwapped",
        "LoanRepaid",
        "LoanInterestDeduction",
      ],
    });
    const events = await OffchainAPI.httpPost(route, data, "repaid", token);
    return events
      .filter((event: any) => {
        console.log(event.event);
        if (event.event === "RevertSushiSwapped") {
          return true;
        }
        if (event.event === "WithdrawPartialLoan") {
          return tokenAddressMap[token] === JSON.parse(event.eventInfo).market;
        }
        return true;
        // intentionally removing check. Further in flow, there is anyways loanId check
        // return (
        //   tokenAddressMap[token] === JSON.parse(event.eventInfo).loanMarket
        // );
      })
      .map((event: any) => {
        let value = JSON.parse(event.eventInfo).loanAmount;
        let displayToken = token;
        let showSign = false;
        let isNegative = false;
        if (
          event.event === "RevertSushiSwapped" ||
          event.event == "SushiSwapped"
        ) {
          value = "all";
        }
        if (event.event === "AddCollateral") {
          const collateralAddress = JSON.parse(
            event.eventInfo
          ).collateralMarket;
          displayToken = getTokenFromAddress(collateralAddress).name;
          value = JSON.parse(event.eventInfo).currentCollateralAmount;
        } else if (event.event === "LoanInterestDeduction") {
          value = JSON.parse(event.eventInfo).interestDeducted;
          showSign = true;
          isNegative = true;
        } else if (event.event == "WithdrawPartialLoan") {
          value = JSON.parse(event.eventInfo).amount;
          showSign = true;
          isNegative = true;
        } else if (event.event == "LoanRepaid") {
          value = "0";
        }
        return {
          txnHash: event.txHash,
          actionType: event.event,
          date: event.createdon,
          value,
          tokenName: displayToken,
          showSign,
          isNegative,
          id: event.loanId,
        };
      });
  }

  static async getOraclePrices() {
    let route = `/oracle-prices`;
    return OffchainAPI.httpGet(route);
    // return async () => {
    //   return OraclePrices;
    // }
  }

  static async getReserves() {
    let route = `/reserves`;
    return OffchainAPI.httpGet(route);
    // return Reserves;
  }
}
