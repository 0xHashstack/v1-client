// import { Token } from "@/Blockchain/interfaces/interfaces";
// import { ERC20Abi } from "@/Blockchain/stark-constants";
// import { getTokenFromName } from "@/Blockchain/utils/addressServices";
// import { etherToWeiBN } from "@/Blockchain/utils/utils";
// import {
//   useAccount,
//   useContractRead,
//   useContractWrite,
// } from "@starknet-react/core";
// import { useState } from "react";
// import { uint256 } from "starknet";

// const useTransfer = (asset: Token) => {
//   const { address: accountAddress } = useAccount();
//   console.log("account use Transfer", accountAddress, asset);
//   const {
//     data: dataTransfer,
//     write: writeTransfer,
//     writeAsync: writeAsyncTransfer,
//     error: errorTransfer,
//   } = useContractWrite({
//     calls: {
//       contractAddress: getTokenFromName("USDT")?.address,
//       entrypoint: "transfer",
//       calldata: [
//         accountAddress,
//         "0x0732f5f56f0a0a1888a9db1f35bc729595f6c62c492e08dffe9d5c71ab1a3532",
//         uint256.bnToUint256(etherToWeiBN(1, asset)),
//       ],
//     },
//   });

//   const handleTransfer = async () => {
//     try {
//       const result = await writeAsyncTransfer();
//       console.log("account result", result);
//     } catch (e) {
//       console.log("account result error", e);
//     }
//   };

//   return {
//     dataTransfer,
//     errorTransfer,
//     writeTransfer,
//     writeAsyncTransfer,
//     handleTransfer,
//   };
// };

// export default useTransfer;
