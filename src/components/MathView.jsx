import React, { useMemo } from 'react';
import katex from 'katex';

/**
 * MathView renders inline/block LaTeX formulas OR mixed text containing $...$ delimiters safely.
 * @param {string} math - LaTeX string or mixed text with $math$
 * @param {boolean} block - Display as block or inline
 * @param {string} className - Additional CSS classes
 */
export default function MathView({ math = '', block = false, className = '' }) {
  const content = typeof math === 'string' ? math : String(math ?? '');

  const rendered = useMemo(() => {
    if (!content) return null;

    // 1. If text has $...$ or $$...$$ delimiters, parse mixed text
    if (content.includes('$')) {
      const tokens = [];
      const regex = /\$\$([\s\S]+?)\$\$|\$([^\$]+?)\$/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          tokens.push({ type: 'text', value: content.substring(lastIndex, match.index) });
        }
        const isDisplay = match[1] !== undefined;
        const formula = isDisplay ? match[1] : match[2];
        tokens.push({ type: 'math', value: formula, isDisplay });
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < content.length) {
        tokens.push({ type: 'text', value: content.substring(lastIndex) });
      }

      return {
        type: 'mixed',
        tokens
      };
    }

    // 2. Safety check: If it has Vietnamese characters and NO $ delimiters, do NOT feed into KaTeX directly!
    const hasVietnamese = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(content);
    if (hasVietnamese) {
      return {
        type: 'rawText',
        value: content
      };
    }

    // 3. Pure LaTeX formula (e.g. \int f(x)dx, 2\cos 2x)
    try {
      const html = katex.renderToString(content, {
        displayMode: block,
        throwOnError: false,
      });
      return {
        type: 'html',
        html
      };
    } catch (e) {
      return {
        type: 'rawText',
        value: content
      };
    }
  }, [content, block]);

  if (!rendered) return null;

  if (rendered.type === 'mixed') {
    return (
      <span className={`${block ? 'block text-center my-2 overflow-x-auto scrollbar-none py-1' : 'inline'} ${className}`}>
        {rendered.tokens.map((token, idx) => {
          if (token.type === 'text') {
            return <span key={idx}>{token.value}</span>;
          }
          try {
            const html = katex.renderToString(token.value, {
              displayMode: token.isDisplay,
              throwOnError: false,
            });
            return (
              <span
                key={idx}
                className={token.isDisplay ? 'block text-center my-1' : 'inline-block mx-0.5'}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            return <span key={idx}>{token.value}</span>;
          }
        })}
      </span>
    );
  }

  if (rendered.type === 'rawText') {
    return <span className={`${block ? 'block text-center my-2' : 'inline'} ${className}`}>{rendered.value}</span>;
  }

  return (
    <span
      className={`${block ? 'block text-center my-2 overflow-x-auto scrollbar-none py-1' : 'inline-block'} ${className}`}
      dangerouslySetInnerHTML={{ __html: rendered.html }}
    />
  );
}
