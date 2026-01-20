import React, { useState } from 'react';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { KycIntro } from '@/features/auth/components/KycIntro';
import { KycProfileForm } from '@/features/auth/components/KycProfileForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button'; // Button import 추가
import { useParams, useNavigate } from 'react-router-dom';

export const AuthPage: React.FC = () => {
    const { tab } = useParams<{ tab: string }>();
    const navigate = useNavigate();
    const [kycStep, setKycStep] = useState<'intro' | 'profile'>(tab === 'kyc-profile' ? 'profile' : 'intro');

    const handleKycStart = () => {
        setKycStep('profile');
        navigate('/auth/kyc-profile', { replace: true });
    };

    const handleKycSubmit = (data: any) => {
        console.log('KYC Profile Submitted:', data);
        alert('KYC 정보가 제출되었습니다!');
        // Ideally, navigate to next KYC step or dashboard
    };

    return (
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
            <div className="w-full max-w-4xl">
                <Tabs defaultValue="login" value={tab === 'kyc' || tab === 'kyc-profile' ? 'kyc' : tab || 'login'}>
                    <TabsList className="mb-6 mx-auto w-full max-w-md">
                        <TabsTrigger value="login" onClick={() => navigate('/auth/login')}>
                            로그인
                        </TabsTrigger>
                        <TabsTrigger value="register" onClick={() => navigate('/auth/register')}>
                            회원가입
                        </TabsTrigger>
                        <TabsTrigger value="kyc" onClick={() => navigate('/auth/kyc')}>
                            KYC
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <AuthLayout title="기관 로그인" subtitle="Mongol CEX Pilot 계정으로 접속하세요.">
                            <LoginForm onSubmit={(data) => console.log('Login Submitted:', data)} />
                        </AuthLayout>
                    </TabsContent>

                    <TabsContent value="register">
                        <AuthLayout
                            title="기관 회원가입"
                            subtitle="KYC 인증 후 OTC/Derivatives 권한이 부여됩니다."
                            helperText="8자 이상, 대문자/숫자/특수문자 포함 비밀번호를 설정하세요."
                        >
                            <RegisterForm onSubmit={(data) => console.log('Register Submitted:', data)} />
                        </AuthLayout>
                    </TabsContent>

                    <TabsContent value="kyc">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="h-full">
                                <AuthLayout
                                    title="KYC 진행"
                                    subtitle="Residency & Nationality 기반의 CMP 가이드"
                                    sideContent={
                                        <div>
                                            <p className="font-semibold">KYC 단계</p>
                                            <p className="text-sm text-slate-500">
                                                Stepper 구성으로 언제든 진행 상태 확인 가능
                                            </p>
                                        </div>
                                    }
                                >
                                    {kycStep === 'intro' ? (
                                        <KycIntro onStart={handleKycStart} />
                                    ) : (
                                        <KycProfileForm onSubmit={handleKycSubmit} />
                                    )}
                                </AuthLayout>
                            </div>

                            <div className="space-y-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                                <p className="font-semibold text-slate-900">KYC UX 가이드</p>
                                <ul className="list-disc space-y-2 pl-5">
                                    <li>Residence + Nationality 입력 시 허용 ID 타입 실시간 안내</li>
                                    <li>만 18세 미만 사용자는 즉시 차단</li>
                                    <li>EU/UK/Swiss/Australia는 POA 바로 요청</li>
                                    <li>기타 국가는 추후 한도 상향 시 POA 요청</li>
                                </ul>
                                {kycStep === 'profile' && (
                                    <Button variant="outline" onClick={() => setKycStep('intro')}>
                                        KYC-01로 돌아가기
                                    </Button>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
