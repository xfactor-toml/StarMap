export function formatNumber(
  number: number,
  options: Intl.NumberFormatOptions = {
    maximumFractionDigits: 4
  }
) {
  if (number === undefined) {
    return '';
  }

  const formatter = new Intl.NumberFormat('ru', options);

  return formatter.format(number);
}
