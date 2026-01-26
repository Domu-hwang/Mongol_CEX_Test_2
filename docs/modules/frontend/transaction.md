wallet.md와 연결되는 플로우입니다. 
해당 페이지에서부터 플로우가 시작됩니다. 

---

# PRD: Wallet Transaction Flow (Add Fund & Take Out)

| 항목 | 내용 |
| --- | --- |
| **문서 버전** | v1.0 |
| **작성 일자** | 2026-01-26 |
| **타겟 플랫폼** | Web / Mobile App (Frontend) |
| **선행 조건** | 유저가 지갑 내 Asset 목록에서 특정 토큰(예: USDT)을 이미 선택한 상태 |

---

## 1. 개요 (Overview)

유저가 특정 암호화폐(Token)를 선택했을 때 제공되는 두 가지 핵심 트랜잭션(입금, 출금)에 대한 프론트엔드 요구사항을 정의합니다.

* **Add Fund (Deposit):** 외부 지갑  거래소 지갑으로 자산 이동
* **Take Out (Withdraw):** 거래소 지갑  외부 지갑으로 자산 이동

---

## 2. 상세 기능 명세: Add Fund (Deposit)

외부 자산을 거래소 내부로 가져오는 화면입니다. 오입금을 방지하기 위한 명확한 네트워크 선택과 주소 노출이 핵심입니다.

### 2.1 UI 구조 및 컴포넌트

| 순서 | 컴포넌트 (Component) | 속성 및 상세 설명 (Specs) |
| --- | --- | --- |
| **1** | **Network Selector** | • 형태: Dropdown 또는 Radio Tab<br>

<br>• 옵션: Ethereum (ERC20), Polkadot, Tron (TRC20)<br>

<br>• **Default:** 선택 안 됨 (유저의 능동적 선택 유도 권장) |
| **2** | **QR Code Area** | • 위치: 화면 상단 (네트워크 선택 시 생성)<br>

<br>• 기능: 스캔 시 주소 정보 전달 |
| **3** | **Address Display** | • 형태: Read-only Input Field<br>

<br>• 내용: 백엔드에서 생성된 입금 주소 표시 |
| **4** | **Copy Button** | • 위치: Address 주소 옆 아이콘 또는 버튼<br>

<br>• Action: 클립보드 복사 |
| **5** | **More Details (Toggle)** | • 형태: Text Button ("More details")<br>

<br>• 초기 상태: Collapsed (닫힘) |
| **6** | **Meta Info (Hidden)** | • 위치: More details 클릭 시 하단에 펼쳐짐<br>

<br>• 내용:<br>

<br> 1. Minimum deposit:  USDT<br>

<br> 2. Warning: "Don't send NFT to this address." (Font-size: 10pt, Color: Gray/Red) |

### 2.2 인터랙션 및 로직 (User Flow & Logic)

1. **네트워크 선택 (Network Selection):**
* 유저가 네트워크(ETH, DOT, TRX)를 선택하기 전까지 QR 코드와 주소 영역은 `Loading` 혹은 `Empty` 상태여야 합니다.
* 네트워크 변경 시, 즉시 새로운 주소와 QR 코드를 다시 렌더링(Re-render) 합니다.


2. **주소 복사 (Copy Action):**
* 복사 버튼 클릭 시 시스템 클립보드에 주소 문자열을 저장합니다.
* **Feedback:** 화면 하단 또는 상단에 Toast Message 출력.
* **Text:** `"Address is copied!"` (3초 후 자동 사라짐)


3. **정보 노출 (Expansion):**
* "More details" 클릭 시 아코디언 형태로 하단 메타 정보가 부드럽게(Transition) 열려야 합니다.



---

## 3. 상세 기능 명세: Take Out (Withdraw)

거래소 자산을 외부로 내보내는 화면입니다. 가용 자산 확인과 수수료 계산, 오출금 방지 경고가 중요합니다.

### 3.1 UI 구조 및 컴포넌트

| 순서 | 컴포넌트 (Component) | 속성 및 상세 설명 (Specs) |
| --- | --- | --- |
| **1** | **Address Input** | • 형태: Text Input Box<br>

<br>• Placeholder: "Paste address" |
| **2** | **Network Selector** | • 형태: Dropdown<br>

<br>• 옵션: Ethereum, Polkadot, Tron<br>

<br>• *참고: 주소 입력 후 네트워크 자동 매칭 기능이 있다면 좋으나, 본 기획에서는 수동 선택을 기준으로 함.* |
| **3** | **Withdrawal Amount** | • 형태: Number Input<br>

<br>• Placeholder: `"Minimum {n} {Token Name}"`<br>

<br>• 우측에 "Max" 버튼 배치 권장 (전액 입력 편의성) |
| **4** | **Balance Info** | • 위치: Amount Input 바로 아래<br>

<br>• 텍스트:<br>

<br> - `Available: {n} USDT`<br>

<br> - `Unavailable: {n} USDT` (Color: Grey) |
| **5** | **Warning Notice** | • 스타일: 10pt-12pt 작은 글씨, 가독성 있는 경고색<br>

<br>• 텍스트: *"Do not withdraw directly to crowdfund or ICO. We will not credit your account with tokens from that sale."* |
| **6** | **Confirmation Section** | • 위치: CTA 버튼 바로 위 (Summary Card 형태)<br>

<br>• 항목:<br>

<br> 1. **Receive Amount:** `{입력값 - 수수료}` USDT<br>

<br> 2. **Network Fee:** `{Fee}` USDT |
| **7** | **CTA Button** | • 텍스트: **"Withdraw"**<br>

<br>• 상태: 초기 `Disabled`, 모든 유효성 검사 통과 시 `Active` |

### 3.2 인터랙션 및 로직 (User Flow & Logic)

1. **입력 유효성 검사 (Validation):**
* **Address:** 선택한 네트워크 형식에 맞지 않는 주소 입력 시 에러 문구 노출.
* **Amount:**
* 입력값 < Minimum Amount 일 경우: 에러 메시지 (Placeholder 내용과 동일).
* 입력값 > Available Balance 일 경우: "Insufficient balance" 에러.




2. **실시간 계산 (Real-time Calculation):**
* 네트워크 선택 시 해당 네트워크의 `Network Fee`를 불러옵니다.
* Amount 입력 시 `Receive Amount`를 즉시 계산하여 업데이트합니다.
* 
* 만약 `Input Amount <= Network Fee`라면 Receive Amount는 0으로 표시하고 출금을 막아야 합니다.


3. **제출 (Submission):**
* Withdraw 버튼 클릭 시 최종 확인 팝업(혹은 2FA 인증 화면)으로 이동합니다. (본 문서 범위 외이나 연결점 명시)



---

## 4. 예외 처리 (Edge Cases)

* **API Error:** 네트워크 수수료 정보를 불러오지 못하거나 주소 생성 실패 시.
* *Action:* Toast Message "Failed to load network info. Please try again." 노출 및 CTA 비활성화.


* **Zero Balance:** 출금 가능한 잔액(Available)이 0인 경우.
* *Action:* 출금 탭 진입 시 Amount Input 비활성화 혹은 툴팁 안내.


* **Maintenance:** 특정 네트워크(예: Solana, Tron)가 점검 중인 경우.
* *Action:* 네트워크 선택지에서 `Disabled` 처리하고 "Suspended for maintenance" 태그 표시.



---

### 💡 작성자를 위한 다음 단계 (Next Step)

이 PRD를 바탕으로 개발자가 바로 작업을 시작할 수 있도록 **상태 관리(State Management) 로직**을 더 구체화해 드릴까요?
(예: `handleNetworkChange`, `calculateReceiveAmount` 등의 함수 로직 명세).
