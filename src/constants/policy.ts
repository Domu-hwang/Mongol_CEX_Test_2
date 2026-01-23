// src/constants/policy.ts
// Defines country-specific policy data for the KYC onboarding flow.

export const REGULATED_COUNTRIES = ['EU', 'UK', 'CH', 'AU']; // Example: European Union, United Kingdom, Switzerland, Australia

export const SANCTIONED_COUNTRIES = ['CU', 'IR', 'KP', 'SY']; // Example: Cuba, Iran, North Korea, Syria

export const ID_DOCUMENT_TYPES: Record<string, string[]> = {
    EU: ['Passport', 'National ID Card', 'Residence Permit'],
    UK: ['Passport', 'Driving License', 'Biometric Residence Permit'],
    CH: ['Passport', 'Swiss ID', 'B Permit'],
    AU: ['Passport', 'Driver License', 'Medicare Card'],
    US: ['Passport', 'Driver License'],
    KR: ['Passport', 'Resident Registration Card', 'Driver License'],
    JP: ['Passport', 'My Number Card', 'Driver License'],
    // Add more country-specific document types as needed
    default: ['Passport', 'National ID Card'],
};

export const COUNTRIES = [
    { name: 'Australia', value: 'AU' },
    { name: 'France', value: 'EU' },
    { name: 'Germany', value: 'EU' },
    { name: 'South Korea', value: 'KR' },
    { name: 'Switzerland', value: 'CH' },
    { name: 'United Kingdom', value: 'UK' },
    { name: 'United States', value: 'US' },
    { name: 'Other', value: 'default' },
];

export type KycPolicyKey = keyof typeof KYC_POLICIES;

export const KYC_POLICIES = {
    EU: {
        minAge: 18,
        documentTypes: ID_DOCUMENT_TYPES.EU,
        poaRequired: true,
        additionalVerification: 'Selfie + ID + Proof of Address submission is required.',
    },
    UK: {
        minAge: 18,
        documentTypes: ID_DOCUMENT_TYPES.UK,
        poaRequired: true,
        additionalVerification: 'Selfie + ID + Proof of Address submission is required.',
    },
    CH: { // Switzerland
        minAge: 18,
        documentTypes: ID_DOCUMENT_TYPES.CH,
        poaRequired: true,
        additionalVerification: 'Selfie + ID + Proof of Address submission is required.',
    },
    AU: { // Australia
        minAge: 18,
        documentTypes: ID_DOCUMENT_TYPES.AU,
        poaRequired: true,
        additionalVerification: 'Selfie + ID + Proof of Address submission is required.',
    },
    default: {
        minAge: 18,
        documentTypes: ID_DOCUMENT_TYPES.default,
        poaRequired: false,
        additionalVerification: 'Please prepare your Selfie + ID submission. Proof of Address may be requested if needed.',
    },
};

export const getKycPolicyKeyForCountry = (countryName: string): KycPolicyKey => {
    const country = COUNTRIES.find(c => c.name === countryName);
    return (country?.value as KycPolicyKey) || 'default';
};

// Stepper configuration based on policy
export const getOnboardingSteps = (isPOARequired: boolean) => {
    const baseSteps = [
        { id: 'residence', label: 'Residence', description: 'Select your country of residence.' },
        { id: 'profile', label: 'Profile', description: 'Enter your personal details.' },
        { id: 'nationality', label: 'ID Document', description: 'Select your nationality and ID type.' },
    ];

    if (isPOARequired) {
        baseSteps.push({ id: 'poa', label: 'POA', description: 'Upload your proof of address document.' });
    }

    baseSteps.push(
        { id: 'review', label: 'Review', description: 'Your submitted information is under review.' }
    );

    return baseSteps;
};
