import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { ArrowLeft, Search, Shield, Phone, Building2, Wifi, CreditCard, Briefcase, ChevronRight } from 'lucide-react';

const services = [
  { id: 'insurance', icon: Shield, emoji: '🛡️', name: 'Retail Insurance', desc: 'Sell insurance policies to customers', commission: '₦500 - ₦5,000', color: 'bg-blue-500/10 text-blue-600' },
  { id: 'pension', icon: Briefcase, emoji: '👴', name: 'Retail Pension', desc: 'Register customers for pension', commission: '₦300 - ₦2,000', color: 'bg-purple-500/10 text-purple-600' },
  { id: 'airtime', icon: Phone, emoji: '📱', name: 'Airtime & Data', desc: 'Recharge airtime and data bundles', commission: '2% - 5%', color: 'bg-green-500/10 text-green-600' },
  { id: 'internet', icon: Wifi, emoji: '🌐', name: 'Broadband Internet', desc: 'Sell internet subscriptions', commission: '₦200 - ₦1,500', color: 'bg-cyan-500/10 text-cyan-600' },
  { id: 'cac', icon: Building2, emoji: '🏢', name: 'CAC Registration', desc: 'Business name & company reg.', commission: '₦1,000 - ₦10,000', color: 'bg-orange-500/10 text-orange-600' },
  { id: 'loans', icon: CreditCard, emoji: '💰', name: 'Working Capital', desc: 'Merchant loans & referrals', commission: '₦500 - ₦20,000', color: 'bg-amber-500/10 text-amber-600' },
];

const ServicesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') navigate('/dashboard');
    if (tab === 'payout') navigate('/payout');
    if (tab === 'profile') navigate('/profile');
  };

  const filtered = services.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <MobileLayout showNav activeTab="services" onTabChange={handleTabChange}>
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/dashboard')} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <h1 className="text-xl font-heading font-bold text-foreground">Merchant Services</h1>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/50"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card border border-border rounded-xl p-3">
            <p className="text-[10px] text-muted-foreground">Today's Commission</p>
            <p className="text-lg font-heading font-bold text-success">₦12,500</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3">
            <p className="text-[10px] text-muted-foreground">Services Sold</p>
            <p className="text-lg font-heading font-bold text-foreground">24</p>
          </div>
        </div>

        {/* Service List */}
        <div className="space-y-3">
          {filtered.map((service, idx) => (
            <motion.button
              key={service.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-3 text-left hover:border-secondary/30 transition-colors active:scale-[0.99]"
            >
              <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center text-xl`}>
                {service.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{service.name}</p>
                <p className="text-[11px] text-muted-foreground">{service.desc}</p>
                <p className="text-[10px] text-secondary font-medium mt-0.5">Commission: {service.commission}</p>
              </div>
              <ChevronRight size={18} className="text-muted-foreground shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default ServicesScreen;
