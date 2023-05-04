export const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (c) => c.toLocaleUpperCase());
};
