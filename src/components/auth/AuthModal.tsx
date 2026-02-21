'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { X, Mail, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRandomDialogue } from '@/config/chibisama-dialogues';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'select' | 'guest' | 'signup' | 'login' | 'email';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('select');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleGuest = () => {
    // Trigger Chibi-sama dialogue
    const dialogue = getRandomDialogue('auth', 'guest');
    if (dialogue) {
      window.dispatchEvent(
        new CustomEvent('chibisama:speak', {
          detail: { category: 'auth', subcategory: 'guest' },
        })
      );
    }
    onClose();
  };

  const handleOAuthSignIn = async (provider: 'discord' | 'google') => {
    setIsLoading(true);

    // Trigger Chibi-sama dialogue
    const dialogue = getRandomDialogue('auth', mode === 'signup' ? 'signup' : 'login');
    if (dialogue) {
      window.dispatchEvent(
        new CustomEvent('chibisama:speak', {
          detail: {
            category: 'auth',
            subcategory: mode === 'signup' ? 'signup' : 'login',
          },
        })
      );
    }

    await signIn(provider, { callbackUrl: '/' });
    setIsLoading(false);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await signIn('email', { email, callbackUrl: '/' });
    setEmailSent(true);
    setIsLoading(false);
  };

  const reset = () => {
    setMode('select');
    setEmail('');
    setEmailSent(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-strong rounded-2xl p-8 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <AnimatePresence mode="wait">
              {/* Select Mode */}
              {mode === 'select' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">
                    Choose Your Path
                  </h2>
                  <p className="text-slate-400 mb-8">
                    The realm needs to know how to remember you
                  </p>

                  <div className="space-y-4">
                    {/* Guest Option */}
                    <button
                      onClick={handleGuest}
                      className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-violet-500/50 hover:bg-slate-800 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center group-hover:bg-violet-600/20 transition-colors">
                          <User className="w-6 h-6 text-slate-400 group-hover:text-violet-400" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-white">
                            Continue as Guest
                          </h3>
                          <p className="text-sm text-slate-500">
                            Temporary session, no account needed
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Sign Up Option */}
                    <button
                      onClick={() => setMode('signup')}
                      className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-violet-500/50 hover:bg-slate-800 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-violet-600/20 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-violet-400" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-white">
                            Bind Your Soul
                          </h3>
                          <p className="text-sm text-slate-500">
                            Create an account, make votes permanent
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Login Option */}
                    <button
                      onClick={() => setMode('login')}
                      className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-violet-500/50 hover:bg-slate-800 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center group-hover:bg-violet-600/20 transition-colors">
                          <Mail className="w-6 h-6 text-slate-400 group-hover:text-violet-400" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-white">
                            Returning Soul
                          </h3>
                          <p className="text-sm text-slate-500">
                            Log in to see your previous bonds
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Sign Up / Login Mode */}
              {(mode === 'signup' || mode === 'login') && (
                <motion.div
                  key="oauth"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <button
                    onClick={() => setMode('select')}
                    className="text-sm text-slate-500 hover:text-white mb-6"
                  >
                    ← Back
                  </button>

                  <h2 className="text-2xl font-bold text-white mb-2">
                    {mode === 'signup' ? 'Bind Your Soul' : 'Welcome Back'}
                  </h2>
                  <p className="text-slate-400 mb-8">
                    {mode === 'signup'
                      ? 'Choose how you want to connect'
                      : 'Sign in to continue your journey'}
                  </p>

                  <div className="space-y-4">
                    {/* Discord */}
                    <button
                      onClick={() => handleOAuthSignIn('discord')}
                      disabled={isLoading}
                      className="w-full p-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] transition-colors flex items-center justify-center gap-3"
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                      <span className="font-medium text-white">
                        Continue with Discord
                      </span>
                    </button>

                    {/* Google */}
                    <button
                      onClick={() => handleOAuthSignIn('google')}
                      disabled={isLoading}
                      className="w-full p-4 rounded-xl bg-white hover:bg-gray-100 transition-colors flex items-center justify-center gap-3"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="font-medium text-gray-800">
                        Continue with Google
                      </span>
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-700" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-4 bg-slate-900 text-slate-500 text-sm">
                          or
                        </span>
                      </div>
                    </div>

                    {/* Email */}
                    <button
                      onClick={() => setMode('email')}
                      className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-violet-500/50 transition-colors flex items-center justify-center gap-3"
                    >
                      <Mail className="w-6 h-6 text-slate-400" />
                      <span className="font-medium text-white">
                        Continue with Email
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Email Mode */}
              {mode === 'email' && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <button
                    onClick={() =>
                      setMode(mode === 'signup' ? 'signup' : 'login')
                    }
                    className="text-sm text-slate-500 hover:text-white mb-6"
                  >
                    ← Back
                  </button>

                  {!emailSent ? (
                    <>
                      <h2 className="text-2xl font-bold text-white mb-2 text-center">
                        Magic Link
                      </h2>
                      <p className="text-slate-400 mb-8 text-center">
                        We&apos;ll send you a magic link to sign in instantly
                      </p>

                      <form onSubmit={handleEmailSignIn} className="space-y-4">
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">
                            Email address
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading || !email}
                          className={cn(
                            'w-full py-3 rounded-xl font-medium transition-colors',
                            isLoading || !email
                              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                              : 'bg-violet-600 text-white hover:bg-violet-700'
                          )}
                        >
                          {isLoading ? 'Sending...' : 'Send Magic Link'}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-green-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Check Your Email
                      </h2>
                      <p className="text-slate-400">
                        We&apos;ve sent a magic link to{' '}
                        <span className="text-violet-400">{email}</span>
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
