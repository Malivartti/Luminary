export function splitTextByEmptyLines(text: string): string[] {
  if (!text) return [];
  const lines = text.split('\n');
  const result = [];
  let currentBlock = [];

  for (const line of lines) {
    if (line.trim() === '') {
      if (currentBlock.length > 0) {
        result.push(currentBlock.join('\n'));
        currentBlock = [];
      }
    } else {
      currentBlock.push(line);
    }
  }

  if (currentBlock.length > 0) {
    result.push(currentBlock.join('\n'));
  }

  return result;
}

export function truncateString(
  text: string, 
  maxLength: number = 10, 
  separator: string = '...'
): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  const availableLength = maxLength - separator.length;
  const partLength = Math.floor(availableLength / 2);
  const remainingLength = availableLength - partLength;
  
  return text.slice(0, partLength) + separator + text.slice(-remainingLength);
};
