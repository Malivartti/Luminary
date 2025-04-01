function formatDateNumber(number: number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}

export const formatDDMMYYYY = (date: Date): string => {
  return `${formatDateNumber(date.getDate())}.${formatDateNumber(date.getMonth() + 1)}.${date.getFullYear()}`;
};

export const formatHHMM = (date: Date): string => {
  return `${formatDateNumber(date.getHours())}:${formatDateNumber(date.getMinutes())}`;
};

export const formatDDMMYYYYHHMM = (date: Date): string => {
  return `${formatDDMMYYYY(date)} ${formatHHMM(date)}`;
};