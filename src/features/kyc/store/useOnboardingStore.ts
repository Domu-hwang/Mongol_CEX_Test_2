import { create } from 'zustand';
import { KYC_POLICIES, KycPolicyKey } from '@/constants/policy'; // Corrected import path and added KycPolicyKey

interface OnboardingState {
    currentStep: number;
    residenceCountry: string;
    nationality: string;
    kycStatus: 'pending' | 'approved' | 'rejected' | 'none';
    isPOARequired: boolean; // Added to state
}

interface OnboardingActions {
    setResidenceCountry: (country: KycPolicyKey | string) => void; // Updated type to include KycPolicyKey
    setNationality: (nationality: string) => void;
    setKycStatus: (status: OnboardingState['kycStatus']) => void;
    nextStep: () => void;
    prevStep: () => void;
    resetOnboarding: () => void;
}

const initialOnboardingState: OnboardingState = {
    currentStep: 0,
    residenceCountry: '',
    nationality: '',
    kycStatus: 'none',
    isPOARequired: false, // Initialized
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>((set, get) => ({
    ...initialOnboardingState,
    setResidenceCountry: (country) => {
        // Here we assume 'country' can be a full country name, and we need to map it to a KycPolicyKey
        // For now, a direct cast is used for simplification based on previous steps.
        // A proper mapping function will be added in policy.ts
        const countryKey: KycPolicyKey = country as KycPolicyKey;
        const policy = KYC_POLICIES[countryKey] || KYC_POLICIES.default;
        set({ residenceCountry: country, isPOARequired: policy.poaRequired });
    },
    setNationality: (nationality) => set({ nationality: nationality }),
    setKycStatus: (status) => set({ kycStatus: status }),
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
    resetOnboarding: () => set(initialOnboardingState),
}));
