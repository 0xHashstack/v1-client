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
}
