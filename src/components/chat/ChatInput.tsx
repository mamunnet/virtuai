import { Send } from 'lucide-react';

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ message, isLoading, onChange, onSend }: ChatInputProps) {
  return (
    <div className="px-5 py-4 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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