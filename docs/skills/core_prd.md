# Core PRD – CEX Pilot (Mongolia) - Web-First Edition

## 1. Document Purpose

This document defines the **functional requirements and user experience** for the Pilot Centralized Crypto Exchange (CEX) platform, shifting focus from mobile-first to a **premium web-first experience** modeled after industry leaders like Binance.

**Key Objectives:**
- High-fidelity web interface with a professional dark theme.
- Dynamic onboarding flow based on regional compliance (Residence/Nationality).
- Seamless transition from account creation to full KYC.

---

## 2. Design Philosophy (Binance-Style)

### 2.1 Visual Identity
- **Color Palette:**
  - Background: Deep Charcoals and Blacks (#0b0e11, #181a20).
  - Primary Action: Binance Yellow (#fcd535) for high-contrast CTAs.
  - Success/Danger: Emerald Green and Rose Red for trading signals.
- **Typography:** Modern, legible sans-serif (Inter, Roboto).
- **Surface:** Glassmorphism and subtle gradients for a premium feel.

### 2.2 Layout Strategy
- **Web-First:** Optimized for 1440px+ desktops while maintaining responsive behavior for tablets and mobiles.
- **Focused Tasks:** Centered card layouts for Auth/KYC to reduce visual noise.
- **Trading Console:** Multi-pane dashboard for simultaneous price, chart, and order book viewing.

---

## 3. Integrated Onboarding Flow

The onboarding module follows a **Policy-Based Dynamic Workflow**, as defined in `onboarding-spec.md`.

### 3.1 Flow Overview
1.  **Account Creation (Level 0):** Email/Phone -> OTP -> Password.
2.  **Basic KYC (Level 1):** Residence -> Personal Info -> ID Upload.
3.  **Conditional Path (Policy-Driven):**
    - **Standard:** Move to review.
    - **Regulated (EU, UK, etc.):** Forced Address Verification (POA).
4.  **Advanced KYC (Level 2):** Liveness detection and further verification to unlock all limits.

---

## 4. User Personas (Updated)

### 4.1 Professional Trader (Bat-Orshikh)
- **Profile:** 32, Financial Analyst in Ulaanbaatar.
- **Goal:** Execute high-volume trades on a stable, professional web platform.
- **Need:** Real-time data, complex order types, and a clean "Pro" interface.

---

## 5. Feature Specifications

### 5.1 Account & Auth (Web)
- **FR-AUTH-001 (Register):** Multi-step centered card.
  - Step 1: Account Type selection (Individual/Entity).
  - Step 2: Credentials (Email/Phone).
  - Step 3: Security Verification (OTP).
- **FR-AUTH-002 (Login):** QR Code login option (future) + traditional credentials.

### 5.2 Dynamic KYC Module
- **FR-KYC-001 (Dynamic Stepper):** Navigation adjust based on `residenceCountry`.
- **FR-KYC-002 (Age Verification):** Hard block for <18 years old.
- **FR-KYC-003 (Document Intelligence):** Display documentation requirements based on nationality.

### 5.3 Quick Swap

- **URL**: `/account/quick-swap`
- **화면명**: 빠른 교환 (즉시 환전)
- **주요 기능**:
    - From/To 통화 선택
    - 간편한 2-필드 폼
    - 현재 지갑 잔액 표시
    - 즉시 환전 실행

### 5.4 Wallet Module (지갑)

### Wallet Page

- **URL**: `/account/wallet`
- **화면명**: 지갑 대시보드
- **주요 기능**:
    - 암호화폐 잔액 목록 (USDT, BTC, ETH 등)
    - 액션 버튼:
        - **Deposit** (입금)
        - **Withdrawal** (출금)
        - **History** (거래 내역)
    - 최근 거래 내역 섹션

### 5.5 Trading Terminal (Web)
- **FR-TRADE-001 (Advanced Dashboard):** 
  - Integrated charts (TradingView style).
  - Real-time Order Book with depth visualization.
  - Instant toggle between Market and Limit orders.

---

## 6. Success Metrics (Web)
- **First Trade Time:** < 5 minutes for Level 0/1 users.
- **UI Consistency:** 100% adherence to the Dark Theme design system.
- **Compliance Accuracy:** Correct routing of EU/UK users to POA steps.
