import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, User, Building2, FileText, Landmark, CheckCircle, Upload, Camera } from 'lucide-react';

const STEPS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'business', label: 'Business', icon: Building2 },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'settlement', label: 'Settlement', icon: Landmark },
];

const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (completed) {
    return (
      <div className="mobile-container gradient-primary min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-success" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-primary-foreground mb-2">Application Submitted!</h2>
          <p className="text-primary-foreground/70 text-sm mb-2 max-w-[280px] mx-auto">
            Your merchant account is being reviewed. We'll verify your documents and notify you within 24 hours.
          </p>
          <p className="text-primary-foreground/50 text-xs mb-8">A Sterling Bank wallet will be created upon approval.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 rounded-xl gradient-secondary text-primary-foreground font-semibold text-base shadow-lg shadow-secondary/20 active:scale-[0.98] transition-transform"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mobile-container bg-background min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-5 pt-14 pb-2 flex items-center gap-3">
        <button
          onClick={() => (currentStep === 0 ? navigate('/') : prevStep())}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Step {currentStep + 1} of {STEPS.length}</p>
          <h2 className="text-lg font-heading font-bold text-foreground">{STEPS[currentStep].label} Details</h2>
        </div>
      </div>

      {/* Step indicators */}
      <div className="px-6 py-3 flex gap-2">
        {STEPS.map((step, idx) => (
          <div
            key={step.id}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              idx <= currentStep ? 'bg-secondary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Form content */}
      <div className="flex-1 px-6 pt-2 pb-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {currentStep === 0 && <PersonalStep />}
            {currentStep === 1 && <BusinessStep />}
            {currentStep === 2 && <DocumentsStep />}
            {currentStep === 3 && <SettlementStep />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom button */}
      <div className="px-6 pb-8">
        <button
          onClick={nextStep}
          className="w-full py-4 rounded-xl gradient-secondary text-primary-foreground font-semibold text-base shadow-lg shadow-secondary/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          {currentStep === STEPS.length - 1 ? 'Submit Application' : 'Continue'}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

const InputField = ({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
    />
  </div>
);

const SelectField = ({ label, options }: { label: string; options: string[] }) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
    <select className="w-full px-4 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all appearance-none">
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const PersonalStep = () => (
  <div className="space-y-4">
    {/* Selfie */}
    <div className="flex justify-center mb-4">
      <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-secondary/40 flex flex-col items-center justify-center cursor-pointer">
        <Camera size={24} className="text-secondary mb-1" />
        <span className="text-[10px] text-muted-foreground">Selfie</span>
      </div>
    </div>
    <InputField label="Full Name" placeholder="Adebayo Ogunlesi" />
    <InputField label="Phone Number" placeholder="+234 800 000 0000" type="tel" />
    <InputField label="Email Address" placeholder="merchant@example.com" type="email" />
    <InputField label="BVN" placeholder="22345678901" />
    <InputField label="NIN (Optional)" placeholder="12345678901" />
    <InputField label="Residential Address" placeholder="12 Broad Street, Lagos" />
    <p className="text-[11px] text-muted-foreground/60 mt-2">An OTP will be sent to verify your phone number</p>
  </div>
);

const BusinessStep = () => (
  <div className="space-y-4">
    <InputField label="Business Name" placeholder="Adebayo Stores" />
    <SelectField label="Business Type" options={['Sole Proprietorship', 'Limited Liability', 'Partnership', 'Enterprise']} />
    <InputField label="CAC Registration Number" placeholder="RC 123456" />
    <SelectField label="Business Category" options={['Retail', 'Food & Beverages', 'Electronics', 'Fashion', 'Phone & Data', 'General Merchandise', 'Others']} />
    <InputField label="Business Address" placeholder="Shop 5, Balogun Market, Lagos" />
    <SelectField label="Estimated Monthly Turnover" options={['Below ₦100,000', '₦100,000 - ₦500,000', '₦500,000 - ₦1,000,000', '₦1,000,000 - ₦5,000,000', 'Above ₦5,000,000']} />
  </div>
);

const DocumentsStep = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground mb-2">Upload the following documents for verification</p>
    <UploadBox label="CAC Certificate" />
    <UploadBox label="Valid Government ID" description="NIN slip, Voter's card, Driver's license, or International Passport" />
    <UploadBox label="Utility Bill" description="Not older than 3 months" />
    <UploadBox label="Business/Location Photo" />
  </div>
);

const UploadBox = ({ label, description }: { label: string; description?: string }) => (
  <div className="border-2 border-dashed border-border rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-secondary/40 transition-colors">
    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
      <Upload size={18} className="text-secondary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground">{label}</p>
      {description && <p className="text-[11px] text-muted-foreground truncate">{description}</p>}
    </div>
    <span className="text-xs text-secondary font-medium shrink-0">Upload</span>
  </div>
);

const SettlementStep = () => {
  const banks = [
    { name: 'Sterling Bank', code: '232', logo: '🏦' },
    { name: 'GTBank', code: '058', logo: '🟧' },
    { name: 'First Bank', code: '011', logo: '🔵' },
    { name: 'Access Bank', code: '044', logo: '🟠' },
    { name: 'UBA', code: '033', logo: '🔴' },
    { name: 'Zenith Bank', code: '057', logo: '🔴' },
    { name: 'Wema Bank', code: '035', logo: '🟣' },
    { name: 'Fidelity Bank', code: '070', logo: '🟢' },
  ];

  const [selectedBank, setSelectedBank] = useState('');

  return (
    <div className="space-y-4">
      <div className="bg-accent/10 rounded-xl p-3 flex items-start gap-2.5 mb-2">
        <Landmark size={18} className="text-accent mt-0.5 shrink-0" />
        <p className="text-xs text-foreground/80">
          Your Sterling Bank business wallet will be created automatically. Choose a settlement bank for withdrawals.
        </p>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">Select Settlement Bank</label>
        <div className="grid grid-cols-2 gap-2">
          {banks.map((bank) => (
            <button
              key={bank.code}
              onClick={() => setSelectedBank(bank.code)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedBank === bank.code
                  ? 'border-secondary bg-secondary/5 ring-1 ring-secondary/30'
                  : 'border-border bg-card hover:border-secondary/30'
              }`}
            >
              <span className="text-lg">{bank.logo}</span>
              <p className="text-xs font-medium text-foreground mt-1">{bank.name}</p>
            </button>
          ))}
        </div>
      </div>

      <InputField label="Account Number" placeholder="0123456789" />
      
      {/* Name enquiry result */}
      <div className="bg-success/10 rounded-xl p-3 flex items-center gap-2">
        <CheckCircle size={16} className="text-success shrink-0" />
        <p className="text-sm text-foreground font-medium">ADEBAYO OGUNLESI STORES</p>
      </div>
    </div>
  );
};

export default OnboardingScreen;
