const numberFormatter = (num: number) => {
  // const absNum = Math.abs(num);
  const absNum = num;
  if (absNum >= 1e9) {
    return (num / 1e9).toFixed(9) + "B";
  } else if (absNum >= 1e6) {
    return (num / 1e6).toFixed(6) + "M";
  } else if (absNum >= 1e3) {
    return (num / 1e3).toFixed(3) + "K";
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
// console.log("hey");
// console.log(formatNumber(2028222220.2222));
// console.log(formatNumber(2022));
export default numberFormatter;
