import { Brain, BookOpen, History, Settings, Image, MessageSquare } from 'lucide-react';

type NavItem = {
  id: string;
  icon: any;
  label: string;
};

const navItems: NavItem[] = [
  { id: 'home', icon: MessageSquare, label: 'Chat' },
  { id: 'learn', icon: BookOpen, label: 'Learn' },
  { id: 'image', icon: Image, label: 'Image' },
  { id: 'history', icon: History, label: 'History' },
  { id: 'settings', icon: Settings, label: 'Settings' }
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-around p-1.5">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button 
            key={id}
            onClick={() => onTabChange(id)}
            className={`p-3 rounded-xl transition-all duration-200 active:scale-[0.97] ${
              activeTab === id 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/10'
            }`}
            title={label}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs mt-1 hidden">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
} 