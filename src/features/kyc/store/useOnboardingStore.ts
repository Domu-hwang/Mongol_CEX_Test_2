import { create } from 'zustand';
import { KYC_POLICIES, KycPolicyKey } from '@/constants/policy';
import { KycSubmissionData } from '../types'; // Import KycSubmissionData type

interface OnboardingState {
    currentStep: number;
    residenceCountry: string;
    nationality: string;
    kycStatus: 'pending' | 'approved' | 'rejected' | 'none';
    isPOARequired: boolean;
    profileData?: KycSubmissionData; // Added profileData to state
}

interface OnboardingActions {
    setResidenceCountry: (country: KycPolicyKey | string) => void;
    setNationality: (nationality: string) => void;
    setKycStatus: (status: OnboardingState['kycStatus']) => void;
    setProfileData: (data: KycSubmissionData) => void; // Added setProfileData action
    nextStep: () => void;
    prevStep: () => void;
    resetOnboarding: () => void;
}

const initialOnboardingState: OnboardingState = {
    currentStep: 0,
    residenceCountry: '',
    nationality: '',
    kycStatus: 'none',
    isPOARequired: false,
    profileData: undefined, // Initialized
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>((set, get) => ({
    ...initialOnboardingState,
    setResidenceCountry: (country) => {
        const countryKey: KycPolicyKey = country as KycPolicyKey;
        const policy = KYC_POLICIES[countryKey] || KYC_POLICIES.default;
        set({ residenceCountry: country, isPOARequired: policy.poaRequired });
    },
    setNationality: (nationality) => set({ nationality: nationality }),
    setKycStatus: (status) => set({ kycStatus: status }),
    setProfileData: (data) => set({ profileData: data }), // Implemented setProfileData
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
    resetOnboarding: () => set(initialOnboardingState),
}));
