import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Brain, Reply, Copy, Check } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  pending?: boolean;
  timestamp?: number;
}

interface ChatMessagesProps {
  messages: Message[];
  onReply?: (text: string) => void;
}

export function ChatMessages({ messages, onReply }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReply = (text: string) => {
    if (onReply) {
      onReply(text);
    }
  };

  const MarkdownComponents = {
    h1: ({ node, ...props }) => <h1 className="text-xl font-bold my-4" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-lg font-bold my-3" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-base font-bold my-2" {...props} />,
    p: ({ node, ...props }) => <p className="my-2 leading-relaxed" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc list-inside my-2 space-y-1" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-2 space-y-1" {...props} />,
    li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
    a: ({ node, ...props }) => (
      <a 
        className="text-primary hover:underline" 
        target="_blank" 
        rel="noopener noreferrer" 
        {...props} 
      />
    ),
    blockquote: ({ node, ...props }) => (
      <blockquote 
        className="border-l-4 border-primary/30 pl-4 my-2 italic text-muted-foreground"
        {...props} 
      />
    ),
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="my-4 rounded-lg overflow-hidden">
          <div className="bg-zinc-900 text-zinc-400 text-xs px-4 py-1.5">
            {match[1].toUpperCase()}
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            className="!my-0 !bg-zinc-900"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code 
          className="bg-secondary/20 rounded px-1.5 py-0.5 text-sm font-mono" 
          {...props}
        >
          {children}
        </code>
      );
    },
    table: ({ node, ...props }) => (
      <div className="my-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-border" {...props} />
      </div>
    ),
    th: ({ node, ...props }) => (
      <th 
        className="px-4 py-2 text-left text-sm font-medium bg-secondary/10" 
        {...props} 
      />
    ),
    td: ({ node, ...props }) => (
      <td 
        className="px-4 py-2 text-sm border-t border-border/50" 
        {...props} 
      />
    ),
  };

  return (
    <div className="flex-1 space-y-4 overflow-y-auto pb-4 px-4">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
          <Brain className="w-12 h-12 text-primary/70" />
          <div>
            <h3 className="text-lg font-semibold mb-1">Welcome to JellyAI</h3>
            <p className="text-sm text-muted-foreground">
              Start a conversation with Jelly or select a question to begin
            </p>
          </div>
        </div>
      )}
      {messages.map((msg, index) => (
        <div
          key={msg.id}
          className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-4`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div
            className={`relative group max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm 
              ${msg.isAI 
                ? 'bg-secondary/10 border border-border/40 text-foreground/90 hover:bg-secondary/20' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
              } 
              ${msg.pending ? 'animate-pulse' : ''}
              transition-all duration-200 hover:shadow-md
            `}
          >
            {msg.pending ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            ) : (
              <>
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={MarkdownComponents}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
                {msg.isAI && !msg.pending && (
                  <div className="absolute -bottom-8 right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleReply(msg.text)}
                      className="p-1.5 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-muted-foreground hover:text-foreground transition-colors"
                      title="Reply to this message"
                    >
                      <Reply className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="p-1.5 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-muted-foreground hover:text-foreground transition-colors"
                      title={copiedId === msg.id ? 'Copied!' : 'Copy message'}
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
            {msg.timestamp && (
              <div className="absolute -bottom-5 left-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
} 