# Deposit.md - 입금 트랜잭션 플로우 설계

## 1. 개요 (Overview)
사용자가 외부 지갑(External Wallet)에서 보유 중인 암호화폐를 거래소의 사용자별 수탁형 지갑(Custodial Wallet)으로 전송하는 프로세스입니다. 현재 `DepositForm.tsx`를 분석한 결과, 자산 선택 및 주소 표시 기능이 구현되어 있으나, 멀티 체인 환경을 고려한 **네트워크 선택** 기능의 추가 설계가 필요합니다.

## 2. 사용자 플로우 (User Flow)
1. **자산 선택 (Select Asset):** 입금할 코인(예: BTC, ETH, USDT)을 선택합니다.
2. **네트워크 선택 (Select Network):** 해당 자산을 전송할 블록체인 네트워크를 선택합니다. (신규 추가 필요)
3. **입금 주소 생성/조회:** 선택한 자산 및 네트워크에 맞는 수탁 지갑 주소를 서버로부터 수신합니다.
4. **주소 확인 및 전송:** 사용자는 QR 코드 또는 주소 복사 기능을 통해 외부 지갑에서 입금을 실행합니다.
5. **트랜잭션 감지 및 반영:** 블록체인 상의 컨펌(Confirmation) 수에 도달하면 `AssetList`에 잔고가 반영됩니다.

## 3. 상세 요구사항 (Specifications)

### 3.1 네트워크 지원 정책 (Supported Networks)
기존 코드의 단순 자산 선택을 넘어, 토큰의 경우 전송 네트워크를 명시해야 합니다.
* **BTC:** Bitcoin Network
* **ETH:** Ethereum (ERC-20)
* **USDT:**
    * Ethereum (ERC-20)
    * Tron (TRC-20) - *낮은 수수료로 권장*
    * BSC (BEP-20)

### 3.2 UI/UX 요구사항 (Based on DepositForm.tsx)
* **자산 드롭다운 (Asset Selector):** 기존 코드 유지 (BTC, ETH, USDT).
* **네트워크 셀렉터 (Network Selector):** `DepositForm`에 추가 필요. 자산 선택 시 지원 가능한 네트워크 목록을 필터링하여 보여주어야 함.
    * *예: USDT 선택 시 -> ERC20, TRC20 버튼 노출*
* **주소 표시 (Address Display):**
    * `readonly` 속성 유지.
    * 클립보드 복사 기능 유지 (`navigator.clipboard.writeText`).
    * **QR 코드:** 모바일 입금 편의를 위해 주소 표시 영역 옆에 QR 코드 생성 컴포넌트 추가 권장.
* **주의 사항 (Warning):** "선택한 네트워크(예: ERC-20)로만 전송하세요. 다른 네트워크로 전송 시 자산이 손실될 수 있습니다." 경고 문구 추가.

## 4. 구현 태스크 (Development Tasks)

### Frontend (`src/features/wallet`)
- [ ] **[UI] 네트워크 선택 컴포넌트 추가**: `DepositForm.tsx` 내 `select` 아래에 라디오 버튼 또는 드롭다운으로 네트워크 선택 기능 구현.
- [ ] **[Logic] 입금 주소 API 연동**: 하드코딩된 `bitcoin-deposit-address-example`을 제거하고, 선택된 Asset/Network 조합에 따라 API(`GET /api/wallet/deposit-address`)를 호출하여 실제 주소를 `setAddress` 하도록 변경.
- [ ] **[UI] QR 코드 생성기 구현**: `react-qr-code` 등의 라이브러리를 사용하여 입금 주소를 QR로 변환하여 렌더링.
- [ ] **[UX] 복사 알림 강화**: 현재 클릭 시 별도 피드백이 없음. Toast 메시지("주소가 복사되었습니다") 추가.

// 제미나이//