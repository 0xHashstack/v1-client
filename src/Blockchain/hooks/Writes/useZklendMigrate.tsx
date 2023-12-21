import {
    useAccount,
    useContractRead,
    useContractWrite,
    useWaitForTransaction,
  } from "@starknet-react/core";
  import { useEffect, useState } from "react";
  import { Abi, uint256 } from "starknet";
  import { ERC20Abi, diamondAddress,nftAddress } from "../../stark-constants";
  import { etherToWeiBN, weiToEtherNumber } from "../../utils/utils";
  import { tokenAddressMap } from "@/Blockchain/utils/addressServices";
  import { NativeToken, Token } from "@/Blockchain/interfaces/interfaces";

const useZklendMigrate = () => {
    const { address: account } = useAccount();
    const [zTokenAmount, setzTokenAmount] = useState<number>(0.000158152493973044);
    const [zToken, setzToken] = useState<Token | any>("ETH");
    const {
        data:dataZklendMigrate,
        writeAsync: writeAsyncZklendMigrate,
        error: errorZklendMigrate,
    }=useContractWrite({
        calls:[
            {
                contractAddress:"0xc92a503b2979197bb5d671f70f50ca48f3d144eaa90bc0a831684313f6e683",
                entrypoint:"approve",
                calldata:[
                    "0x07663daea12ba87926a2b4161389e352a1d1304da4b67573a7ffcca74743982e",
                    etherToWeiBN(zTokenAmount, zToken).toString(),
                    "0"
                ]
            },{
                contractAddress:"0x07663daea12ba87926a2b4161389e352a1d1304da4b67573a7ffcca74743982e",
                entrypoint:"zklend_migrate",
                calldata:[
                    etherToWeiBN(zTokenAmount, zToken).toString(),
                    "0",
                    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                ]
            }
        ]
    })
  return {
    zTokenAmount,
    setzTokenAmount,
    zToken,
    setzToken,
    dataZklendMigrate,
    writeAsyncZklendMigrate,
    errorZklendMigrate
  }
}

export default useZklendMigrate