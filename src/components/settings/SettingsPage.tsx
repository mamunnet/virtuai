import { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Lock, HelpCircle, Info, User, Camera, Loader2 } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { updateProfile } from 'firebase/auth';

export function SettingsPage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  // Update local state when auth state changes
  useEffect(() => {
    if (auth.currentUser) {
      setDisplayName(auth.currentUser.displayName || '');
    }
  }, [auth.currentUser]);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;
    setIsUpdating(true);
    setError('');

    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim()
      });
      
      // Force refresh the user data
      await auth.currentUser.reload();
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your app preferences and account settings.</p>
      </div>

      <div className="space-y-4">
        {/* Profile Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Profile</h3>
          <div className="bg-secondary/10 rounded-xl p-4 space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}
            
            <div className="flex items-center gap-4">
              {auth.currentUser?.photoURL ? (
                <img 
                  src={auth.currentUser.photoURL} 
                  alt={auth.currentUser.displayName || 'Profile'} 
                  className="w-16 h-16 rounded-full border border-border/40"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-border/40 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary/70" />
                </div>
              )}
              <div className="flex-1">
                {isEditingProfile ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary/10 border border-border/40 
                        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                      placeholder="Enter your name"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateProfile}
                        disabled={isUpdating || !displayName.trim()}
                        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium
                          hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                      >
                        {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingProfile(false);
                          setDisplayName(auth.currentUser?.displayName || '');
                          setError('');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-secondary/20 text-sm font-medium
                          hover:bg-secondary/30 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="font-medium">
                      {auth.currentUser?.displayName || 'No name set'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {auth.currentUser?.email}
                    </div>
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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