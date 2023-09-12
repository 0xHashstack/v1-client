import axios from "axios";

export default class OffchainAPI {
  // static ENDPOINT = "https://offchainapi.mainnet.starknet.hashstack.finance";
  // static ENDPOINT = "http://18.143.34.55:3010";
  static ENDPOINT =
    process.env.NEXT_PUBLIC_NODE_ENV=="testnet" ?  
    "https://n4mqvzurra.execute-api.ap-southeast-1.amazonaws.com/":"";
  static WHITELIST_ENDPOINT = this.ENDPOINT;

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
      // console.log(err);
    }
  }

  static async setWhitelistData(address: string, email: string, name: string) {
    let route = `/api/add-whitelist-address/${address}`;
    // So many arguments not needed, just conforming to httpPost style. Only need to send account
    try {
      let url = `${this.WHITELIST_ENDPOINT}${route}`;
      let res = await axios({
        method: "post",
        url,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: name,
          email: email,
        },
      });
      return res.data;
    } catch (err) {
      //   toast.error(`${`Could not add to waitlist. Please try again.`}`, {
      //     position: toast.POSITION.BOTTOM_RIGHT,
      //     closeOnClick: true,
      //   });
      //   console.log(err);
      alert("error in whitelisting");
      return false;
    }
  }
}
