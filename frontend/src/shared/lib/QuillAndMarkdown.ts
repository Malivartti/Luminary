interface QuillDelta {
  ops: Array<{
    insert?: string;
    attributes?: {
      size?: 'small' | 'normal' | 'large' | 'huge'; // Добавлен normal
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      strike?: boolean;
      link?: string;
      list?: 'ordered' | 'bullet';
    };
  }>;
}

// Конвертация Markdown в Quill Delta
export function markdownToQuill(markdown: string): QuillDelta {
  const lines = markdown.split('\n');
  const ops: QuillDelta['ops'] = [];

  lines.forEach(line => {
    const remainingText = line.trim();
    
    // Обработка списков
    if (remainingText.startsWith('- ')) {
      ops.push({
        insert: remainingText.slice(2),
        attributes: { list: 'bullet' },
      });
    }
    else if (remainingText.match(/^\d+\.\s/)) {
      ops.push({
        insert: remainingText.replace(/^\d+\.\s/, ''),
        attributes: { list: 'ordered' },
      });
    }
    else {
      const attributes: any = {};
      let text = remainingText;

      // Размер текста
      if (text.startsWith('# ')) {
        attributes.size = 'huge';
        text = text.slice(2);
      } else if (text.startsWith('## ')) {
        attributes.size = 'large';
        text = text.slice(3);
      } else if (text.startsWith('### ')) {
        attributes.size = 'small';
        text = text.slice(4);
      } else {
        attributes.size = 'normal'; // Размер по умолчанию
      }

      // Жирный
      const boldMatch = text.match(/\*\*(.*?)\*\*/);
      if (boldMatch) {
        attributes.bold = true;
        text = boldMatch[1];
      }

      // Курсив
      const italicMatch = text.match(/\*(.*?)\*/);
      if (italicMatch) {
        attributes.italic = true;
        text = italicMatch[1];
      }

      // Подчеркнутый
      const underlineMatch = text.match(/__(.*?)__/);
      if (underlineMatch) {
        attributes.underline = true;
        text = underlineMatch[1];
      }

      // Зачеркнутый
      const strikeMatch = text.match(/~~(.*?)~~/);
      if (strikeMatch) {
        attributes.strike = true;
        text = strikeMatch[1];
      }

      // Ссылка
      const linkMatch = text.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        attributes.link = linkMatch[2];
        text = linkMatch[1];
      }

      ops.push({
        insert: text + '\n',
        attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
      });
    }
  });

  return { ops };
}

// Конвертация Quill Delta в Markdown
export function quillToMarkdown(delta: QuillDelta): string {
  let markdown = '';
  let listCounter = 1; // Счетчик для упорядоченных списков
  let currentLine = ''; //  Буфер для накопления текста текущей строки

  delta.ops.forEach((op, index) => {
    if (!op.insert) return;

    let text = op.insert;

    // Обработка символов новой строки
    const newlines = text.split('\n');

    for (let i = 0; i < newlines.length; i++) {
      const line = newlines[i];

      currentLine += line;

      if (i < newlines.length - 1) {
        // Если это не последняя строка, значит, дальше будет новая строка
        if (op.attributes?.list === 'bullet') {
          markdown += `- ${currentLine}\n`;
        } else if (op.attributes?.list === 'ordered') {
          markdown += `${listCounter}. ${currentLine}\n`;
          listCounter++;
        } else {
          markdown += currentLine + '\n';
        }

        currentLine = ''; // Сбрасываем буфер для новой строки
      }
    }

    // Обработка стилей текста, если строка не заканчивается новой строкой и не является списком
    if (newlines.length === 1 && !op.attributes?.list) {

      // Обработка размера
      if (op.attributes?.size === 'huge') {
        text = `\n# ${text}`;
      } else if (op.attributes?.size === 'large') {
        text = `\n## ${text}`;
      } else if (op.attributes?.size === 'small') {
        text = `\n### ${text}`;
      }

      // Обработка стилей текста
      if (op.attributes?.bold) {
        text = `**${text}**`;
      }
      if (op.attributes?.italic) {
        text = `*${text}*`;
      }
      if (op.attributes?.underline) {
        text = `__${text}__`;
      }
      if (op.attributes?.strike) {
        text = `~~${text}~~`;
      }
      if (op.attributes?.link) {
        text = `[${text}](${op.attributes.link})`;
      }

      currentLine += text;
    }

    if (index === delta.ops.length - 1 && currentLine !== '') {
      markdown += currentLine;
    }
  });

  return markdown;
}