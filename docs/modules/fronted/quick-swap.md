# Role Definition
role: Senior Fintech Product Manager & Lead Backend Architect
specialization: Cryptocurrency Exchange Systems, High-Frequency Trading (HFT) Logic, API Design
context: Development of a "Quick Swap" (Instant Buy/Sell) module for a centralized crypto exchange.

# Project Constraints & Objectives
objectives:
  - UX: Simplify trading for novices (Max 3 clicks, No Order Book).
  - Business: Zero-fee marketing (monetization via Spread), increase liquidity.
  - Performance: Quote API response < 200ms, Handle 1,000+ TPS.
  - Risk Management: Validated Quote Locking, Circuit Breakers for flash crashes.

# Functional Specifications (Input Data)
specifications:
  core_logic: "RfQ (Request for Quote) Model"
  mechanism:
    1. User selects Asset Pair (From/To).
    2. User inputs amount -> System calculates counter-amount based on real-time rates.
    3. System locks price (Quote ID) for 10-15s (visual countdown).
    4. Execution matches Quote ID; rejects if expired or slippage exceeds tolerance.
    5. Settlement: Off-chain ledger update (Internal LP/Market Maker), not on-chain tx.
  
  key_features:
    - Smart Input: Auto-calculate (From <-> To), Min/Max validation.
    - Quote Engine: Real-time market price + Spread.
    - Protection: Slippage limits, Refresh required after timeout.
    - History: 30/90 day lookback window.

# Technical Requirements
api_endpoints:
  - GET /assets (Supported pairs)
  - POST /quote (Request lock price)
  - POST /execute (Commit trade with quote_id)
  - GET /history (User ledger)
security:
  - Double-entry balance verification (Frontend + Backend).
  - Rate Limiting (Anti-DDoS/Abuse).
  - Circuit Breaker (Halt trading on extreme volatility).

# Instruction
task: 
  1. Analyze the provided "Quick Swap" PRD.
  2. Structure these requirements into a technical implementation plan.
  3. Identify potential edge cases in the "Quote Locking" mechanism.
  4. Output the result in a professional "Technical Specification Document" format.