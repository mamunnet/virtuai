import { useState } from 'react';
import { auth } from '../../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { Brain, Mail, Lock, LogIn, UserPlus, Chrome, User } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Create the user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update the profile with display name
        try {
          await updateProfile(userCredential.user, {
            displayName: fullName.trim()
          });
          
          // Force refresh the token to ensure the new profile data is available
          await userCredential.user.reload();
        } catch (profileError) {
          console.error('Error updating profile:', profileError);
          setError('Account created but failed to set display name. Please update it in settings.');
          return;
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Brain className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Welcome to JellyAI</h2>
          <p className="mt-2 text-muted-foreground">
            {isLogin ? 'Sign in to continue' : 'Create your account'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/10 border border-border/40 
                    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                    pl-11"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
                <User className="w-5 h-5 text-muted-foreground absolute left-4 top-3.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary/10 border border-border/40 
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                  pl-11"
                placeholder="Enter your email"
                required
              />
              <Mail className="w-5 h-5 text-muted-foreground absolute left-4 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary/10 border border-border/40 
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                  pl-11"
                placeholder="Enter your password"
                required
              />
              <Lock className="w-5 h-5 text-muted-foreground absolute left-4 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2
              hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                {isLogin ? 'Sign In' : 'Sign Up'}
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/40"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Google Auth */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-secondary/10 border border-border/40 flex items-center justify-center gap-2
            hover:bg-secondary/20 transition-all disabled:opacity-50"
        >
          <Chrome className="w-5 h-5" />
          Continue with Google
        </button>

        {/* Toggle Login/Signup */}
        <p className="text-center text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-medium"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
} 