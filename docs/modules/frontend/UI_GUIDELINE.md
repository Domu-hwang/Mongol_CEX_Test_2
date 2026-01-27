# UI Policy & Design Guideline

## 1. 개요
본 문서는 Mongol CEX 프로젝트의 UI 일관성을 유지하기 위한 디자인 원칙과 컴포넌트 사용 규격을 정의합니다. 특히 1차 뎁스와 하위 뎁스 간의 시각적 파편화를 방지하는 것을 목적으로 합니다.

## 2. 컴포넌트 사용 원칙
모든 UI 개발 시 `src/components/ui/`에 정의된 공통 컴포넌트를 최우선으로 사용하며, 인라인 스타일링(Tailwind 임의 클래스)을 지양합니다.

### 2.1 Buttons
용도에 맞는 전용 Variant를 사용해야 합니다.
- **Buy Action:** `<Button variant="buy">` 사용
- **Sell Action:** `<Button variant="sell">` 사용
- **Primary Action:** `<Button variant="default">` 또는 `<Button variant="yellow">`
- **Secondary Action:** `<Button variant="secondary">`

### 2.2 Trade Flow 전용 컴포넌트
Trade Flow 내에서 반복되는 레이아웃이나 요소는 `features/trade/components/shared/`에 정의하여 재사용합니다.
- 공통 데이터 카드: `MarketInfoCard.tsx`
- 공통 액션 버튼: `TradeActionButton.tsx`

## 3. 상태별 디자인 (States)
- **Hover:** 모든 인터랙티브 요소는 `hover:` 프리픽스를 통해 명확한 피드백을 제공합니다.
- **Active:** 클릭 시 `active:scale-[0.98]` 등의 마이크로 인터랙션을 권장합니다.
- **Disabled:** `disabled:opacity-50` 및 `pointer-events-none`을 적용합니다.

## 4. 폴더 구조 전략
비즈니스 로직이 포함된 컴포넌트는 `features/` 하위의 적절한 도메인 내에서 관리하되, 여러 뎁스에서 공유되는 컴포넌트는 `shared/` 폴더를 활용합니다.

```text
src/features/[feature]/
  ├── components/
  │    ├── shared/          <-- 해당 기능 내 여러 뎁스에서 공통 사용
  │    ├── main/            <-- 1차 뎁스 전용
  │    └── detail/          <-- 하위 뎁스 전용
```

## 5. UI Policy 상수 활용

`src/constants/ui-policy.ts`에 정의된 상수를 활용하여 동적 스타일링 시 일관성을 유지합니다.

```typescript
import { TRADE_COLORS, UI_TRANSITIONS, LAYOUT_POLICIES } from "@/constants/ui-policy";

// 색상 적용 예시
const colorClass = side === "buy" ? TRADE_COLORS.BUY : TRADE_COLORS.SELL;

// 트랜지션 적용 예시
className={cn(UI_TRANSITIONS.DEFAULT, UI_TRANSITIONS.HOVER_SCALE)}

// 레이아웃 상수 사용 예시
<aside className={LAYOUT_POLICIES.SIDEBAR_WIDTH}>
```

### 5.1 정의된 상수
- **TRADE_COLORS**: Buy/Sell 관련 배경색 및 텍스트 색상
- **UI_TRANSITIONS**: 공통 트랜지션 및 호버 효과
- **LAYOUT_POLICIES**: 사이드바 너비, 헤더 높이 등 레이아웃 값

## 6. 업데이트 규칙
새로운 UI 패턴이 발생하거나 기존 가이드와 충돌할 경우, Tech Lead와 상의 후 본 문서를 먼저 업데이트하고 코드를 수정합니다.
