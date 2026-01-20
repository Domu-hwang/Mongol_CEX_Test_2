# Frontend Task Breakdown (CEX Pilot)

본 문서는 프론트엔드 작업을 **화면/컴포넌트 단위**로 실행 가능한 태스크로 정리한 목록입니다.

---

## 1) 공통/Shared UI (상세 티켓)
- [ ] S-UI-001: Button 컴포넌트 기본 구현
  - [ ] variants: primary/secondary/danger/success/outline
  - [ ] sizes: sm/md/lg
  - [ ] loading/disabled 상태 처리
- [ ] S-UI-002: Input 컴포넌트 기본 구현
  - [ ] label/helperText/error 메시지
  - [ ] 상태별 스타일(기본/에러/포커스)
- [ ] S-UI-003: Modal 컴포넌트 기본 구현
  - [ ] overlay/close 버튼/size(sm/md/lg)
  - [ ] ESC/overlay click 닫기
- [ ] S-UI-004: Tabs 컴포넌트 기본 구현
  - [ ] Tabs/TabsList/TabsTrigger/TabsContent
- [ ] S-UI-005: Table 컴포넌트 기본 구현
  - [ ] head/body/row/empty 상태
- [ ] S-UI-006: Badge 컴포넌트 기본 구현
  - [ ] status 컬러 매핑
- [ ] S-UI-007: Loading/Empty/Error 상태 컴포넌트
  - [ ] LoadingState/EmptyState/ErrorState
- [ ] S-UI-008: Stepper/Progress 컴포넌트
  - [ ] KYC-01 ~ KYC-06 단계 표시
- [ ] S-UI-009: FileUpload 컴포넌트
  - [ ] 확장자/용량 검증 + 업로드 프리뷰
- [ ] S-UI-010: ConfirmModal 컴포넌트
  - [ ] 이탈/취소 시 확인 모달
- [ ] S-HOOK-001: useMediaQuery 구현
- [ ] S-HOOK-002: useDebounce 구현
- [ ] S-HOOK-003: useThrottle 구현
- [ ] S-UTIL-001: formatCurrency/formatDate 유틸

## 2) Auth 플로우 (상세 티켓)
**화면:** 로그인, 회원가입, 이메일 인증 + KYC
- [ ] AUTH-UI-001: AuthLayout 구성
  - [ ] 공통 레이아웃(브랜드/폼 영역 분리)
- [ ] AUTH-UI-002: LoginForm UI 구현
  - [ ] 입력 필드: email/password
  - [ ] 유효성 검사(zod)
  - [ ] submit/loading 상태
- [ ] AUTH-UI-003: RegisterForm UI 구현
  - [ ] 입력 필드: email/password
  - [ ] 유효성 검사(zod)
  - [ ] submit/loading 상태
- [ ] AUTH-UI-004: VerificationCodeInput 구현
  - [ ] 6자리 입력, 자동 포커스 이동
- [ ] AUTH-STATE-001: AuthContext + useAuth 구현
  - [ ] 세션 체크 on mount
  - [ ] login/logout/register 함수
  - [ ] kycStatus 포함
  - [ ] KYC 시작 CTA/배너 표시 조건 관리
- [ ] AUTH-API-001: authService API 연동
  - [ ] login/register/verifyEmail/getCurrentUser/logout
  - [ ] kycStatus 조회/업데이트 API 연동
  - [ ] KYC 메타데이터 등록/업로드 상태 업데이트
- [ ] AUTH-ROUTE-001: ProtectedRoute 구현
  - [ ] 비로그인 시 /login redirect
  - [ ] KYC 미완료 시 KYC 흐름으로 유도
  - [ ] KYC2 트리거(Fiat 사용/출금 한도 증가/주소 불일치) 진입 처리
- [ ] AUTH-UX-001: 오류/로딩/성공 토스트 처리
  - [ ] 필수 입력/업로드 실패/서버 오류 공통 처리
- [ ] AUTH-KYC-001: KYC-01 안내 화면
  - [ ] 안내 카드: CMP 요약/국가별 가이드
  - [ ] EU/UK/Swiss/Australia POA 필요 안내 포함
  - [ ] “시작하기” CTA
- [ ] AUTH-KYC-002: KYC-02 정보 입력
  - [ ] Residence country + Nationality 동시 입력
  - [ ] 국가별 문서 가이드 카드 노출(EU/UK/Swiss/Australia)
  - [ ] Full name: First/Family + middle name 옵션
  - [ ] DOB 입력 + 만 18세 미만 차단/에러
  - [ ] ID 문서 타입 동적 표시(Residence/Nationality 기반)
- [ ] AUTH-KYC-003: KYC-03 문서 제출(ID Document)
  - [ ] 파일 업로드(확장자/용량/해상도 검사)
  - [ ] 프리뷰/재업로드
  - [ ] Presigned URL 업로드 플로우
- [ ] AUTH-KYC-004: KYC-04 라이브니스(Selfie/Liveness)
  - [ ] 셀피 가이드 카드
  - [ ] 재촬영/업로드 실패 재시도
- [ ] AUTH-KYC-005: KYC-05 주소 증빙(POA)
  - [ ] 주소 입력 폼(Residential address/City/Postal code/Country)
  - [ ] POA 업로드(문서 유형 국가별 안내)
  - [ ] EU/UK/Swiss/Australia 온보딩 중 노출
  - [ ] 기타 국가는 대시보드 요청 시 진입
- [ ] AUTH-KYC-006: KYC-06 진행 상태 화면
  - [ ] 상태 배지: pending/approved/rejected
  - [ ] 반려 사유 표시 + 재제출 CTA
- [ ] AUTH-KYC-007: KYC UX 세부 가이드 적용
  - [ ] KYC Progress Stepper(01~06)
  - [ ] 단계별 임시 저장 + 이탈 확인 모달

## 3) Trade 플로우
**화면:** 거래 메인
- [ ] TradeView 레이아웃(모바일/데스크탑 분기)
- [ ] MarketSelector + PriceDisplay
- [ ] OrderBook + RecentTrades
- [ ] PriceChart
- [ ] OrderForm(마켓/리밋) + 주문 확인 모달
- [ ] OpenOrders + OrderHistory
- [ ] WebSocket 구독(useMarketPrice, useOrderBook)
- [ ] tradeService API 연동

## 4) Wallet 플로우
**화면:** 지갑 메인
- [ ] WalletView 레이아웃
- [ ] BalanceOverview + AssetList
- [ ] DepositModal + DepositAddressDisplay
- [ ] WithdrawModal + WithdrawConfirmModal
- [ ] TransactionHistory + History 카드
- [ ] walletService API 연동

## 5) Account 플로우
**화면:** 계정 설정
- [ ] AccountView 탭 구성
- [ ] ProfileSection + SecuritySection
- [ ] PasswordChangeForm
- [ ] accountService API 연동

## 6) Admin 플로우
**화면:** 관리자 콘솔
- [ ] AdminLayout + Dashboard
- [ ] MetricCard + ActivityFeed
- [ ] UserManagement + UserTable
- [ ] WithdrawalReview + Approval 모달
- [ ] LogsView
- [ ] adminService API 연동

## 7) Landing 플로우
**화면:** 랜딩 / 약관 / 개인정보
- [ ] LandingPage + HeroSection
- [ ] FeaturesSection + CTASection
- [ ] TermsPage / PrivacyPage

## 8) QA & 마무리
- [ ] 모바일 퍼스트 확인(375px)
- [ ] 로딩/빈상태/에러 처리 점검
- [ ] 단위 테스트(핵심 폼/핵심 리스트)
- [ ] 접근성 점검(키보드 포커스/aria)

---

필요 시 이 리스트를 스프린트/티켓 형태로 세분화할 수 있습니다.
