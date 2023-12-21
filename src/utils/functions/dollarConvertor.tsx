import { selectOraclePrices } from "@/store/slices/readDataSlice";
import { useSelector } from "react-redux";
const dollarConvertor=(input:any,coin:any,dataOraclePrices:any)=>{
    // if (input === null) return "";
    var number = parseFloat(input);
  
    // if (isNaN(number)) {
    //   return "Invalid input";
    // }
    if(dataOraclePrices){
        const parsedAmount =
        dataOraclePrices.find((curr: any) => curr.name === coin)
          ?.price * input;
          return parsedAmount;
    }
    return 0;
}
export default dollarConvertor;