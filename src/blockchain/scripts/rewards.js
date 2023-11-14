import { useSigner } from "wagmi";
import { ethers, JsonRpcProvider, JsonRpcApiProvider, BrowserProvider, InfuraProvider } from 'ethers'
import presaleAbi from '../abis/presaleabi.json'
export async function presale(){
    try{
        const abi=presaleAbi?.abi;
        const address="0x83e6b164c6d130567316cecf3bc7879203772943";
        let provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_JSONRPC_WALLET, 'mainnet');
        const { data: signer } = useSigner(); 
        const erc20 = new ethers.Contract(address, abi, signer);
        console.log(erc20,"erc")
    }catch(err){
        console.log(err,"err in getting pre sale")
    }
}