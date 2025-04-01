export function formatNumberWithSpaces(number: number | string): string {
  const numberStr = typeof number === 'number' ? number.toString() : number;

  return numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
