import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, User, Building2, FileText, CheckCircle, Upload, Camera, X, Loader2, Info } from 'lucide-react';
import { api } from '../lib/api';

const STEPS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'business', label: 'Business', icon: Building2 },
  { id: 'documents', label: 'Documents', icon: FileText },
];

const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Submitting...');
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    middleName: '',          // capital N to match backend
    mobileNumber: '',
    address: '',
    city: '',                // required by backend
    bvn: '',
    dob: '',
    pin: '',
    bName: '',
    bType: '',
    cacNo: '',
    BCategory: '',
    cacDoc: null as File | null,
    govtId: null as File | null,
    utilityBill: null as File | null,
    bizPhoto: null as File | null,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    setError(null);
    if (step === 0) {
      if (!formData.firstName || !formData.lastName || !formData.mobileNumber || !formData.email || !formData.password || !formData.bvn || !formData.address || !formData.city || !formData.dob || !formData.pin) {
        setError('Please fill in all required fields');
        return false;
      }
      if (formData.pin.length !== 4) {
        setError('PIN must be exactly 4 digits');
        return false;
      }
      if (formData.bvn.length !== 11) {
        setError('BVN must be exactly 11 digits');
        return false;
      }
      if (!formData.mobileNumber.startsWith('+')) {
        setError('Phone number must include country code (e.g. +2348000000000)');
        return false;
      }
    }
    if (step === 1) {
      if (!formData.bName || !formData.bType || !formData.cacNo || !formData.BCategory) {
        setError('Please fill in all business details');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.cacDoc || !formData.govtId || !formData.utilityBill || !formData.bizPhoto) {
        setError('Please upload all required documents');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setError(null);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
  
    try {
      // Compress images first — return values used directly (NOT via state)
      setLoadingMessage('Compressing images...');
      const [readyCacDoc, readyGovtId, readyUtilityBill, readyBizPhoto] = await Promise.all([
        formData.cacDoc ? api.compressImage(formData.cacDoc) : Promise.resolve(null),
        formData.govtId ? api.compressImage(formData.govtId) : Promise.resolve(null),
        formData.utilityBill ? api.compressImage(formData.utilityBill) : Promise.resolve(null),
        formData.bizPhoto ? api.compressImage(formData.bizPhoto) : Promise.resolve(null),
      ]);
  
      // Convert compressed files to base64
      setLoadingMessage('Preparing documents...');
      const [cacDocBase64, govtIdBase64, utilityBillBase64, bizPhotoBase64] = await Promise.all([
        readyCacDoc ? api.fileToBase64(readyCacDoc) : Promise.resolve(undefined),
        readyGovtId ? api.fileToBase64(readyGovtId) : Promise.resolve(undefined),
        readyUtilityBill ? api.fileToBase64(readyUtilityBill) : Promise.resolve(undefined),
        readyBizPhoto ? api.fileToBase64(readyBizPhoto) : Promise.resolve(undefined),
      ]);
  
      setLoadingMessage('Submitting application...');
  
      const payload = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName || '',   // capital N
        mobileNumber: formData.mobileNumber,
        address: formData.address,
        city: formData.city,                     // new field
        bvn: formData.bvn,
        dob: formData.dob,
        pin: formData.pin,
        bName: formData.bName,
        bType: formData.bType,
        cacNo: formData.cacNo,
        BCategory: formData.BCategory,
        cacDoc: cacDocBase64,
        govtId: govtIdBase64,
        utilityBill: utilityBillBase64,
        bizPhoto: bizPhotoBase64,
      };
  
      const response = await api.submitOnboarding(payload);
  
      // Check for successful response (has user or walletId)
      if (response.user || response.walletId) {
        console.log('Registration successful:', response);
        setCompleted(true);
      } 
      // Check for error response format
      else if (response.message) {
        setError(response.message);
      } 
      else {
        setError('Submission failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      if (err.message?.includes('timed out')) {
        setError('The server took too long to respond. Please try again.');
      } else {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed.missingFields?.length) {
            setError(`Missing required fields: ${parsed.missingFields.join(', ')}`);
          } else {
            setError(parsed.message || 'Server error. Please try again.');
          }
        } catch {
          setError(err.message || 'Something went wrong. Please try again.');
        }
      }
    } finally {
      setLoading(false);
      setLoadingMessage('Submitting...');
    }
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

      {error && (
        <div className="px-6 py-2">
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xl">
            {error}
          </div>
        </div>
      )}

      <div className="flex-1 px-6 pt-2 pb-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {currentStep === 0 && <PersonalStep data={formData} onChange={updateFormData} />}
            {currentStep === 1 && <BusinessStep data={formData} onChange={updateFormData} />}
            {currentStep === 2 && <DocumentsStep data={formData} onChange={updateFormData} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={nextStep}
          disabled={loading}
          className="w-full py-4 rounded-xl gradient-secondary text-primary-foreground font-semibold text-base shadow-lg shadow-secondary/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {loadingMessage}
            </>
          ) : (
            <>
              {currentStep === STEPS.length - 1 ? 'Submit Application' : 'Continue'}
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Personal Step ────────────────────────────────────────────────────────────

interface PersonalStepProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const PersonalStep = ({ data, onChange }: PersonalStepProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-4">
        <label className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-secondary/40 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative">
          {data.selfie ? (
            <>
              <img
                src={URL.createObjectURL(data.selfie)}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => { e.preventDefault(); onChange('selfie', null); }}
                className="absolute top-0 right-0 w-6 h-6 bg-destructive rounded-bl-lg flex items-center justify-center"
              >
                <X size={14} className="text-white" />
              </button>
            </>
          ) : (
            <>
              <Camera size={24} className="text-secondary mb-1" />
              <span className="text-[10px] text-muted-foreground">Selfie</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange('selfie', file);
            }}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="First Name" placeholder="Adebayo"
          value={data.firstName} onChange={(e) => onChange('firstName', e.target.value)} required
        />
        <InputField
          label="Last Name" placeholder="Ogunlesi"
          value={data.lastName} onChange={(e) => onChange('lastName', e.target.value)} required
        />
      </div>

      <InputField
        label="Middle Name (Optional)" placeholder="James"
        value={data.middleName} onChange={(e) => onChange('middleName', e.target.value)}
      />

      <InputField
        label="Phone Number" placeholder="+2348000000000" type="tel"
        value={data.mobileNumber} onChange={(e) => onChange('mobileNumber', e.target.value)} required
      />

      <InputField
        label="Email Address" placeholder="merchant@example.com" type="email"
        value={data.email} onChange={(e) => onChange('email', e.target.value)} required
      />

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          Password <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            className="w-full px-4 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all pr-14"
            value={data.password}
            onChange={(e) => onChange('password', e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="BVN" placeholder="22345678901"
          value={data.bvn} onChange={(e) => onChange('bvn', e.target.value.replace(/\D/g, '').slice(0, 11))}
          required maxLength={11}
        />
        <InputField
          label="Date of Birth" placeholder="" type="date"
          value={data.dob} onChange={(e) => onChange('dob', e.target.value)} required
        />
      </div>

      <InputField
        label="Residential Address" placeholder="12 Broad Street, Lagos"
        value={data.address} onChange={(e) => onChange('address', e.target.value)} required
      />

      {/* City — required by backend */}
      <InputField
        label="City" placeholder="Lagos"
        value={data.city} onChange={(e) => onChange('city', e.target.value)} required
      />

      <InputField
        label="4-digit PIN" placeholder="••••" type="password" maxLength={4}
        value={data.pin}
        onChange={(e) => onChange('pin', e.target.value.replace(/\D/g, '').slice(0, 4))}
        required
      />

      <p className="text-[11px] text-muted-foreground/60">An OTP will be sent to verify your phone number</p>
    </div>
  );
};

// ─── Business Step ────────────────────────────────────────────────────────────

interface BusinessStepProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const BusinessStep = ({ data, onChange }: BusinessStepProps) => (
  <div className="space-y-4">
    <InputField
      label="Business Name" placeholder="Adebayo Stores"
      value={data.bName} onChange={(e) => onChange('bName', e.target.value)} required
    />
    <SelectField
      label="Business Type" value={data.bType}
      onChange={(e) => onChange('bType', e.target.value)}
      options={['Sole Proprietorship', 'Limited Liability', 'Partnership', 'Enterprise']} required
    />
    <InputField
      label="CAC Registration Number" placeholder="RC 123456"
      value={data.cacNo} onChange={(e) => onChange('cacNo', e.target.value)} required
    />
    <SelectField
      label="Business Category" value={data.BCategory}
      onChange={(e) => onChange('BCategory', e.target.value)}
      options={['Retail', 'Food & Beverages', 'Electronics', 'Fashion', 'Phone & Data', 'General Merchandise', 'Others']}
      required
    />
  </div>
);

// ─── Documents Step ───────────────────────────────────────────────────────────

interface DocumentsStepProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const DocumentsStep = ({ data, onChange }: DocumentsStepProps) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-2">
      <p className="text-sm text-muted-foreground">Upload the following documents for verification</p>
      <div className="flex items-center gap-1 px-2 py-1 bg-secondary/10 rounded-full">
        <Info size={12} className="text-secondary" />
        <span className="text-[10px] font-medium text-secondary">Max 25MB each</span>
      </div>
    </div>
    <UploadBox
      label="CAC Certificate" 
      description="PDF or image (max 25MB)"
      file={data.cacDoc} 
      onFileChange={(f) => onChange('cacDoc', f)}
      accept=".pdf,.jpg,.jpeg,.png" 
      required
      maxSize={25}
    />
    <UploadBox
      label="Valid Government ID" 
      description="NIN slip, Voter's card, Driver's license, or Passport (max 25MB)"
      file={data.govtId} 
      onFileChange={(f) => onChange('govtId', f)}
      accept=".pdf,.jpg,.jpeg,.png" 
      required
      maxSize={25}
    />
    <UploadBox
      label="Utility Bill" 
      description="Not older than 3 months (max 25MB)"
      file={data.utilityBill} 
      onFileChange={(f) => onChange('utilityBill', f)}
      accept=".pdf,.jpg,.jpeg,.png" 
      required
      maxSize={25}
    />
    <UploadBox
      label="Business/Location Photo" 
      description="Photo of your business premises (max 25MB)"
      file={data.bizPhoto} 
      onFileChange={(f) => onChange('bizPhoto', f)}
      accept="image/*" 
      required
      maxSize={25}
    />
  </div>
);

// ─── Shared UI Components ─────────────────────────────────────────────────────

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  maxLength?: number;
}

const InputField = ({ label, placeholder, type = 'text', value, onChange, required, maxLength }: InputFieldProps) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
      value={value}
      onChange={onChange}
      required={required}
      maxLength={maxLength}
    />
  </div>
);

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
}

const SelectField = ({ label, value, onChange, options, required }: SelectFieldProps) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    <select
      className="w-full px-4 py-3.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all appearance-none"
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

interface UploadBoxProps {
  label: string;
  description: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  required?: boolean;
  maxSize?: number;
}

const UploadBox = ({ 
  label, 
  description, 
  file, 
  onFileChange, 
  accept, 
  required,
  maxSize = 25 // Default to 25MB
}: UploadBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected && selected.size > maxSize * 1024 * 1024) {
      alert(`File too large. Maximum size is ${maxSize}MB.`);
      return;
    }
    onFileChange(selected);
    e.target.value = '';
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
  };

  const displayName = file
    ? file.name.length > 28 ? file.name.substring(0, 25) + '...' : file.name
    : null;

  const fileSize = file
    ? file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(1)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    : null;

  return (
    <>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
      <div
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
          file ? 'border-secondary/60 bg-secondary/5' : 'border-border hover:border-secondary/40 hover:bg-muted/50'
        }`}
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${file ? 'bg-secondary/20' : 'bg-secondary/10'}`}>
          {file ? <CheckCircle size={18} className="text-secondary" /> : <Upload size={18} className="text-secondary" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">
            {label} {required && <span className="text-destructive">*</span>}
          </p>
          {file ? (
            <p className="text-[11px] text-secondary font-medium truncate">{displayName} · {fileSize}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground truncate">{description}</p>
          )}
        </div>
        {file ? (
          <button
            type="button"
            onClick={handleRemove}
            className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 hover:bg-destructive/10 transition-colors"
          >
            <X size={14} className="text-muted-foreground" />
          </button>
        ) : (
          <span className="text-xs text-secondary font-medium shrink-0">Upload</span>
        )}
      </div>
    </>
  );
};

export default OnboardingScreen;