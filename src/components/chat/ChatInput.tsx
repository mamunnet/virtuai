import { Send, X } from 'lucide-react';

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  replyTo?: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onCancelReply?: () => void;
}

export function ChatInput({ 
  message, 
  isLoading, 
  replyTo,
  onChange, 
  onSend,
  onCancelReply 
}: ChatInputProps) {
  return (
    <div className="px-5 py-4 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {replyTo && (
        <div className="mb-2 px-4 py-2 rounded-lg bg-secondary/10 text-sm flex items-center justify-between">
          <div className="flex-1 truncate">
            <span className="text-muted-foreground">Replying to: </span>
            <span className="text-foreground/90">{replyTo.length > 100 ? `${replyTo.slice(0, 100)}...` : replyTo}</span>
          </div>
          <button
            onClick={onCancelReply}
            className="ml-2 p-1 rounded-lg hover:bg-secondary/20 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="relative flex items-center gap-3">
        <div className="relative flex-1 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
          <input
            type="text"
            value={message}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && onSend()}
            placeholder="Type a message..."
            className="relative w-full bg-background/80 border border-border/40 rounded-xl px-4 py-3 text-sm 
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
              placeholder:text-muted-foreground/70 transition-all duration-300
              hover:border-primary/30 hover:bg-background/90"
            disabled={isLoading}
            autoFocus
          />
        </div>
        <button
          onClick={onSend}
          disabled={!message.trim() || isLoading}
          className={`p-3 rounded-xl transition-all duration-300 ${
            message.trim() && !isLoading
              ? 'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.97] hover:shadow-lg hover:shadow-primary/25' 
              : 'bg-secondary/10 text-muted-foreground'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
} 