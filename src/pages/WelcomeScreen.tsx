import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container gradient-primary flex flex-col min-h-screen relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute top-[-80px] right-[-60px] w-[240px] h-[240px] rounded-full bg-secondary/10" />
      <div className="absolute bottom-[200px] left-[-100px] w-[300px] h-[300px] rounded-full bg-secondary/5" />
      <div className="absolute bottom-[-50px] right-[-30px] w-[160px] h-[160px] rounded-full bg-accent/10" />

      <div className="flex-1 flex flex-col items-center justify-center px-8 z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="w-20 h-20 rounded-2xl gradient-secondary flex items-center justify-center shadow-lg shadow-secondary/30">
            <span className="text-3xl font-heading font-bold text-primary-foreground">P1</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-3xl font-heading font-bold text-primary-foreground text-center mb-3"
        >
          PayOs One
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="text-primary-foreground/70 text-center text-sm leading-relaxed max-w-[280px]"
        >
          Digitize your business. Accept payments. Grow with merchant services across Nigeria.
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="px-6 pb-12 space-y-3 z-10"
      >
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 rounded-xl gradient-secondary text-primary font-semibold text-base shadow-lg shadow-secondary/20 active:scale-[0.98] transition-transform"
        >
          Sign In
        </button>
        <button
          onClick={() => navigate('/onboarding')}
          className="w-full py-4 rounded-xl border border-primary-foreground/20 text-primary-foreground font-semibold text-base active:scale-[0.98] transition-transform"
        >
          Create Merchant Account
        </button>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
