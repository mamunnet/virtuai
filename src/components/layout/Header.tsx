import { Brain, X } from 'lucide-react';

interface HeaderProps {
  showCloseButton?: boolean;
  onClose?: () => void;
}

export function Header({ showCloseButton, onClose }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2.5">
        <Brain className="w-6 h-6 text-primary" />
        <span className="font-semibold text-lg tracking-tight">Mamun Saikh</span>
      </div>
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-secondary/20 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </header>
  );
} 