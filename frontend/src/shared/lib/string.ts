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
