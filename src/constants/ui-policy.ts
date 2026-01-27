/**
 * UI Policy Constants
 * Definitions for colors, layouts, and other UI-related policies to maintain consistency across depths.
 */

export const TRADE_COLORS = {
    BUY: "bg-success hover:bg-success/90",
    SELL: "bg-destructive hover:bg-destructive/90",
    DISABLED: "bg-muted cursor-not-allowed opacity-50",
    TEXT_BUY: "text-success",
    TEXT_SELL: "text-destructive",
} as const;

export const UI_TRANSITIONS = {
    DEFAULT: "transition-all duration-200",
    HOVER_SCALE: "hover:scale-[1.02] active:scale-[0.98]",
} as const;

export const LAYOUT_POLICIES = {
    SIDEBAR_WIDTH: "w-64",
    HEADER_HEIGHT: "h-16",
    CARD_RADIUS: "rounded-xl",
} as const;

// =============================================================================
// Trading Dashboard Layout Policy
// =============================================================================

/**
 * UI Policy: Trading Dashboard Layout
 *
 * 이 섹션은 Antigravity 프로젝트의 트레이딩 대시보드 UI 일관성을 유지하기 위한 정책입니다.
 * 모든 UI 업데이트 및 코드 생성 시 아래의 구조와 배치를 엄격히 준수해야 합니다.
 */

// =============================================================================
// 1. 전역 레이아웃 구조 (Global Layout Hierarchy)
// =============================================================================

/**
 * 대시보드는 크게 상단 헤더(Header & Info)와 메인 콘텐츠 구역(Main Body)으로 나뉩니다.
 *
 * A. 상단 영역 (Top Section)
 *    - Header: 최상단에 위치하며 전체 네비게이션 및 시스템 설정을 포함
 *    - Token Info Bar: 헤더 직하단에 위치
 *      - Left: Token Name (현재 선택된 자산 명칭)
 *      - Right: 24h Change Info (가격 변동률, 고가, 저가, 거래량 등)
 */

export const TRADE_LAYOUT_STRUCTURE = {
    TOP_SECTION: {
        HEADER: 'header',
        TOKEN_INFO_BAR: 'tokenInfoBar',
    },
    MAIN_BODY: {
        COLUMN_1: 'market',
        COLUMN_2_UPPER: 'chart',
        COLUMN_2_LOWER: 'orderHistory',
        COLUMN_3: 'orderBook',
        COLUMN_4: 'orderForm',
    },
} as const;

// =============================================================================
// 2. 메인 콘텐츠 그리드 배치 (Main Body Grid)
// =============================================================================

/**
 * 메인 콘텐츠 구역은 좌측부터 우측으로 총 4개의 수직 컬럼 구조를 기본으로 합니다.
 *
 * Column 1: Market Navigation (Left)
 *   - 컴포넌트: Search Bar + Market Pair List
 *   - 정책: 사용자가 시장을 탐색하고 선택하는 영역으로, 좌측 끝에 고정
 *
 * Column 2: Analysis & History (Center-Left)
 *   - Upper (Chart): Tab Menu (Chart, Info, Trading Data) + Main Chart 영역
 *   - Lower (Order History): 하단에 Order History (실시간 체결 내역 또는 개인 주문 내역) 배치
 *
 * Column 3: Order Book (Center-Right)
 *   - 컴포넌트: Order Book
 *   - 정책: 매수/매도 잔량을 시각화하며, 차트와 주문서 사이에 위치
 *
 * Column 4: Execution (Right)
 *   - 컴포넌트: Order Form
 *   - 정책: 매수/매도 주문 입력창. 우측 끝에 배치하여 사용자의 시선 흐름의 마지막에 위치
 *   - 시선 흐름: 탐색 -> 분석 -> 판단 -> 실행
 */

export const TRADE_GRID_COLUMNS = {
    COLUMN_1_MARKET: {
        name: 'Market Navigation',
        position: 'left',
        components: ['SearchBar', 'MarketPairList'],
        gridArea: 'market',
    },
    COLUMN_2_ANALYSIS: {
        name: 'Analysis & History',
        position: 'center-left',
        upper: {
            name: 'Chart Area',
            components: ['TabMenu', 'MainChart'],
            tabs: ['Chart', 'Info', 'Trading Data'],
            gridArea: 'chart',
        },
        lower: {
            name: 'Order History',
            components: ['OrderHistory', 'RecentTrades'],
            gridArea: 'orderHistory',
        },
    },
    COLUMN_3_ORDERBOOK: {
        name: 'Order Book',
        position: 'center-right',
        components: ['OrderBook'],
        gridArea: 'orderBook',
    },
    COLUMN_4_EXECUTION: {
        name: 'Execution',
        position: 'right',
        components: ['OrderForm'],
        gridArea: 'orderForm',
    },
} as const;

// =============================================================================
// 3. 그리드 템플릿 설정 (Grid Template Configuration)
// =============================================================================

export const TRADE_DESKTOP_GRID_CONFIG = {
    gridTemplateColumns: '1.2fr 2fr 1fr 1.2fr',
    gridTemplateRows: '0.6fr 0.4fr',
    gridTemplateAreas: `
        "market chart orderbook orderform"
        "market orderhistory orderbook orderform"
    `,
    gap: '4px', // gap-1 in Tailwind
} as const;

export const TRADE_MOBILE_GRID_CONFIG = {
    layout: 'single-column',
    tabs: ['Chart', 'Order Book', 'Trade', 'Info'],
    bottomCTA: ['Buy', 'Sell'],
} as const;

// =============================================================================
// 4. UI 업데이트 시 준수 원칙 (Design Principles)
// =============================================================================

/**
 * 1. Fixed Architecture
 *    새로운 기능을 추가하더라도 4개 컬럼의 순서와 역할은 변경하지 않습니다.
 *
 * 2. Tabbed Interface
 *    Column 2의 차트 영역처럼 정보량이 많아질 경우,
 *    레이아웃을 깨뜨리지 말고 Tab 기능을 활용하여 내부 콘텐츠만 교체합니다.
 *
 * 3. Responsive Alignment
 *    화면 크기에 따라 각 컬럼의 너비는 조정될 수 있으나,
 *    Market Pair(좌) - Chart(중) - Order Form(우)의 상대적 위치는 고정합니다.
 *
 * 4. Consistency
 *    모든 컴포넌트 사이의 간격(Gutter)과 패딩은 일관된 수치를 유지합니다.
 */

export const TRADE_DESIGN_PRINCIPLES = {
    FIXED_ARCHITECTURE: '4개 컬럼의 순서와 역할 변경 금지',
    TABBED_INTERFACE: '정보량 증가 시 Tab 활용, 레이아웃 유지',
    RESPONSIVE_ALIGNMENT: 'Market(좌) - Chart(중) - OrderForm(우) 위치 고정',
    CONSISTENCY: '컴포넌트 간격 및 패딩 일관성 유지',
} as const;

// =============================================================================
// 5. 컴포넌트 스타일 상수 (Component Style Constants)
// =============================================================================

export const TRADE_COMPONENT_STYLES = {
    CARD: {
        base: 'rounded-none border-border overflow-hidden flex flex-col',
        header: 'p-2 border-b border-border font-semibold text-xs text-muted-foreground uppercase',
    },
    TABS: {
        list: 'grid w-full rounded-none bg-transparent border-b border-border p-0 h-10',
        trigger: 'rounded-none h-full data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary',
        content: 'flex-1 overflow-hidden mt-0',
    },
    SPACING: {
        gap: 'gap-1',
        padding: 'p-1',
    },
} as const;

// =============================================================================
// 6. AI 개발 지침 (AI Implementation Guidance)
// =============================================================================

/**
 * AI는 새로운 UI 코드를 생성하거나 수정할 때 다음 프롬프트를 우선 고려해야 합니다:
 *
 * "Antigravity UI Policy에 따라, [Market Pair | Chart/History | Order Book | Order Form]의
 *  4컬럼 레이아웃을 유지하며 작업을 수행할 것."
 *
 * 주요 체크리스트:
 * - [ ] 4컬럼 구조가 유지되는가?
 * - [ ] 컬럼 순서가 올바른가? (Market -> Chart/History -> OrderBook -> OrderForm)
 * - [ ] 새 기능 추가 시 Tab을 활용했는가?
 * - [ ] 반응형에서도 상대적 위치가 유지되는가?
 * - [ ] 간격과 패딩이 일관적인가?
 */

export const TRADE_AI_CHECKLIST = [
    '4컬럼 구조 유지 확인',
    '컬럼 순서 확인: Market -> Chart/History -> OrderBook -> OrderForm',
    '새 기능 추가 시 Tab 활용 여부',
    '반응형 상대적 위치 유지',
    '간격 및 패딩 일관성',
] as const;

// =============================================================================
// 7. 컬럼 너비 비율 (Column Width Ratios)
// =============================================================================

export const TRADE_COLUMN_RATIOS = {
    MARKET: 1.2,      // Column 1
    CHART: 2,         // Column 2 (Upper + Lower)
    ORDERBOOK: 1.2,   // Column 3
    ORDERFORM: 1,     // Column 4
} as const;

// Type exports for TypeScript support
export type TradeLayoutStructure = typeof TRADE_LAYOUT_STRUCTURE;
export type TradeGridColumns = typeof TRADE_GRID_COLUMNS;
export type TradeDesignPrinciples = typeof TRADE_DESIGN_PRINCIPLES;
