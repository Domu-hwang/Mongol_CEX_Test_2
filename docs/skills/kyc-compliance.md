# KYC Compliance (Frontend Skill)

본 문서는 CEX Pilot 프론트엔드에서 **KYC 컴플라이언스**를 구현하기 위한 가이드입니다. KYC 레벨/단계, 요구 문서, 승인 플로우, UI/UX, 오류 처리 및 보안 요구사항을 정의합니다.

---

## 1. KYC 단계 정의

### KYC Level 1.1
- **Residence Country**
- 국가에 따라 준비 문서/프로세스 안내 카드가 다르게 노출
- **EU/UK/Swiss/Australia** 거주자는 **POA(Proof of Address)** 필요
- 국가에 따라 허용되는 POA 문서 유형도 상이
- 안내 카드에 **간단한 CMP(Compliance) 요약** 표기

### KYC Level 1.2
- **Full name** (First name + Family name)
  - “I have a middle name” 체크 시 Middle name 입력 필드 표시
- **Date of birth**
  - **만 18세 미만이면 오류 메시지** 표시 및 Continue 비활성화
- **Nationality**
  - 다양한 국가 지원(정책에 따라 변경 가능)
  - 예: North Korea, Iran, Cuba, Sudan, Russia, Afghanistan, Yemen 등
- **ID Document**
  - 국가별 허용 문서 타입이 다름

> **Residence country와 Nationality는 같은 페이지에서 입력**하며, 이 두 요소에 따라 **요청되는 ID 문서 타입이 변경**됩니다.

### KYC Level 2
- **Selfie / Liveness**
- **Proof of Address (POA)**

---

## 2. 화면 구성

- **KYC-01:** 안내
- **KYC-02:** 정보 입력 (Residence/Nationality/Name/DOB/ID)
- **KYC-03:** 문서 제출 (ID Document)
- **KYC-04:** 라이브니스 (Selfie/Liveness)
- **KYC-05:** 주소 증빙 (POA)
- **KYC-06:** 진행 상태

---

## 3. 플로우 상세

### KYC 1.1 (Residence)
- Residence country 선택
- 국가별 **프로세스/문서 가이드 카드** 노출
  - EU/UK/Swiss/Australia: POA 필요 안내
  - 기타 국가: POA는 추후 요청 가능 안내
- CMP 요약 텍스트 포함

### KYC 1.2 (Profile + ID)
- 이름 입력 (First/Family, Middle name optional)
- 생년월일 검증 (만 18세 이상 조건)
- Nationality 선택
- Residence/Nationality에 따라 ID 문서 타입 동적 노출

### KYC 2 (조건부 진입)
사용자 대시보드에서 다음 트리거 시 KYC2 진행:
1. Fiat 사용 시도
2. 출금 한도 증가 요청
3. 주소가 POI 발급 국가와 불일치

#### EU/UK/Swiss/Australia 사용자
- 온보딩 중 **POA 단계 포함**
  - POA-1: 주소 입력 폼
    - Residential address
    - City
    - Postal code (Optional)
    - Country/Region
  - POA-2: POA 문서 업로드

#### 기타 국가 사용자
- 온보딩 완료 후 **리뷰 상태(KYC-06)**
- 추후 대시보드에서 POA 요청

---

## 4. UI/UX 가이드

- KYC Progress Stepper (KYC-01 ~ KYC-06)
- 업로드 프리뷰 + 재업로드
- 상태 배지: pending/approved/rejected
- 반려 사유 표시(텍스트)
- 단계별 임시 저장 지원
- 이탈 시 확인 모달

---

## 5. 오류 처리

- 필수 입력 누락 시 즉시 에러 표시
- 만 18세 미만 시 Continue 비활성화 + 안내 메시지
- 파일 규격/용량 위반 시 업로드 차단
- 업로드 실패 시 재시도 버튼 제공
- 서버 오류 시 공통 ErrorState 표시

---

## 6. 보안 요구사항

- 업로드 URL은 **서명된 URL(Presigned URL)** 사용
- 전송 중 HTTPS 필수
- 클라이언트에 민감 정보 저장 금지
- 업로드 완료 후 서버에 메타데이터 등록

---

## 7. Auth 모듈 반영 포인트

- 회원가입 후 KYC 시작 CTA 표시
- 로그인 후 KYC 상태 체크 및 배너 노출
- `useAuth` 또는 전역 상태에 `kycStatus` 포함
- 보호 라우트에서 KYC 상태 체크 추가
- Residence/Nationality 기반 ID 문서 타입 동적 표시

---

**이 문서는 Auth 및 Account/Trade/Wallet 모듈의 KYC 연동 기준으로 사용됩니다.**
