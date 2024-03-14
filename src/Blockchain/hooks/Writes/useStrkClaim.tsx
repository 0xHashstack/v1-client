import  { useState } from 'react'
import {
    useContractWrite,
  } from "@starknet-react/core";
import { etherToWeiBN } from '@/Blockchain/utils/utils';

const useClaimStrk = () => {
    const [round, setRound] = useState("1")
    const [strkAmount, setstrkAmount] = useState<number>(100)

    const [proof, setProof] = useState([
        '0x133dc8a91a6503962a20ffebf1c5974713e217a19932709d7e844740ff1242e',
        '0x7957d036cf1e60858a601df12e0fb2921114d4b5facccf638163e0bb2be3c34',
        '0x1baa08224a2fbc4dc71734549e0ad1bbf85b3586014d3d7aa229b85474aae67'
      ])
    const {
        data: datastrkClaim,
        error: errorstrkClaim,
        reset: resetstrkClaim,
        write: writestrkClaim,
        writeAsync: writeAsyncstrkClaim,
        isError: isErrorstrkClaim,
        isIdle: isIdlestrkClaim,
        isSuccess: isSuccessstrkClaim,
        status: statusstrkClaim,
      } = useContractWrite({
        calls: [
          {
            contractAddress: "0x7e5561300d7cc1cc44900ede6d0d4892e6251e27d61f7707ba3a1b8d0fe99b8",
            entrypoint: "request_airdrop",
            calldata: [
              round,
              "100000000000000000000",
              "0",
              proof.length.toString(),
              ...proof,
            ],
          },
        ],
      });
      return {
        datastrkClaim,
        errorstrkClaim,
        resetstrkClaim,
        writestrkClaim,
        writeAsyncstrkClaim,
        isErrorstrkClaim,
        isIdlestrkClaim,
        isSuccessstrkClaim,
        statusstrkClaim,
      };
}

export default useClaimStrk