import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { ArrowLeft, Search, CheckCircle, ChevronDown, Loader2, ArrowRight } from 'lucide-react';

const NIGERIAN_BANKS = [
  { name: 'Sterling Bank', code: '232' },
  { name: 'GTBank', code: '058' },
  { name: 'First Bank', code: '011' },
  { name: 'Access Bank', code: '044' },
  { name: 'UBA', code: '033' },
  { name: 'Zenith Bank', code: '057' },
  { name: 'Wema Bank', code: '035' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'Union Bank', code: '032' },
  { name: 'Stanbic IBTC', code: '221' },
  { name: 'Polaris Bank', code: '076' },
  { name: 'Keystone Bank', code: '082' },
  { name: 'FCMB', code: '214' },
  { name: 'Ecobank', code: '050' },
  { name: 'Heritage Bank', code: '030' },
  { name: 'Providus Bank', code: '101' },
  { name: 'Kuda Bank', code: '090267' },
  { name: 'OPay', code: '100004' },
  { name: 'PalmPay', code: '100033' },
  { name: 'Moniepoint', code: '100022' },
];

type PayoutStep = 'form' | 'confirm' | 'pin' | 'success';

const PayoutScreen: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<PayoutStep>('form');
  const [activeTab, setActiveTab] = useState('payout');
  const [selectedBank, setSelectedBank] = useState<typeof NIGERIAN_BANKS[0] | null>(null);
  const [showBankList, setShowBankList] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [nameEnquiry, setNameEnquiry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState('');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') navigate('/dashboard');
    if (tab === 'services') navigate('/services');
    if (tab === 'profile') navigate('/profile');
  };

  const handleAccountBlur = () => {
    if (accountNumber.length === 10 && selectedBank) {
      setLoading(true);
      setTimeout(() => {
        setNameEnquiry('CHUKWUEMEKA ADEBAYO JOHNSON');
        setLoading(false);
      }, 1500);
    }
  };

  const filteredBanks = NIGERIAN_BANKS.filter(b => b.name.toLowerCase().includes(bankSearch.toLowerCase()));

  const handleConfirmTransfer = () => {
    setStep('pin');
  };

  const handlePinSubmit = () => {
    setStep('success');
  };

  if (step === 'success') {
    return (
      <MobileLayout showNav activeTab="payout" onTabChange={handleTabChange}>
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full">
            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-success" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-1">Transfer Successful!</h2>
            <p className="text-muted-foreground text-sm mb-6">Your transfer has been processed</p>

            <div className="bg-card border border-border rounded-2xl p-5 text-left space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Amount</span>
                <span className="text-sm font-bold text-foreground">₦{Number(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Recipient</span>
                <span className="text-sm font-medium text-foreground">{nameEnquiry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Bank</span>
                <span className="text-sm text-foreground">{selectedBank?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Account</span>
                <span className="text-sm text-foreground">{accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Reference</span>
                <span className="text-sm text-foreground font-mono">TXN{Date.now().toString().slice(-8)}</span>
              </div>
            </div>

            <button
              onClick={() => { setStep('form'); setAccountNumber(''); setAmount(''); setNameEnquiry(null); setSelectedBank(null); setPin(''); }}
              className="w-full py-4 rounded-xl gradient-secondary text-primary-foreground font-semibold text-base shadow-lg shadow-secondary/20 active:scale-[0.98] transition-transform mb-3"
            >
              New Transfer
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 text-secondary font-semibold text-sm"
            >
              Back to Dashboard
            </button>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  if (step === 'pin') {
    return (
      <MobileLayout showNav activeTab="payout" onTabChange={handleTabChange}>
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center w-full">
            <h2 className="text-xl font-heading font-bold text-foreground mb-2">Enter Transaction PIN</h2>
            <p className="text-muted-foreground text-sm mb-8">Enter your 4-digit PIN to confirm</p>

            <div className="flex justify-center gap-4 mb-8">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-bold ${
                    pin.length > idx ? 'border-secondary bg-secondary/5 text-foreground' : 'border-border bg-muted'
                  }`}
                >
                  {pin.length > idx ? '•' : ''}
                </div>
              ))}
            </div>

            {/* Number pad */}
            <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((num, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (num === 'del') setPin(pin.slice(0, -1));
                    else if (num !== null && pin.length < 4) {
                      const newPin = pin + num;
                      setPin(newPin);
                      if (newPin.length === 4) setTimeout(handlePinSubmit, 300);
                    }
                  }}
                  className={`h-14 rounded-xl font-heading text-lg font-semibold transition-colors ${
                    num === null ? 'invisible' : 'bg-muted hover:bg-muted/80 text-foreground active:scale-95'
                  }`}
                >
                  {num === 'del' ? '⌫' : num}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  if (step === 'confirm') {
    return (
      <MobileLayout showNav activeTab="payout" onTabChange={handleTabChange}>
        <div className="px-5 pt-14 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setStep('form')} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <ArrowLeft size={20} className="text-foreground" />
            </button>
            <h1 className="text-xl font-heading font-bold text-foreground">Confirm Transfer</h1>
          </div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4 mb-6">
              <div className="text-center pb-4 border-b border-border">
                <p className="text-xs text-muted-foreground mb-1">You're sending</p>
                <p className="text-3xl font-heading font-bold text-foreground">₦{Number(amount).toLocaleString()}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">To</span>
                  <span className="text-sm font-semibold text-foreground">{nameEnquiry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Bank</span>
                  <span className="text-sm text-foreground">{selectedBank?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Account Number</span>
                  <span className="text-sm text-foreground font-mono">{accountNumber}</span>
                </div>
                {narration && (
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Narration</span>
                    <span className="text-sm text-foreground">{narration}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Fee</span>
                  <span className="text-sm text-foreground">₦10.00</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmTransfer}
              className="w-full py-4 rounded-xl gradient-secondary text-primary-foreground font-semibold text-base shadow-lg shadow-secondary/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              Confirm & Pay
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showNav activeTab="payout" onTabChange={handleTabChange}>
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/dashboard')} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <h1 className="text-xl font-heading font-bold text-foreground">Send Money</h1>
        </div>

        {/* Wallet balance */}
        <div className="gradient-primary rounded-xl p-4 mb-6">
          <p className="text-primary-foreground/60 text-xs">Available Balance</p>
          <p className="text-2xl font-heading font-bold text-primary-foreground">₦0.00</p>
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-4">
          {/* Bank Selection */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Select Bank</label>
            <button
              onClick={() => setShowBankList(true)}
              className="w-full px-4 py-3.5 rounded-xl bg-muted border border-border text-sm text-left flex items-center justify-between focus:outline-none"
            >
              <span className={selectedBank ? 'text-foreground' : 'text-muted-foreground/50'}>
                {selectedBank ? selectedBank.name : 'Choose a bank...'}
              </span>
              <ChevronDown size={18} className="text-muted-foreground" />
            </button>
          </div>

          {/* Account Number */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Account Number</label>
            <input
              type="text"
              maxLength={10}
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value.replace(/\D/g, ''));
                setNameEnquiry(null);
              }}
              onBlur={handleAccountBlur}
              placeholder="0123456789"
              className="w-full px-4 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all font-mono"
            />
          </div>

          {/* Name Enquiry */}
          {loading && (
            <div className="flex items-center gap-2 px-3 py-2">
              <Loader2 size={16} className="text-secondary animate-spin" />
              <span className="text-xs text-muted-foreground">Verifying account...</span>
            </div>
          )}
          {nameEnquiry && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-success/10 rounded-xl p-3 flex items-center gap-2"
            >
              <CheckCircle size={16} className="text-success shrink-0" />
              <p className="text-sm text-foreground font-semibold">{nameEnquiry}</p>
            </motion.div>
          )}

          {/* Amount */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Amount (₦)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter amount"
              className="w-full px-4 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            />
            {/* Quick amounts */}
            <div className="flex gap-2 mt-2">
              {['5,000', '10,000', '50,000', '100,000'].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.replace(/,/g, ''))}
                  className="px-3 py-1.5 rounded-lg bg-muted border border-border text-[11px] font-medium text-foreground hover:border-secondary/40 transition-colors"
                >
                  ₦{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Narration */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Narration (Optional)</label>
            <input
              type="text"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              placeholder="What's this for?"
              className="w-full px-4 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            />
          </div>

          <button
            onClick={() => nameEnquiry && amount && setStep('confirm')}
            disabled={!nameEnquiry || !amount}
            className="w-full py-4 rounded-xl gradient-secondary text-primary-foreground font-semibold text-base shadow-lg shadow-secondary/20 active:scale-[0.98] transition-transform disabled:opacity-40 disabled:active:scale-100 mt-2"
          >
            Continue
          </button>
        </motion.div>
      </div>

      {/* Bank Selection Modal */}
      <AnimatePresence>
        {showBankList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 z-50 flex items-end justify-center"
            onClick={() => setShowBankList(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[430px] bg-card rounded-t-3xl p-5 max-h-[70vh] flex flex-col"
            >
              <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4" />
              <h3 className="font-heading font-bold text-foreground mb-3">Select Bank</h3>
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  placeholder="Search banks..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="overflow-y-auto flex-1 space-y-1">
                {filteredBanks.map((bank) => (
                  <button
                    key={bank.code}
                    onClick={() => { setSelectedBank(bank); setShowBankList(false); setBankSearch(''); setNameEnquiry(null); }}
                    className={`w-full px-3 py-3 rounded-xl text-left text-sm transition-colors flex items-center justify-between ${
                      selectedBank?.code === bank.code ? 'bg-secondary/10 text-secondary font-medium' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{bank.name}</span>
                    {selectedBank?.code === bank.code && <CheckCircle size={16} className="text-secondary" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileLayout>
  );
};

export default PayoutScreen;
