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

  static async getTransactionEvents(address: string) {
    try {
      let route = `/api/transactions-by-events/${address}`;
      let url = `${this.ENDPOINT}${route}`;
      let data = JSON.stringify({
        events: ["NewDeposit", "AddDeposit", "NewLoan"],
      });

      let res = await axios({
        method: "post",
        url,
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
      let retData = res.data.map((event: any) => {
        return {
          txnHash: event.txHash,
          actionType: event.event,
          date: event.createdon,
          value: JSON.parse(event.eventInfo).amount,
        };
      });
      // let retData = {
      //   txnHash: res.data.txnHash,
      //   actionType: res.data.event,
      //   date: res.data.createdon,
      //   value: JSON.parse(res.data.eventInfo).amount,
      // };
      return retData;
    } catch (err) {
      console.log(err);
    }
  }
}
