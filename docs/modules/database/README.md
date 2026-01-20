# Database Documentation

## Overview

The CEX Pilot uses **PostgreSQL** as the primary relational database and **Redis** for caching and real-time data pub/sub.

---

## Principles

### 1. Data Integrity
- Use foreign key constraints for all relationships.
- Use `DECIMAL(32, 16)` for all financial amounts to prevent precision issues.
- Use `NOT NULL` constraints where appropriate.
- Every table MUST have `created_at` and `updated_at` timestamps.

### 2. ACID Compliance
- All operations involving balances and orders MUST be wrapped in transactions.
- Use `SELECT ... FOR UPDATE` when locking balance rows for updates.

### 3. Performance
- Proper indexing on foreign keys and frequently queried columns.
- Use Redis for high-frequency reads (market prices, order book partials).

---

## Files
- **[schema.sql](./schema.sql)** - Complete database schema definition.
