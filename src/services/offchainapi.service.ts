import axios from "axios";

export default class OffchainAPI {
  // static ENDPOINT = 'http://52.77.185.41:3000'
  static ENDPOINT = "http://localhost:3010";

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

  static async httpPost(route: string, data: any, type: string) {
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
      let retData = res.data.map((event: any) => {
        if (type === "deposits") {
          return {
            txnHash: event.txHash,
            actionType: event.event,
            date: event.createdon,
            value: JSON.parse(event.eventInfo).amount,
          };
        } else if (type === "loans") {
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
            value: JSON.parse(event.eventInfo).amount,
          };
        }
      });
      console.log(data, res.data);
      return retData;
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

  static async getTransactionEventsActiveDeposits(address: string) {
    let route = `/api/transactions-by-events/${address}`;
    let data = JSON.stringify({
      events: ["NewDeposit", "AddDeposit", "WithdrawDeposit"],
    });
    return OffchainAPI.httpPost(route, data, "deposits");
  }

  static async getTransactionEventsActiveLoans(address: string) {
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
    return OffchainAPI.httpPost(route, data, "loans");
  }
  static async getTransactionEventsRepaid(address: string) {
    let route = `/api/transactions-by-events/${address}`;
    let data = JSON.stringify({
      events: [
        "NewLoan",
        "LoanRepaid ",
        "WithdrawPartial",
        "AddCollateral",
        "WithdrawCollateral",
        "SushiSwapped",
        "RevertSushiSwapped",
      ],
    });
    return OffchainAPI.httpPost(route, data, "repaid");
  }
}
