import axios from "axios";
import { tokenAddressMap } from "../blockchain/stark-constants";

export default class OffchainAPI {
  // static ENDPOINT = 'http://52.77.185.41:3000'
  static ENDPOINT = "https://offchainapi.testnet.starknet.hashstack.finance";

  static async httpGet(route: string) {
    try {
      let url = `${OffchainAPI.ENDPOINT}${route}`;
      console.log("offchain url", url);
      let data = await axios.get(url);
      return data.data;
    } catch (err) {
      console.error("httpGet", route, err);
      return [];
    }
  }

  static async httpPost(route: string, data: any, type: string, token: string) {
    try {
      let url = `${this.ENDPOINT}${route}`;
      let res = await axios({
        method: "post",
        url,
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
      console.log(res.data);
      let displayEvents = res.data
        .filter((event: any) => {
          if (type === "deposits") {
            return (
              tokenAddressMap[token] === JSON.parse(event.eventInfo).market
            );
          }
          if (type === "loans") {
            console.log(event.event);
            if (event.event === "RevertSushiSwapped") {
              return true;
            }
            return (
              tokenAddressMap[token] === JSON.parse(event.eventInfo).loanMarket
            );
          }
          if (type === "repaid") {
            return (
              tokenAddressMap[token] === JSON.parse(event.eventInfo).market ||
              tokenAddressMap[token] === JSON.parse(event.eventInfo).loanMarket
            );
          }
        })
        .map((event: any) => {
          if (type === "deposits") {
            return {
              txnHash: event.txHash,
              actionType: event.event,
              date: event.createdon,
              value: JSON.parse(event.eventInfo).amount,
            };
          } else if (type === "loans") {
            if (event.event === "RevertSushiSwapped") {
              return {
                txnHash: event.txHash,
                actionType: "SwappedToLoan",
                date: event.createdon,
                value: 'all',
              };
            } else if (event.event === "SushiSwapped") {
              return {
                txnHash: event.txHash,
                actionType: "SwappedToSecondary",
                date: event.createdon,
                value: 'all',
              };
            }
            return {
              txnHash: event.txHash,
              actionType: event.event,
              date: event.createdon,
              value: JSON.parse(event.eventInfo).loanAmount,
            };
          } else if (type === "repaid") {
            return {
              txnHash: event.txHash,
              actionType: event.event,
              date: event.createdon,
              value: JSON.parse(event.eventInfo).amount
                ? JSON.parse(event.eventInfo).amount
                : JSON.parse(event.eventInfo).loanAmount,
            };
          }
        });
      console.log(data, res.data);
      return displayEvents;
    } catch (err) {
      console.error("httpPost", route, err);
      return [];
    }
  }

  static getLoans(address: string) {
    let url = `/api/loans/${address}`;
    return OffchainAPI.httpGet(url);
  }

  static getActiveDeposits(address: string) {
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

  static async getTransactionEventsActiveDeposits(
    address: string,
    token: string
  ) {
    let route = `/api/transactions-by-events/${address}`;
    let data = JSON.stringify({
      events: ["NewDeposit", "AddDeposit", "WithdrawDeposit"],
    });
    return OffchainAPI.httpPost(route, data, "deposits", token);
  }

  static async getTransactionEventsActiveLoans(address: string, token: string) {
    let route = `/api/transactions-by-events/${address}`;
    let data = JSON.stringify({
      events: [
        "NewLoan",
        "WithdrawPartial",
        "AddCollateral",
        "SushiSwapped",
        "RevertSushiSwapped",
      ],
    });
    return OffchainAPI.httpPost(route, data, "loans", token);
  }
  static async getTransactionEventsRepaid(address: string, token: string) {
    let route = `/api/transactions-by-events/${address}`;
    let data = JSON.stringify({
      events: [
        "NewLoan",
        "LoanRepaid",
        "WithdrawPartial",
        // "AddCollateral",
        // "WithdrawCollateral",
        // "SushiSwapped",
        // "RevertSushiSwapped",
      ],
    });
    return OffchainAPI.httpPost(route, data, "repaid", token);
  }
}
