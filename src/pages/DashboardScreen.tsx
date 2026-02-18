import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { Eye, EyeOff, Bell, Plus, ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';
import { getCookie } from '@/lib/cookies';
import POS from '@/components/svgIcons/Pos';

const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [balanceVisible, setBalanceVisible] = useState(true);
  
  // Get user data from cookies
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    bankName: '',
    accountNumber: '',
    balance: ''
  });

  useEffect(() => {
    // Load user data from cookies
    setUserData({
      name: getCookie('userName') || 'Merchant',
      email: getCookie('userEmail') || 'merchant@example.com',
      bankName: getCookie('bankName') || 'Sterling Bank',
      accountNumber: getCookie('accountNumber') || '9710123456',
      balance: getCookie('balance') || '0.00'
    });
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'services') navigate('/services');
    if (tab === 'payout') navigate('/payout');
    if (tab === 'profile') navigate('/profile');
  };

  const quickActions = [
    { icon: ArrowUpRight, label: 'Send Money', color: 'bg-secondary/10 text-secondary', route: '/payout' },
     { icon: POS, label: 'SoftPos', color: 'bg-sidebar-ring/10 text-primary', route: '#' },
    // { icon: Plus, label: 'Add Service', color: 'bg-accent/10 text-accent', route: '/services' },
    { icon: ArrowDownLeft, label: 'Receive', color: 'bg-success/10 text-success', route: '#' },
    { icon: TrendingUp, label: 'Analytics', color: 'bg-primary/10 text-primary', route: '#' },
  ];

  const transactions = [
    { type: 'credit', label: 'POS Payment', amount: '+₦45,000', time: '10:32 AM', icon: ArrowDownLeft },
    { type: 'debit', label: 'Transfer to GTBank', amount: '-₦120,000', time: '09:15 AM', icon: ArrowUpRight },
    { type: 'credit', label: 'Insurance Commission', amount: '+₦2,500', time: 'Yesterday', icon: ArrowDownLeft },
    { type: 'credit', label: 'QR Payment', amount: '+₦8,750', time: 'Yesterday', icon: ArrowDownLeft },
    { type: 'debit', label: 'Airtime Purchase', amount: '-₦5,000', time: '2 days ago', icon: ArrowUpRight },
  ];

  // Get initials for avatar
  const getInitials = () => {
    const name = userData.name || userData.email;
    if (name.includes('@')) {
      return name.substring(0, 2).toUpperCase();
    }
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Format balance with commas
  const formatBalance = (balance: string) => {
    const num = parseFloat(balance) || 0.00;
    return '₦' + num.toLocaleString('en-NG');
  };

  return (
    <MobileLayout showNav activeTab="home" onTabChange={handleTabChange}>
      {/* Header */}
      <div className="gradient-primary px-5 pt-14 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-secondary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">{getInitials()}</span>
            </div>
            <div>
              <p className="text-primary-foreground/60 text-xs">Good morning</p>
              <p className="text-primary-foreground font-semibold text-sm">
                {userData.name || userData.email.split('@')[0]}
              </p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center relative">
            <Bell size={18} className="text-primary-foreground" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
          </button>
        </div>

        {/* Wallet Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-primary-foreground/60 text-xs">Wallet Balance</p>
            <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-primary-foreground/60">
              {balanceVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          <p className="text-3xl font-heading font-bold text-primary-foreground mb-1">
            {balanceVisible ? formatBalance(userData.balance) : '₦•••••••'}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/20 text-success font-medium">
              {userData.bankName} • {userData.accountNumber}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="px-5 -mt-4 relative z-10">
        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-4 shadow-sm border border-border mb-5"
        >
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className="flex flex-col items-center gap-1.5"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                  <action.icon size={20} />
                </div>
                <span className="text-[10px] font-medium text-foreground">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Services Preview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-foreground">Merchant Services</h3>
            <button onClick={() => navigate('/services')} className="text-xs text-secondary font-medium">See All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { emoji: '🛡️', name: 'Insurance', desc: 'Retail coverage' },
              { emoji: '📱', name: 'Airtime', desc: 'Top-up & data' },
              { emoji: '🏢', name: 'CAC Reg', desc: 'Business reg.' },
              { emoji: '💰', name: 'Loans', desc: 'Working capital' },
              { emoji: '🌐', name: 'Internet', desc: 'Broadband' },
            ].map((service) => (
              <button
                key={service.name}
                onClick={() => navigate('/services')}
                className="shrink-0 w-[100px] bg-card border border-border rounded-xl p-3 text-left hover:border-secondary/30 transition-colors"
              >
                <span className="text-2xl">{service.emoji}</span>
                <p className="text-xs font-medium text-foreground mt-1.5">{service.name}</p>
                <p className="text-[10px] text-muted-foreground">{service.desc}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-foreground">Recent Transactions</h3>
            <button className="text-xs text-secondary font-medium">View All</button>
          </div>
          <div className="space-y-2">
            {transactions.map((tx, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  tx.type === 'credit' ? 'bg-success/10' : 'bg-destructive/10'
                }`}>
                  <tx.icon size={16} className={tx.type === 'credit' ? 'text-success' : 'text-destructive'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{tx.label}</p>
                  <p className="text-[10px] text-muted-foreground">{tx.time}</p>
                </div>
                <p className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-success' : 'text-destructive'}`}>
                  {tx.amount}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default DashboardScreen;