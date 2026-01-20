# CEX Pilot - Project Context & Constraints

## 1. Document Role

This document defines the **global context, scope boundaries, and design guardrails** for a Pilot Centralized Crypto Exchange (CEX) project targeting the Mongolian market.

This serves as a **top-level control document** that establishes:
- Project objectives and limitations
- Technology stack decisions
- Scope boundaries (what's in, what's out)
- Security and compliance baseline

All project artifacts (PRD, modules, code) must strictly align with the assumptions and constraints defined here.

---

## 2. Project Overview

### 2.1 Mission
Deliver a **Pilot-grade centralized crypto exchange web platform** for the Mongolian market.

### 2.2 Market Context
The Mongolian market shows active digital asset trading demand but lacks platforms with sufficient:
- Technical stability
- Operational reliability
- Regulatory readiness

### 2.3 Pilot Objectives
- Validate real-user exchange usage in the Mongolian environment
- Verify system stability, security, and operational fit
- Collect regulatory and operational evidence
- Enable transition to long-term partnership upon Pilot success

---

## 3. Technology Stack

### 3.1 Core Technologies
- **Frontend**: React + Tailwind CSS
- **Architecture**: Mobile-first responsive design
- **Future Path**: Compatible with mobile app (WebView or native wrapper)

### 3.2 Design Principles
- Mobile-first UX as default
- Clear separation of concerns (Trade / Wallet / Account / Admin)
- State and routing structure designed for Web → App expansion
- UX benchmarked against major global CEXs (Binance-class), simplified for Pilot scale
- All features must be **extendable**, but only Pilot-scope functionality is implemented

---

## 4. Project Scope

### 4.1 Included Scope (Pilot Phase)

**Core Exchange Engine**
- Order management
- Matching engine
- Balance management

**User Features**
- Account management and authentication
- Asset deposits and withdrawals (simulated or limited real transactions)

**Admin Features**
- Admin console
- Logging, monitoring, and basic incident response

**Marketing**
- Project branding website (home, service overview)

---

### 4.2 Excluded Scope

The following are explicitly **out of scope** for the Pilot:

**Infrastructure**
- Large-scale auto-scaling for high traffic
- High-frequency trading (HFT) optimization

**Advanced Features**
- Derivative products (futures, options, etc.)
- Automated trading, copy trading, or social trading
- Full localization and branding customization

**Integration**
- Direct bank account integration
- Real-name banking APIs

---

## 5. Security & Compliance (Pilot Level)

### 5.1 Included (Design-Level or Limited Implementation)

**Authentication & Access Control**
- User authentication structure
- Admin role separation and permission levels

**Audit & Logging**
- Critical event logging (Login, Orders, Withdrawals, Admin actions)
- Data structures designed for future audit and compliance extension

**Regulatory Framework**
- KYC / AML flows defined at **structure level only** (full enforcement excluded)

### 5.2 Excluded

- Full regulatory automation
- Jurisdiction-specific reporting engines
- Advanced fraud detection systems

---

## 6. Document Usage Rules

- This document is **not descriptive marketing content**
- It defines constraints and boundaries for product and system design
- All subsequent documents must:
  - Avoid scope expansion
  - Respect Pilot limitations
  - Use implementation-oriented language

---

## 7. Related Documents

- `cex-pilot-skill.md` - Build guidelines and implementation patterns
- `core_prd.md` - Feature requirements and user flows
- `modules.md` - Module decomposition and responsibilities

---

**This document acts as the constitutional baseline for the CEX Pilot project.**
