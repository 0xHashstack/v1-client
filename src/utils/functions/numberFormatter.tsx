const numberFormatter = (input: any) => {
  var number = parseFloat(input);

  if (isNaN(number)) {
    return "Invalid input";
  }

  var suffixes = [
    "",
    "K",
    "M",
    "B",
    "T",
    "Qa",
    "Qi",
    "Sx",
    "Sp",
    "Oc",
    "No",
    "Dc",
    "Un",
  ];
  var magnitude = 0;
  while (Math.abs(number) >= 1000) {
    magnitude++;
    number /= 1000.0;
  }

  // Format the number with the appropriate magnitude and suffix
  var formattedNumber = number.toFixed(2).replace(/\.?0+$/, ""); // Remove trailing zeros and decimal point if unnecessary

  return formattedNumber + suffixes[magnitude];
};
// console.log("hey");
// console.log(formatNumber(2028222220.2222));
// console.log(formatNumber(2022));
export default numberFormatter;
