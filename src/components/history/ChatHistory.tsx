interface ChatHistoryItem {
  id: string;
  messages: any[];
  lastMessage: string;
  timestamp: number;
}

interface ChatHistoryProps {
  history: ChatHistoryItem[];
  onChatSelect: (chat: ChatHistoryItem) => void;
}

export function ChatHistory({ history, onChatSelect }: ChatHistoryProps) {
  return (
    <div className="space-y-3">
      {history.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onChatSelect(chat)}
          className="w-full text-left p-4 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-all duration-200 border border-border/40 hover:shadow-md"
        >
          <p className="text-sm font-medium text-foreground/90">{chat.lastMessage}</p>
          <p className="text-xs text-muted-foreground mt-1.5">
            {new Date(chat.timestamp).toLocaleString()}
          </p>
        </button>
      ))}
      {history.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">No chat history yet</p>
        </div>
      )}
    </div>
  );
} 