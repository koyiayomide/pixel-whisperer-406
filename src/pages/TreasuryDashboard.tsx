import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Globe, Building2, TrendingUp, TrendingDown, Clock, Eye } from 'lucide-react';

const TreasuryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const lastSync = '14 Feb 2026, 09:00 AM WAT';

  const globalPosition = {
    totalUSD: 12_450_000,
    onshoreNGN: 4_850_000_000,
    offshoreUSD: 9_200_000,
    offshoreGBP: 1_850_000,
    offshoreEUR: 920_000,
  };

  const accounts = [
    { bank: 'Sterling Bank', currency: 'NGN', balance: 2_450_000_000, type: 'onshore', trend: 'up', change: '+3.2%' },
    { bank: 'Access Bank', currency: 'NGN', balance: 1_200_000_000, type: 'onshore', trend: 'up', change: '+1.8%' },
    { bank: 'Zenith Bank', currency: 'NGN', balance: 1_200_000_000, type: 'onshore', trend: 'down', change: '-0.5%' },
    { bank: 'Barclays UK', currency: 'GBP', balance: 1_850_000, type: 'offshore', trend: 'up', change: '+2.1%' },
    { bank: 'Chase US', currency: 'USD', balance: 5_400_000, type: 'offshore', trend: 'up', change: '+4.5%' },
    { bank: 'Citi US', currency: 'USD', balance: 3_800_000, type: 'offshore', trend: 'down', change: '-1.2%' },
    { bank: 'Deutsche Bank', currency: 'EUR', balance: 920_000, type: 'offshore', trend: 'up', change: '+0.8%' },
  ];

  const currencyBreakdown = [
    { currency: 'NGN', label: 'Nigerian Naira', amount: '₦4.85B', pct: 38, color: 'bg-secondary' },
    { currency: 'USD', label: 'US Dollar', amount: '$9.2M', pct: 35, color: 'bg-accent' },
    { currency: 'GBP', label: 'British Pound', amount: '£1.85M', pct: 18, color: 'bg-primary' },
    { currency: 'EUR', label: 'Euro', amount: '€920K', pct: 9, color: 'bg-success' },
  ];

  const recentMovements = [
    { from: 'Chase US', to: 'Sterling Bank', amount: '$500,000', time: '2hr ago', type: 'inflow' },
    { from: 'Sterling Bank', to: 'Barclays UK', amount: '₦180M', time: '4hr ago', type: 'outflow' },
    { from: 'Citi US', to: 'Access Bank', amount: '$250,000', time: '6hr ago', type: 'inflow' },
  ];

  const fmt = (n: number, prefix: string) =>
    `${prefix}${n >= 1_000_000_000 ? (n / 1_000_000_000).toFixed(2) + 'B' : n >= 1_000_000 ? (n / 1_000_000).toFixed(2) + 'M' : n.toLocaleString()}`;

  const handleTabChange = (tab: string) => {
    if (tab === 'home') navigate('/dashboard');
    if (tab === 'services') navigate('/services');
    if (tab === 'payout') navigate('/payout');
    if (tab === 'profile') navigate('/profile');
  };

  return (
    <MobileLayout showNav activeTab="home" onTabChange={handleTabChange}>
      {/* Header */}
      <div className="gradient-primary px-5 pt-14 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground/60 text-xs">Global Treasury</p>
            <h1 className="text-primary-foreground font-heading font-bold text-lg">Position Overview</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/20">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[9px] text-success font-medium">LIVE</span>
            </div>
            <button className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center">
              <RefreshCw size={14} className="text-primary-foreground" />
            </button>
          </div>
        </div>

        {/* Total Position Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-5"
        >
          <p className="text-primary-foreground/60 text-[10px] uppercase tracking-wider mb-1">Total Position (USD Equivalent)</p>
          <p className="text-3xl font-heading font-bold text-primary-foreground">
            ${globalPosition.totalUSD.toLocaleString()}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Building2 size={12} className="text-secondary" />
              <span className="text-[10px] text-primary-foreground/70">Onshore: {fmt(globalPosition.onshoreNGN, '₦')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe size={12} className="text-accent" />
              <span className="text-[10px] text-primary-foreground/70">Offshore: ${globalPosition.offshoreUSD.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Clock size={10} className="text-primary-foreground/40" />
            <span className="text-[9px] text-primary-foreground/40">Last synced: {lastSync}</span>
          </div>
        </motion.div>
      </div>

      <div className="px-5 -mt-3 relative z-10">
        {/* FX Exposure Breakdown */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-4 shadow-sm border border-border mb-4"
        >
          <h3 className="font-heading font-semibold text-foreground text-sm mb-3">Currency Exposure</h3>
          <div className="flex h-3 rounded-full overflow-hidden mb-3">
            {currencyBreakdown.map((c) => (
              <div key={c.currency} className={`${c.color} h-full`} style={{ width: `${c.pct}%` }} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {currencyBreakdown.map((c) => (
              <div key={c.currency} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
                <div>
                  <p className="text-[11px] font-medium text-foreground">{c.currency} · {c.amount}</p>
                  <p className="text-[9px] text-muted-foreground">{c.pct}% of total</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Account Positions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-foreground text-sm">Account Positions</h3>
            <div className="flex gap-1">
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium">Onshore</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">Offshore</span>
            </div>
          </div>
          <div className="space-y-2">
            {accounts.map((acc, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  acc.type === 'onshore' ? 'bg-secondary/10' : 'bg-accent/10'
                }`}>
                  {acc.type === 'onshore'
                    ? <Building2 size={16} className="text-secondary" />
                    : <Globe size={16} className="text-accent" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{acc.bank}</p>
                  <p className="text-[10px] text-muted-foreground">{acc.currency} · {acc.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-foreground">
                    {acc.currency === 'NGN' ? fmt(acc.balance, '₦') :
                     acc.currency === 'GBP' ? fmt(acc.balance, '£') :
                     acc.currency === 'EUR' ? fmt(acc.balance, '€') :
                     fmt(acc.balance, '$')}
                  </p>
                  <div className="flex items-center justify-end gap-0.5">
                    {acc.trend === 'up'
                      ? <TrendingUp size={10} className="text-success" />
                      : <TrendingDown size={10} className="text-destructive" />
                    }
                    <span className={`text-[9px] font-medium ${acc.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                      {acc.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Cross-Border Movements */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="font-heading font-semibold text-foreground text-sm mb-3">Recent Movements</h3>
          <div className="space-y-2">
            {recentMovements.map((mv, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  mv.type === 'inflow' ? 'bg-success/10' : 'bg-destructive/10'
                }`}>
                  {mv.type === 'inflow'
                    ? <ArrowDownLeft size={16} className="text-success" />
                    : <ArrowUpRight size={16} className="text-destructive" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{mv.from} → {mv.to}</p>
                  <p className="text-[10px] text-muted-foreground">{mv.time}</p>
                </div>
                <p className={`text-xs font-semibold ${mv.type === 'inflow' ? 'text-success' : 'text-destructive'}`}>
                  {mv.amount}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default TreasuryDashboard;
