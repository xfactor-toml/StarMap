export const roundNumber = (number: number | string, digit = 4): number => {
  const divider = digit ? Math.pow(10, digit) : 1;
  const rounded = Math.floor(Number(number) * divider) / divider;

  return rounded;
};
