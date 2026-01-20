-- CEX Pilot - Database Schema

-- 1. Users & Auth
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'suspended'
    role VARCHAR(20) DEFAULT 'user', -- 'user', 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Assets & Balances
CREATE TABLE assets (
    code VARCHAR(10) PRIMARY KEY, -- 'BTC', 'USDT', 'MNT'
    name VARCHAR(100) NOT NULL,
    precision INTEGER DEFAULT 8,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    asset_code VARCHAR(10) NOT NULL REFERENCES assets(code),
    available DECIMAL(32, 16) DEFAULT 0,
    locked DECIMAL(32, 16) DEFAULT 0,
    UNIQUE(user_id, asset_code)
);

-- 3. Markets
CREATE TABLE markets (
    symbol VARCHAR(20) PRIMARY KEY, -- 'BTC-USDT'
    base_asset VARCHAR(10) NOT NULL REFERENCES assets(code),
    quote_asset VARCHAR(10) NOT NULL REFERENCES assets(code),
    min_order_amount DECIMAL(32, 16) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    symbol VARCHAR(20) NOT NULL REFERENCES markets(symbol),
    side VARCHAR(10) NOT NULL, -- 'buy', 'sell'
    type VARCHAR(10) NOT NULL, -- 'market', 'limit'
    price DECIMAL(32, 16),
    amount DECIMAL(32, 16) NOT NULL,
    filled_amount DECIMAL(32, 16) DEFAULT 0,
    average_price DECIMAL(32, 16) DEFAULT 0,
    fee DECIMAL(32, 16) DEFAULT 0,
    status VARCHAR(20) NOT NULL, -- 'open', 'partially_filled', 'filled', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Trades
CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL REFERENCES markets(symbol),
    buyer_order_id UUID NOT NULL REFERENCES orders(id),
    seller_order_id UUID NOT NULL REFERENCES orders(id),
    buyer_user_id UUID NOT NULL REFERENCES users(id),
    seller_user_id UUID NOT NULL REFERENCES users(id),
    price DECIMAL(32, 16) NOT NULL,
    amount DECIMAL(32, 16) NOT NULL,
    side VARCHAR(10) NOT NULL, -- Taker side
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Wallet Transactions (Deposits/Withdrawals)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    asset_code VARCHAR(10) NOT NULL REFERENCES assets(code),
    type VARCHAR(20) NOT NULL, -- 'deposit', 'withdrawal'
    amount DECIMAL(32, 16) NOT NULL,
    fee DECIMAL(32, 16) DEFAULT 0,
    address TEXT,
    tx_hash TEXT,
    status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Audit Logs
CREATE TABLE logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    event VARCHAR(50) NOT NULL,
    metadata JSONB,
    ip_address INET,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_trades_symbol ON trades(symbol);
CREATE INDEX idx_balances_user ON balances(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
