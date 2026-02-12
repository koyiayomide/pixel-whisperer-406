import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

const ForgotPasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mobile-container bg-background min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-success" />
          </div>
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">Check your email</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-[260px] mx-auto">
            We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 rounded-xl gradient-secondary text-primary-foreground font-semibold text-base shadow-lg shadow-secondary/20 active:scale-[0.98] transition-transform"
          >
            Back to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mobile-container bg-background min-h-screen flex flex-col">
      <div className="px-5 pt-14 pb-4">
        <button onClick={() => navigate('/login')} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
      </div>

      <div className="px-6 flex-1">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
            <Mail size={28} className="text-secondary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Forgot password?</h1>
          <p className="text-muted-foreground text-sm mb-8">Enter your registered email to receive a reset link</p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          <div className="mb-6">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="merchant@example.com"
              className="w-full px-4 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 rounded-xl gradient-secondary text-primary-foreground font-semibold text-base shadow-lg shadow-secondary/20 active:scale-[0.98] transition-transform"
          >
            Send Reset Link
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
