import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { setCookie } from '../lib/cookies';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email or phone');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.login({
        email: email.trim(),
        password: password,
      });

      if (response.accessToken && response.user) {
        console.log('Login successful:', response);
        
        // Store in cookies
        setCookie('accessToken', response.accessToken, 7);
        setCookie('userEmail', response.user.email, 7);
        setCookie('userName', response.user.name || email.split('@')[0], 7);
        setCookie('bankName', response.user.bankName, 7);
        setCookie('accountNumber', response.user.acctNo, 7);
        setCookie('balance', response.user.balance, 7);
        
        navigate('/dashboard');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.message?.toLowerCase().includes('invalid email') || 
          err.message?.toLowerCase().includes('invalid password')) {
        setError('Invalid email or password');
      } else if (err.message?.includes('timed out')) {
        setError('Connection timeout. Please try again.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container bg-background min-h-screen flex flex-col">
      <div className="px-5 pt-14 pb-4">
        <button 
          onClick={() => navigate('/')} 
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          disabled={loading}
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
      </div>

      <div className="px-6 flex-1">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Welcome back</h1>
          <p className="text-muted-foreground text-sm mb-8">Sign in to your merchant account</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl"
          >
            {error}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleLogin}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="space-y-5"
        >
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Email or Phone <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="merchant@example.com"
              className="w-full px-4 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all disabled:opacity-50"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Password <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all pr-12 disabled:opacity-50"
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={() => navigate('/forgot-password')} 
              className="text-secondary text-sm font-medium hover:underline disabled:opacity-50"
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl gradient-secondary text-primary-foreground font-semibold text-base shadow-lg shadow-secondary/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/onboarding')} 
            className="text-secondary font-semibold hover:underline disabled:opacity-50"
            disabled={loading}
          >
            Register
          </button>
        </motion.p>
      </div>
    </div>
  );
};

export default LoginScreen;