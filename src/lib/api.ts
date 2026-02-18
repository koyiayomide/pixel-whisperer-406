const BASE_URL = '';

export interface OnboardingData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  mobileNumber: string;
  address: string;
  city: string;
  bvn: string;
  dob: string;
  pin: string;
  bName: string;
  bType: string;
  cacNo: string;
  BCategory: string;
  cacDoc?: string;
  govtId?: string;
  utilityBill?: string;
  bizPhoto?: string;
}

export interface OnboardingResponse {
  user?: {
    id: string;
    email: string;
    name: string;
  };
  walletId?: string;
  code?: string;
  success?: boolean;
  message?: string;
  data?: {
    customerId: string;
    walletId: string;
  };
}

export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    user: {
      email: string;
      balance: string;
      acctNo: string;
      bankName: string;
      name: string;
    };
    accessToken: string;
  }

export const api = {
  compressImage: (file: File): Promise<File> => {
    if (file.type === 'application/pdf') {
      return Promise.resolve(file);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const MAX_SIZE = 800;
          let { width, height } = img;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                console.log(
                  `Compressed ${file.name}: ${(file.size / 1024).toFixed(0)}KB → ${(compressed.size / 1024).toFixed(0)}KB`
                );
                resolve(compressed);
              } else {
                reject(new Error('Canvas toBlob returned null'));
              }
            },
            'image/jpeg',
            0.5
          );
        };

        img.onerror = () => reject(new Error('Failed to load image for compression'));
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  },

  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = () => reject(new Error('Failed to convert file to base64'));
    });
  },

  submitOnboarding: async (data: OnboardingData): Promise<OnboardingResponse> => {
    console.group('📤 SUBMITTING TO BACKEND');
    console.log('Full payload (without base64):', {
      ...data,
      cacDoc: data.cacDoc ? `[base64: ${(data.cacDoc.length / 1024).toFixed(1)}KB]` : undefined,
      govtId: data.govtId ? `[base64: ${(data.govtId.length / 1024).toFixed(1)}KB]` : undefined,
      utilityBill: data.utilityBill ? `[base64: ${(data.utilityBill.length / 1024).toFixed(1)}KB]` : undefined,
      bizPhoto: data.bizPhoto ? `[base64: ${(data.bizPhoto.length / 1024).toFixed(1)}KB]` : undefined,
    });
    console.groupEnd();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60_000);

    try {
      const response = await fetch('/api/MoneyBox/RegisterController', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      const responseText = await response.text();
      console.group('📥 BACKEND RESPONSE');
      console.log('Status:', response.status);
      console.log('Raw response:', responseText);
      
      let parsed: any;
      try {
        parsed = JSON.parse(responseText);
        console.log('Parsed response:', parsed);
      } catch {
        console.log('Response is not JSON');
        parsed = { message: responseText };
      }
      console.groupEnd();

      if (!response.ok) {
        const error = new Error(parsed?.message || `HTTP ${response.status}`);
        (error as any).status = response.status;
        (error as any).response = parsed;
        throw error;
      }

      return parsed as OnboardingResponse;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Request timed out after 60 seconds. Please try again.');
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  },

  login: async (data: { email: string; password: string }): Promise<LoginResponse> => {
    console.group('📤 LOGIN ATTEMPT');
    console.log('Email:', data.email);
    console.groupEnd();
  
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);
  
    try {
      const response = await fetch('/api/MoneyBox/authenticate/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
  
      const responseText = await response.text();
      console.group('📥 LOGIN RESPONSE');
      console.log('Status:', response.status);
      console.log('Raw response:', responseText);
      
      let parsed: any;
      try {
        parsed = JSON.parse(responseText);
        console.log('Parsed response:', parsed);
      } catch {
        console.log('Response is not JSON');
        parsed = { message: responseText };
      }
      console.groupEnd();
  
      if (!response.ok) {
        const error = new Error(parsed?.message || `HTTP ${response.status}`);
        (error as any).status = response.status;
        (error as any).response = parsed;
        throw error;
      }
  
      return parsed as LoginResponse;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  },
};

