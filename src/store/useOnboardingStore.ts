import { create } from 'zustand';
import { REGULATED_COUNTRIES } from '../constants/policy';

interface OnboardingState {
    currentStep: number;
    residenceCountry: string;
    nationality: string;
    kycStatus: 'pending' | 'approved' | 'rejected' | 'none';
}

interface OnboardingActions {
    setResidenceCountry: (country: string) => void;
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
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>((set, get) => ({
    ...initialOnboardingState,
    setResidenceCountry: (country) => set({ residenceCountry: country }),
    setNationality: (nationality) => set({ nationality: nationality }),
    setKycStatus: (status) => set({ kycStatus: status }),
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
    resetOnboarding: () => set(initialOnboardingState),
    get isPOARequired() {
        return REGULATED_COUNTRIES.includes(get().residenceCountry);
    },
}));
