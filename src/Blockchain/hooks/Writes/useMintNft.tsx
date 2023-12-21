import React, { useState } from 'react'
import {
    useAccount,
    useContractRead,
    useContractWrite,
    useWaitForTransaction,
  } from "@starknet-react/core";
const useMintNft = () => {
    const [messagehash, setMessageHash] = useState("0x414620902fb859afc50b3fdc61b0de3220835a56c9c78166f57403b715b01aa");
    const [signature, setSignature] = useState<any>( [
        '2424746983344360558782209678398788868430455506784152241462455820721485810985',
        '350876922535438032489743797824407964259448734563995516217243112214147331531'
      ])
    const {
        data: dataNFT,
        error: errorNFT,
        reset: resetNFT,
        write: writeNFT,
        writeAsync: writeAsyncNFT,
        isError: isErrorNFT,
        isIdle: isIdleNFT,
        isSuccess: isSuccessNFT,
        status: statusNFT,
      } = useContractWrite({
        calls: [
          {
            contractAddress: "0x0457f6078fd9c9a9b5595c163a7009de1d20cad7a9b71a49c199ddc2ac0f284b",
            entrypoint: "claim_soul_brand",
            calldata: [
              messagehash,
              signature,
            ],
          },
        ],
      });
      return {
        messagehash,
        setMessageHash,
        signature,
        setSignature,
        dataNFT,
        errorNFT,
        resetNFT,
        writeNFT,
        writeAsyncNFT,
        isErrorNFT,
        isIdleNFT,
        isSuccessNFT,
        statusNFT,
      };
}

export default useMintNft