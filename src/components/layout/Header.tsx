import { Brain, X, LogOut } from 'lucide-react';
import { User } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface HeaderProps {
  showCloseButton?: boolean;
  onClose?: () => void;
  user: User;
}

export function Header({ showCloseButton, onClose, user }: HeaderProps) {
  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <header className="flex items-center justify-between px-5 py-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2.5">
        <Brain className="w-6 h-6 text-primary" />
        <span className="font-semibold text-lg tracking-tight">JellyAI</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground mr-2">
            {user.displayName || user.email?.split('@')[0]}
          </div>
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="w-8 h-8 rounded-full border border-border/40"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-border/40 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {(user.displayName || user.email || '?')[0].toUpperCase()}
              </span>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="p-2 rounded-lg hover:bg-secondary/20 text-muted-foreground hover:text-foreground transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary/20 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
} 