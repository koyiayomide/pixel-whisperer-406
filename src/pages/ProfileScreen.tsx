import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { User, ChevronRight, Shield, Bell, HelpCircle, LogOut, Settings, CreditCard, FileText } from 'lucide-react';
import { getCookie, deleteAllCookies } from '@/lib/cookies';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '',
    name: '',
    bankName: '',
    accountNumber: '',
    businessName: '' 
  });

  useEffect(() => {
    setUserData({
      email: getCookie('userEmail') || 'merchant@example.com',
      name: getCookie('userName') || 'Merchant User',
      bankName: getCookie('bankName') || 'Sterling Bank',
      accountNumber: getCookie('accountNumber') || '9710123456',
      businessName: ''
    });
  }, []);

  const handleTabChange = (tab: string) => {
    if (tab === 'home') navigate('/dashboard');
    if (tab === 'services') navigate('/services');
    if (tab === 'payout') navigate('/payout');
  };

  const handleLogout = () => {
    // Delete all cookies
    deleteAllCookies();
    // Navigate to login
    navigate('/login');
  };

  const menuItems = [
    { icon: User, label: 'Personal Information', desc: 'Name, email, phone' },
    { icon: CreditCard, label: 'Settlement Account', desc: 'Manage bank details' },
    { icon: FileText, label: 'KYC Documents', desc: 'View uploaded documents' },
    { icon: Shield, label: 'Security', desc: 'PIN, password, biometrics' },
    { icon: Bell, label: 'Notifications', desc: 'Manage alerts' },
    { icon: Settings, label: 'App Settings', desc: 'Preferences' },
    { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs, contact us' },
  ];

  const getInitials = () => {
    const name = userData.name || userData.email;
    if (name.includes('@')) {
      return name.substring(0, 2).toUpperCase();
    }
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <MobileLayout showNav activeTab="profile" onTabChange={handleTabChange}>
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-xl font-heading font-bold text-foreground mb-6">Profile</h1>

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full gradient-secondary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">{getInitials()}</span>
          </div>
          <div className="flex-1">
            <p className="font-heading font-bold text-foreground">{userData.email}</p>
            <p className="text-xs text-muted-foreground">{userData.businessName}</p>
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
              Verified Merchant
            </span>
          </div>
        </div>

        {/* Merchant ID */}
        <div className="bg-muted rounded-xl p-3 mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground">Merchant ID</p>
            <p className="text-sm font-mono font-medium text-foreground">MCH-2024-00145</p>
          </div>
          <button className="text-xs text-secondary font-medium">Copy</button>
        </div>

        {/* Menu */}
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <item.icon size={18} className="text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 mt-4 rounded-xl text-destructive hover:bg-destructive/5 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </MobileLayout>
  );
};

export default ProfileScreen;