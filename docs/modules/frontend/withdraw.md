# Withdraw.md - 출금 트랜잭션 플로우 설계

## 1. 개요 (Overview)
사용자가 거래소 내 자산을 외부 지갑 주소로 송금하는 프로세스입니다. 현재 `WithdrawForm.tsx`에 기본 폼이 구성되어 있으며, 자산 보호 및 트랜잭션 실패 방지를 위해 **최소 출금액(Minimum Amount)** 검증과 **수수료(Fee)** 계산 로직이 설계에 포함되어야 합니다.

## 2. 사용자 플로우 (User Flow)
1. **자산 및 네트워크 선택:** 출금할 자산과 타겟 네트워크를 선택합니다.
2. **주소 입력:** 받는 사람의 지갑 주소를 입력합니다. (주소 유효성 검증 수행)
3. **수량 입력:** 출금할 수량을 입력합니다. 이때 `보유 잔고`와 `최소 출금액`을 확인합니다.
4. **수수료 확인:** 네트워크 상황에 따른 예상 수수료와 최종 수령액(Total Receive)을 확인합니다.
5. **보안 인증 (2FA):** (추가 권장) 출금 실행 전 OTP 또는 이메일 인증을 수행합니다.
6. **출금 요청:** 요청이 제출되고 서버에서 트랜잭션이 서명되어 브로드캐스팅됩니다.

## 3. 상세 요구사항 (Specifications)

### 3.1 최소 출금액 정책 (Minimum Withdrawal Limits)
네트워크 수수료(Gas Fee)보다 낮은 금액을 출금하는 것을 방지하기 위해 최소 한도를 설정합니다.
* **BTC:** 0.001 BTC
* **ETH:** 0.01 ETH
* **USDT:** 10 USDT

### 3.2 UI/UX 요구사항 (Based on WithdrawForm.tsx)
* **입력 폼 검증 (Validation):**
    * `Amount` 입력 시: `입력값 >= Minimum Amount` 인지 실시간 검사. 실패 시 에러 메시지(예: "최소 10 USDT 이상 출금 가능합니다") 노출.
    * `Address` 입력 시: 정규표현식을 사용하여 코인별 주소 포맷 검증.
* **정보 표시 (Display):**
    * 사용 가능 잔고(Available Balance) 표시 (클릭 시 Max 입력).
    * **네트워크 수수료 (Network Fee):** 예상 수수료 표시.
    * **최종 수령액 (Total Receive):** `입력 수량 - 수수료` 계산값 표시.
* **상태 관리 (UseWallet Hook):** `useWallet.ts`의 `balance`를 참조하여 잔고 부족 시 버튼 비활성화 (`disabled`).

## 4. 구현 태스크 (Development Tasks)

### Frontend (`src/features/wallet`)
- [ ] **[Logic] 유효성 검사 함수 작성**:
    - 자산별 `MIN_WITHDRAW_AMOUNT` 상수 정의.
    - `handleSubmit` 이전에 `amount < MIN_WITHDRAW_AMOUNT` 체크 로직 추가.
- [ ] **[UI] 수수료 및 수령액 계산 UI 추가**: `WithdrawForm.tsx` 내 `Amount` 인풋 하단에 `Fee`와 `You will receive` 정보를 계산하여 보여주는 영역 추가.
- [ ] **[UI] Max 버튼 추가**: 잔고 전액을 한 번에 입력할 수 있는 'Max' 버튼을 Input 컴포넌트 내부에 배치.
- [ ] **[Logic] 주소 유효성 검사**: 선택된 네트워크(BTC/ETH/TRX)에 따라 주소 형식이 올바른지 검사하는 로직(`ethers.js` 등 활용) 추가.
