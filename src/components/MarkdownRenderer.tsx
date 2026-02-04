'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose max-w-none prose-headings:text-[rgb(var(--text-high))] prose-p:text-[rgb(var(--text-low))] prose-strong:text-[rgb(var(--text-high))] prose-a:text-accent-500">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
