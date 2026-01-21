// src/constants/policy.ts
// 국가별 정책 데이터를 정의하는 더미 파일 (Placeholder for Policy Layer)

export const KYC_POLICIES = {
    EU: {
        minAge: 18,
        documentTypes: ['Passport', 'National ID card', 'Residence permit'],
        poaRequired: true,
        additionalVerification: 'Selfie + ID + POA 제출이 필요합니다.',
    },
    UK: {
        minAge: 18,
        documentTypes: ['Passport', 'Driving license', 'Biometric residence permit'],
        poaRequired: true,
        additionalVerification: 'Selfie + ID + POA 제출이 필요합니다.',
    },
    Swiss: {
        minAge: 18,
        documentTypes: ['Passport', 'Swiss ID', 'B permit'],
        poaRequired: true,
        additionalVerification: 'Selfie + ID + POA 제출이 필요합니다.',
    },
    Australia: {
        minAge: 18,
        documentTypes: ['Passport', 'Driver license', 'Medicare card'],
        poaRequired: true,
        additionalVerification: 'Selfie + ID + POA 제출이 필요합니다.',
    },
    default: {
        minAge: 18,
        documentTypes: ['Passport', 'National ID card'],
        poaRequired: false,
        additionalVerification: 'Selfie + ID 제출을 준비해주세요. 필요 시 POA 요청이 있을 수 있습니다.',
    },
};

// Stepper configuration based on policy
export const getOnboardingSteps = (isPOARequired: boolean) => {
    const baseSteps = [
        { id: 'intro', label: '시작하기', description: '온보딩 절차를 시작합니다.' },
        { id: 'profile', label: '기본 정보', description: '개인 정보를 입력합니다.' },
    ];

    if (isPOARequired) {
        baseSteps.push({ id: 'poa', label: '주소 증빙', description: '주소 증빙 문서를 업로드합니다.' });
    }

    baseSteps.push(
        { id: 'document', label: '신분증 업로드', description: '신분증을 업로드합니다.' },
        { id: 'review', label: '심사 대기', description: '제출된 정보를 검토합니다.' }
    );

    return baseSteps;
};
