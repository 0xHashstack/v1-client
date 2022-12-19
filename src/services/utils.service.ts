import { BigNumber } from "ethers";


export function ceil(num: number, decimals: number) {
    let pow = BigNumber.from(Math.pow(10, decimals))
    let result = Math.ceil(num * pow.toNumber())/pow.toNumber()
    return Number(result.toFixed(decimals))
}

export function round(num: number | string, decimals: number) {
    if(typeof num == 'string') {
        num = Number(num)
    }
    return Number(num.toFixed(decimals))
}