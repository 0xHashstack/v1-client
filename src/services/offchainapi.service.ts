import axios from "axios";

export default class OffchainAPI {
  static ENDPOINT = "https://offchainapi.mainnet.starknet.hashstack.finance";
  static WHITELIST_ENDPOINT = this.ENDPOINT;
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
