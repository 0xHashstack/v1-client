// export const calculateNetAprEarned = () => {
//   let sum = 0;
//   for (let i = 0; i < oracleAndFairPrices?.oraclePrices?.length; i++) {
//     activeDepositsData.map((item: any, index: number) => {
//       if (item?.market === oracleAndFairPrices?.oraclePrices[i].name) {
//         sum +=
//           (Number(item?.acquiredYield) /
//             10 ** Number(tokenDecimalsMap[item?.market])) *
//           oracleAndFairPrices?.oraclePrices[i].price;
//       }
//     });
//   }
//   // console.log("net apr earned", sum);
//   return sum;
// };
