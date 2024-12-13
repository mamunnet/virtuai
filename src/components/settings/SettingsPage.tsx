import { Moon, Sun, Bell, Lock, HelpCircle, Info } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your app preferences and account settings.</p>
      </div>

      <div className="space-y-4">
        {/* Appearance */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Appearance</h3>
          <div className="bg-secondary/10 rounded-xl p-4 space-y-4">
            <button className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-primary/70" />
                <span className="text-sm font-medium">Dark Mode</span>
              </div>
              <div className="w-9 h-5 bg-primary/20 rounded-full relative">
                <div className="absolute w-4 h-4 bg-primary rounded-full top-0.5 right-0.5" />
              </div>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Notifications</h3>
          <div className="bg-secondary/10 rounded-xl p-4 space-y-4">
            <button className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary/70" />
                <span className="text-sm font-medium">Push Notifications</span>
              </div>
              <div className="w-9 h-5 bg-primary/20 rounded-full relative">
                <div className="absolute w-4 h-4 bg-primary rounded-full top-0.5 left-0.5" />
              </div>
            </button>
          </div>
        </div>

        {/* Privacy */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Privacy</h3>
          <div className="bg-secondary/10 rounded-xl p-4 space-y-4">
            <button className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary/70" />
                <div className="text-left">
                  <span className="text-sm font-medium block">Chat History</span>
                  <span className="text-xs text-muted-foreground">Clear all chat history</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Help & Support */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Help & Support</h3>
          <div className="bg-secondary/10 rounded-xl p-4 space-y-4">
            <button className="w-full flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-primary/70" />
              <span className="text-sm font-medium">FAQ</span>
            </button>
            <button className="w-full flex items-center gap-3">
              <Info className="w-5 h-5 text-primary/70" />
              <span className="text-sm font-medium">About</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 