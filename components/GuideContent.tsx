import React from 'react';
import Link from 'next/link';

interface GuideContentProps {
  content: string;
}

export const GuideContent: React.FC<GuideContentProps> = ({ content }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLanguage = '';
  let inTable = false;
  let tableRows: string[][] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-4 space-y-2 list-disc list-inside text-apple-label-secondary text-sm sm:text-base leading-relaxed pl-2">
          {listBuffer.map((item, i) => (
            <li key={i} className="marker:text-apple-blue/70">
              {renderFormattedText(item)}
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const header = tableRows[0];
      const rows = tableRows.slice(1).filter((r) => !r.every((c) => c.match(/^:?-+:?$/)));

      elements.push(
        <div key={`table-${elements.length}`} className="my-6 overflow-x-auto rounded-xl border border-apple-border shadow-apple-sm">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-apple-well border-b border-apple-border text-apple-label font-semibold">
                {header.map((col, idx) => (
                  <th key={idx} className="p-3 sm:px-4">
                    {renderFormattedText(col.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-border/50 bg-apple-card/60">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-apple-well/30 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3 sm:px-4 text-apple-label-secondary">
                      {renderFormattedText(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  const renderFormattedText = (text: string): React.ReactNode => {
    // Process markdown links [text](url)
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(processInlineFormatting(text.substring(lastIndex, match.index)));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      const isInternal = linkUrl.startsWith('/');

      parts.push(
        isInternal ? (
          <Link
            key={match.index}
            href={linkUrl}
            className="text-apple-blue hover:underline font-medium inline-flex items-center"
          >
            {processInlineFormatting(linkText)}
          </Link>
        ) : (
          <a
            key={match.index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-apple-blue hover:underline font-medium inline-flex items-center"
          >
            {processInlineFormatting(linkText)}
          </a>
        )
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(processInlineFormatting(text.substring(lastIndex)));
    }

    return parts.length > 0 ? parts : text;
  };

  const processInlineFormatting = (str: string): React.ReactNode => {
    // Process bold (**text**), code (`code`)
    const tokenRegex = /(\*\*.*?\*\*|`.*?`)/g;
    const tokens = str.split(tokenRegex);

    return tokens.map((token, idx) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-apple-label">
            {token.slice(2, -2)}
          </strong>
        );
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded bg-apple-well border border-apple-border text-[12px] sm:text-[13px] font-mono text-apple-blue"
          >
            {token.slice(1, -1)}
          </code>
        );
      }
      return token;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${elements.length}`} className="my-6 rounded-xl bg-[#0d0f12] border border-apple-border p-4 overflow-x-auto text-xs sm:text-sm font-mono text-apple-label shadow-apple-sm">
            <pre className="text-gray-200">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        flushList();
        flushTable();
        inCodeBlock = true;
        codeLanguage = line.replace('```', '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushList();
      const cells = line.trim().slice(1, -1).split('|');
      tableRows.push(cells);
      inTable = true;
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Lists
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      listBuffer.push(line.trim().substring(2));
      continue;
    } else {
      flushList();
    }

    // Numbered lists (e.g. 1. text)
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <div key={`num-${i}`} className="my-2.5 flex items-start gap-2.5 text-apple-label-secondary text-sm sm:text-base leading-relaxed">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-apple-well border border-apple-border flex items-center justify-center text-xs font-semibold text-apple-label">
            {numMatch[1]}
          </span>
          <div className="pt-0.5">{renderFormattedText(numMatch[2])}</div>
        </div>
      );
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      const headingText = line.replace('### ', '').trim();
      const idMatch = headingText.match(/\{#(.*?)\}$/);
      const cleanTitle = idMatch ? headingText.replace(/\{#(.*?)\}$/, '').trim() : headingText;
      const id = idMatch ? idMatch[1] : cleanTitle.toLowerCase().replace(/[^\w]+/g, '-');

      elements.push(
        <h3
          key={`h3-${i}`}
          id={id}
          className="scroll-mt-24 text-xl sm:text-2xl font-bold tracking-tight text-apple-label mt-10 mb-4 pt-2"
        >
          {cleanTitle}
        </h3>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      const headingText = line.replace('## ', '').trim();
      const idMatch = headingText.match(/\{#(.*?)\}$/);
      const cleanTitle = idMatch ? headingText.replace(/\{#(.*?)\}$/, '').trim() : headingText;
      const id = idMatch ? idMatch[1] : cleanTitle.toLowerCase().replace(/[^\w]+/g, '-');

      elements.push(
        <h2
          key={`h2-${i}`}
          id={id}
          className="scroll-mt-24 text-2xl sm:text-3xl font-bold tracking-tight text-apple-label mt-12 mb-4 pt-2 border-b border-apple-border/50 pb-3"
        >
          {cleanTitle}
        </h2>
      );
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---') {
      elements.push(
        <hr key={`hr-${i}`} className="my-8 border-apple-border/60" />
      );
      continue;
    }

    // Regular Paragraph
    if (line.trim()) {
      elements.push(
        <p key={`p-${i}`} className="my-4 text-sm sm:text-base text-apple-label-secondary leading-relaxed">
          {renderFormattedText(line.trim())}
        </p>
      );
    }
  }

  flushList();
  flushTable();

  return <div className="guide-prose">{elements}</div>;
};
