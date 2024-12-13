interface Message {
  id: string;
  text: string;
  isAI: boolean;
  pending?: boolean;
  timestamp?: number;
}

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto pb-4">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          Start a conversation or select a question
        </div>
      )}
      {messages.map((msg, index) => (
        <div
          key={msg.id}
          className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-4`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm 
              ${msg.isAI 
                ? 'bg-secondary/10 border border-border/40 text-foreground/90' 
                : 'bg-primary text-primary-foreground'
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
              msg.text
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 