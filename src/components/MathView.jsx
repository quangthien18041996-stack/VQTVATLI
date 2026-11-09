import React, { useMemo } from 'react';
import katex from 'katex';

/**
 * MathView renders inline or block LaTeX using KaTeX safely
 * @param {string} math - LaTeX string
 * @param {boolean} block - Display as block or inline
 */
export default function MathView({ math, block = false, className = '' }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch (e) {
      return math;
    }
  }, [math, block]);

  return (
    <span
      className={`${block ? 'block text-center my-2 overflow-x-auto scrollbar-none py-1' : 'inline-block'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
