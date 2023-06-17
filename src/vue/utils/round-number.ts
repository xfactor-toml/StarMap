export const roundNumber = (
  number: number | string,
  digit = 4,
  method: 'floor' | 'ceil' = 'floor'
): number => {
  const divider = digit ? Math.pow(10, digit) : 1;
  const rounded = Math[method](Number(number) * divider) / divider;

  return rounded;
};
