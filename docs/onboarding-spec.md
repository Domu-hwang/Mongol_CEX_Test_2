# 📑 [Technical PRD] CEX Onboarding Module 통합 명세서

## 1. 개요 및 연구 목표

* **목표:** 국가별 규제(Compliance)에 유연하게 대응하는 **정책 기반 온보딩 시스템** 구축.
* **핵심 컨셉:** "회원"이 아닌 "계정 사용자(Account Holder)" 중심의 단계별 권한 해제 모델.
* **기술 스택:** React, Tailwind CSS, Zustand(상태 관리), React Hook Form(폼 로직).

---

## 2. 유저 플로우 및 KYC 맥락 (User Flow & Context)

온보딩은 사용자의 **거주 국가(Residence)**와 **국적(Nationality)**에 따라 경로가 실시간으로 변하는 **동적 워크플로우**를 따릅니다.

### 2.1 전체 흐름 (End-to-End Flow)

1. **계정 생성 단계:** 이메일/휴대폰 입력 → OTP 인증 → 비밀번호 설정 (Level 0 확보)
2. **KYC Level 1 (기본):** 거주국 선택 → 개인정보 입력 → 신분증 업로드 → 심사 대기
3. **정책 분기점 (Conditional Path):**
* **일반 국가:** 바로 심사 대기 화면(`KYC-06`)으로 진입.
* **규제 국가 (EU, UK, Swiss, AU 등):** 심사 대기 전 **주소 증빙(POA)** 단계로 강제 전환.

**전체 흐름  상세내용** 
**1. Sign-up (계정 생성 단계) :** 

1. 이메일/ 휴대전화 혹은
SNS sign up도 제공: Google, Apple, Telegram 
2. Verification code 인증 (digit- 6자리 verification code 입력) 
3. 비밀번호 설정 
( 8자 이상 / 1자 이상의 대문자, 소문자, 특수문자 입력) 

**2. KYC -1 
KYC level 1.1** 

- Residence Country

**KYC level 1.2**

- Full name
- Date of birth
- Nationality
- ID Document

⇒  Residence country, Nationality country are requested in the same page. 
→ Depend on those two factors ( Residence, Nationality), requesting ID document types can be changed. 

### KYC Level 2

- Selfie / Liveness
- Address Proof (Proof of Address - POA) 
**화면**
- KYC-01: 안내
- KYC-02: 정보 입력
- KYC-03: 문서 제출
- KYC-04: 라이브니스
- KYC-05: 주소 증빙
- KYC-06: 진행 상태

**Detail description

KYC 1

KYC1.1** 

- Residence country select menu input → Depend on country, process and document to prepare guide card shows differently.→ Show all countries list in acordian menu 
( EU, UK, Swiss, Australia citizen should prepare Proof of address document. Depend on the country, allowable types of POA document are also different.) 
→ brief CMP should be noticed on guide card.

**KYC 1.2**

- full name part is consisted of first name input and family name input. 
If user check I have a middle name, user can also add their middle name.
- This exchange accept only for user who is more than 18 years old. If the year of birth shows that user is under 18 years old, show error message, and disable continue button.
- Nationality supports as many as countries. Show all countries list in acordian menu. 
For example, North Korea, Iran, Cuba, Sudan, Russia, Afghanistan, Yemen. 
Also, depend on internal policy, supported nationality can be changed.
- types of ID document are requested depend on country.

**KYC 2**  

User can proceed KYC 2 from their dashboard, when they get trigger where 
(1. User wants to user Fiat 2. tries to raise withdraw amount, 3. user’s address is not same as POI issue country. etc)

- For EU, UK, Swiss, Australia countries, Proof of Address asking page will be shown during the onboarding. → but don’t highlight those countries. Show all countries list in acordian menu
- First page of POA : asking Residential address by form
    - Residential address
    - City
    - Postal code (Optional)
    - Country/ region
- Second page of POA : uploading POA document.
- Other countries show reviewing state page. These countries will be requested their POA after being onboarded in their dashboard.


4. **KYC Level 2 (심화):** 라이브니스(Selfie) 및 추가 증빙 → 모든 권한 해제.

### 2.2 KYC 상세 맥락 리스트

* **거주국 선택 (Residence):** 프로세스의 '두뇌' 역할. 이후 모든 UI 분기(문서 종류, POA 여부)를 결정함.
* **개인정보 (Identity):** 만 18세 미만 차단 로직 포함. 국적(Nationality)에 따른 제재 리스트 스크리닝 연동.
* **주소 증빙 (POA):** 특정 국가 사용자에게만 노출되는 '조건부 필수' 단계.

---

## 3. 프론트엔드 아키텍처 (React + Tailwind)

### 3.1 컴포넌트 구조 전략

* **Atomic Design:** * `Atoms`: Button, Input, Badge, Stepper Dot (Tailwind 기반 원자 컴포넌트)
* `Molecules`: FileUploader, CountrySelector, PasswordValidator
* `Organisms`: AccountForm, KycStepCard, StatusBoard


* **Policy Layer:** 국가별 정책 데이터를 `constants/policy.js`에 분리하여 코드 수정 없이 정책 변경 대응.

### 3.2 UI/UX 가이드라인 (Tailwind CSS)

* **Layout:** `max-w-[480px]`의 중앙 집중형 카드 레이아웃.
* **Interaction:** * 입력값 미충족 시 CTA 버튼 `disabled:opacity-50`.
* 단계 전환 시 `AnimatePresence`(Framer Motion 등)를 활용한 부드러운 슬라이딩 효과.



---

## 4. 모듈별 상세 구현 지침

### 4.1 ONB-ACC (Account Creation)

* **유효성 검사:** 이메일 정규식 및 비밀번호 복잡도(대문자, 숫자 포함 8~128자) 실시간 피드백.
* **OTP 필드:** 6자리 개별 입력창. Tailwind `focus:ring-2`를 활용한 시각적 강조.

### 4.2 ONB-IDV (Identity Verification)

* **Dynamic Stepper:** 현재 유저의 국가 정책에 따라 스텝 개수가 3단계 또는 4단계로 동적 변경됨.
* **Document UI:** * 국가별 허용 문서(Passport, ID Card, Driver License)를 카드 형태로 노출.
* 업로드된 이미지의 미리보기 및 삭제 기능 제공.



---

## 5. 단계별 개발 태스크 플랜 (Implementation Roadmap)

| 단계 | 구분 | 주요 태스크 내용 | 비고 |
| --- | --- | --- | --- |
| **Step 1** | **기반 구축** | Tailwind 테마 설정 및 공통 Layout/Stepper 구현 | 디자인 시스템 확립 |
| **Step 2** | **ACC 모듈** | 이메일/휴대폰 가입 및 OTP 인증 화면 퍼블리싱 | Level 0 로직 |
| **Step 3** | **IDV 모듈** | **KYC 1.1~1.2:** 거주국 선택 및 개인정보 입력 (만 18세 체크) | 분기 로직 핵심 |
| **Step 4** | **IDV 확장** | **KYC 1.3~2:** 신분증 업로드 및 규제 국가용 POA 화면 | 파일 핸들링 |
| **Step 5** | **정책 연동** | 국가별 정책 레이어(`policy.js`) 연동 및 동적 흐름 테스트 | QA 및 예외 처리 |
| **Step 6** | **상태 관리** | 심사 중/승인/거절 상태별 대시보드 UI 대응 | 최종 안정화 |

---

## 6. 데이터 모델 (Interface 예시)

```typescript
// 유저의 온보딩 여정을 제어하는 핵심 상태
interface OnboardingState {
  currentStep: number;
  residenceCountry: string; // 이 값에 따라 로직 분기
  isPOARequired: boolean;   // 정책 레이어에서 계산됨
  accountStatus: 'ACTIVE' | 'LOCKED';
  kycStatus: 'L0' | 'L1_PENDING' | 'L1_APPROVED' | 'L2_PENDING' | 'REJECTED';
}
