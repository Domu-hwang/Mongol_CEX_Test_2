# Spot Trading Platform Wireframes

## 1. Login Screen

**Layout Description:**
The login screen will feature a clean, minimalist design focused on user authentication.

*   **Centrally Aligned Card:** A `Card` component (`src/components/ui/Card.tsx`) will be centrally aligned on the page, containing all login elements.
*   **Logo:** The platform's logo will be prominently displayed at the top of the card.
*   **Input Fields:**
    *   **Email/Username:** An `Input` component (`src/components/ui/Input.tsx`) for email or username entry.
    *   **Password:** An `Input` component (`src/components/ui/Input.tsx`) with a masked input type for password entry.
*   **Forgot Password Link:** A subtle text link below the password field allowing users to reset their password.
*   **Login Button:** A prominent `Button` component (`src/components/ui/Button.tsx`) to submit login credentials.
*   **"Don't have an account?" Link:** A text link for new users to navigate to the registration page.

**Functional Requirements:**
*   **Input Validation:** Real-time validation for email/username format and password strength.
*   **Error Handling:** Display clear and concise error messages for invalid credentials, network issues, or other login failures.
*   **Password Visibility Toggle:** An optional icon within the password input field to toggle password visibility.
*   **Session Management:** Upon successful login, the system should establish a secure user session and redirect to the `Trade Chart Dashboard`.

## 2. Header Component

**Layout Description:**
The header will be a sticky top navigation bar, present across all authenticated pages. It is designed to be comprehensive yet clean, providing access to essential market data, navigation, and user actions.

*   **Left Section:**
    *   **Logo:** Prominent platform logo ("Mongol CEX") on the far left, linking to the home/dashboard. Visual styling includes a yellow-colored text and a logo image (`/logo.svg`).
    *   **Primary Navigation (`src/components/layout/Navigation.tsx`):** A horizontal list of main navigation links, now explicitly including "Trade", "Quick Swap", and "Portfolio", as per the latest user feedback. These links are designed to be concise with a subtle hover effect.
    *   **Contextual Trading Links:** Additional dropdown-style buttons such as "Buy Crypto", "Markets", "Earn", "Square", "More", mirroring the high-level options seen in the reference image. The "Trade" dropdown has been removed here as it is now a primary navigation item. These will appear as text buttons with hover effects. *Note: "Futures" is explicitly excluded from the navigation to comply with the 'No Margin, No Futures' constraint.*

*   **Right Section:**
    *   **Utility Icons:** A set of interactive icons for common actions: "Search" (🔍), "Download" (⬇️), "Globe" (🌐 - for language/region selection), "Question Mark" (❓ - for help/support), "Box" (📦 - for notifications or other utilities), and "Moon/Sun" (🌙 - for theme toggle). These are styled as ghost buttons with minimal padding.
    *   **Authentication & Wallet Controls:**
        *   **Wallet Balance Display:** If authenticated, a concise display of the user's total wallet balance (e.g., "Balance: 12345.67 USDT").
        *   **Dynamic "Deposit" CTA:** A prominent "Deposit" button (`src/components/ui/Button.tsx`) in green, visible only if the user's balance is below a predefined threshold.
        *   **Logout Button:** If authenticated, a "Logout" button.
        *   **Login/Sign Up Buttons:** If not authenticated, clearly visible "Log In" (outline variant) and "Sign Up" (primary yellow button) buttons.

**Functional Requirements for Dynamic "Deposit" CTA:**
*   **Visibility Condition:** The "Deposit" button will only be visible if the user's total wallet balance falls below a predefined threshold (e.g., 50 USDT or equivalent).
*   **Click Action:** Clicking the "Deposit" button will trigger a modal or navigate to the `WalletPage.tsx` with the `DepositForm.tsx` active, prompting the user to deposit funds.
*   **Real-time Update:** The visibility of the "Deposit" button should update in real-time based on changes to the user's wallet balance.

## 3. Main Trading View (Trade Chart Dashboard)
*   **Overall Structure:** The left sidebar is removed, and the main trading view now occupies the full width below the header. It will follow a two-column main layout (left for Chart/Order Book/History, right for Order Form/Asset List).

*   **Top Info Bar:**
    *   A prominent bar at the top of the trading view displays the selected trading pair (e.g., "BTC/USDT"), current price, 24-hour price change (absolute and percentage, color-coded), 24-hour high, 24-hour low, and 24-hour volume.
    *   Smaller currency tiles (e.g., "ETH/USDT", "TRX/USDT") are displayed to the right, showing their current change.

*   **Main Content Area (Two Columns):** The area below the top info bar is split into two main columns.

    *   **Left Main Column (Approx. 60% width):** This column houses the primary trading visualization and recent activity.
        *   **Top: Order Book (`src/features/trade/components/OrderBook.tsx`):** A compact, real-time display of buy (bids) and sell (asks) orders, with stacked red and green rows. Includes tabs for "Order Book", "Trading History" (Recent Trades), and "Order History" (User's Open/Filled Orders).
        *   **Bottom: Detailed Candle Chart (`src/features/trade/components/PriceChart.tsx`):** A high-fidelity candlestick chart with:
            *   **Toolbar:** Timeframe selector (e.g., "1m", "15m", "1H"), chart settings (chart type, indicators like MA 7, 25, 99 toggles), external charting options ("Original", "Trading View"), and a depth chart toggle.
            *   **Visuals:** Clear green (up) and red (down) candles, overlaid Moving Average lines, dynamic price and time axes, volume bars, and a current price line. Basic interactive features (hover-for-details, pan/zoom) are included. *Strictly no margin/futures related elements*.

    *   **Right Main Column (Approx. 40% width):** This column is dedicated to market information and order placement.
        *   **Top: Market Price Display:** A concise card-based display of the market price for the selected asset, including the current price, percentage change, and an up/down indicator icon. Includes "Spot" button and a disabled "Margin" button.
        *   **Middle: Order Entry Form (`src/features/trade/components/OrderForm.tsx`):** Allows users to place "Limit", "Market", or "Stop Limit" orders via tabs.
            *   **Buy/Sell Toggle:** Buttons for "Buy" and "Sell" to select the order side.
            *   **Inputs:** Price, Amount, and Total fields (with currency suffixes), which adapt based on the order type (e.g., price input for market orders is read-only).
            *   **Percentage Buttons:** Quick-fill buttons (25%, 50%, 75%, 100%) for amount entry.
            *   **Advanced Options:** Checkboxes for "Take profit" and "Stop loss".
            *   **Balance Display:** Shows available balance for the selected currency.
            *   **Submit Button:** Clearly colored "Buy [Asset]" or "Sell [Asset]" button.
            *   *Strictly no leverage or futures-related UI elements.*
        *   **Bottom: Asset Selection List (`src/features/trade/components/MarketSelector.tsx`):** A card-based list of available spot trading pairs with a search bar and filtering tabs (e.g., "New", "USDC", "USDT"). Columns for Pair Name, Last Price, and 24h Change (%).

**Layout Description:**
The main trading view will be a comprehensive, yet uncluttered, dashboard designed for efficient spot trading. It will follow a three-column layout to optimize data visualization and order execution.

*   **Overall Structure:** The page will be structured using a flexible grid or flexbox system to ensure responsiveness, maintaining clear separation between panels.

*   **Left Panel: Asset Selection List**
    *   **Purpose:** Allow users to quickly select trading pairs.
    *   **Elements:**
        *   **Search Bar:** An `Input` component (`src/components/ui/Input.tsx`) at the top for searching trading pairs (e.g., "BTC/USDT").
        *   **Favorites/Watchlist:** A section to pin frequently traded pairs.
        *   **Categorized List:** A scrollable list of available spot trading pairs (`src/features/trade/components/MarketSelector.tsx`), categorized by base or quote currency, with columns for:
            *   Pair Name (e.g., BTC/USDT)
            *   Last Price
            *   24h Change (%)
            *   24h Volume
    *   **Visual Clarity:** Maintain a compact and readable font size, with clear visual indicators for price changes (e.g., green for up, red for down).

*   **Center Panel: Chart and Trade History**
    *   **Top: Detailed Candle Chart (`src/features/trade/components/PriceChart.tsx`)**
        *   **Purpose:** Provide a high-fidelity, real-time visualization of price action with essential analytical tools.
        *   **Elements:**
            *   **Toolbar:**
                *   **Timeframe Selector:** Prominent buttons (e.g., "1m", "15m", "1H", "4H", "1D", "1W") with active state indication for the selected timeframe.
                *   **Chart Settings & Layout:** Icons for changing chart type (e.g., Candlestick, Line), toggling basic indicators (like MA 7, MA 25, MA 99), and managing chart layout/fullscreen.
                *   **External Charting Options:** Buttons for "Original" and "Trading View" to integrate or switch to external charting solutions (if applicable for spot data only).
                *   **Depth Chart Toggle:** A button to switch to a depth chart visualization.
            *   **Candlestick Chart:** High-fidelity candlestick chart with clear green (up) and red (down) candles. Smooth rendering for real-time price movements.
            *   **Indicator Overlays:** Subtly overlaid Moving Average lines (MA 7, MA 25, MA 99) with distinct colors for easy differentiation.
            *   **Axes:** Clearly labeled Y-axis for price with dynamic scaling, and X-axis for time with human-readable timestamps (e.g., "09:35", "10:00").
            *   **Volume Bars:** Volume bars integrated at the bottom of the chart area, colored green or red to correspond with the candlestick's price movement.
            *   **Current Price Line:** A prominent horizontal line indicating the current market price, extending across the chart for quick visual reference.
            *   **Current Price Display (`src/features/trade/components/PriceDisplay.tsx`):** A compact and highly visible display above the chart showing:
                *   Current price in large, bold font.
                *   24h Change: Absolute value and percentage change (e.g., "+0.045 +5.54%"), with green for positive and red for negative changes.
                *   24h High, 24h Low, and 24h Volume (in both base and quote assets), clearly labeled.
            *   **Interaction:** Interactive elements including hover-for-details on candles and volume bars, and intuitive pan/zoom functionality.
            *   **Design Constraint Adherence:** No leverage, margin, or futures-related UI elements are present. The focus remains strictly on spot trading data visualization with enhanced clarity and essential analytical overlays.
    *   **Bottom: Trade History / Open Orders (`src/features/trade/components/OrderHistory.tsx`)**
        *   **Purpose:** Display user's past trades and current open orders.
        *   **Elements:**
            *   **Tabs (`src/components/ui/Tabs.tsx`):** "Open Orders" and "Trade History".
            *   **Open Orders:**
                *   Table with columns: Pair, Type (Limit/Market), Side (Buy/Sell), Price, Amount, Filled, Total, Status, Cancel (button).
            *   **Trade History:**
                *   Table with columns: Pair, Type, Side, Price, Amount, Total, Date.
        *   **Visual Clarity:** Easily readable tables with clear status indicators.

*   **Right Panel: Order Book and Order Entry Form**
    *   **Top: Real-time Order Book (`src/features/trade/components/OrderBook.tsx`)**
        *   **Purpose:** Display live buy (bids) and sell (asks) orders.
        *   **Elements:**
            *   **Sell Orders (Asks):** Stacked red rows, showing Price, Amount, Total, decreasing from top to bottom.
            *   **Price Spread:** A clear indication of the current price or spread between the best bid and ask.
            *   **Buy Orders (Bids):** Stacked green rows, showing Price, Amount, Total, increasing from bottom to top.
        *   **Real-time Updates:** Continuously streamed data with clear visual cues for new orders or changes.
    *   **Bottom: Order Entry Form (`src/features/trade/components/OrderForm.tsx`)**
        *   **Purpose:** Allow users to place limit or market orders.
        *   **Elements:**
            *   **Tabs (`src/components/ui/Tabs.tsx`):** "Limit" and "Market".
            *   **Limit Order Form:**
                *   **Price Input:** An `Input` component (`src/components/ui/Input.tsx`) for the limit price. Pre-filled with the current best ask (for buy) or bid (for sell).
                *   **Amount Input:** An `Input` component (`src/components/ui/Input.tsx`) for the amount of crypto to buy/sell.
                *   **Total Display:** Read-only display of the calculated total.
                *   **Buy/Sell Buttons:** Distinct `Button` components (`src/components/ui/Button.tsx`) for "Buy" and "Sell", clearly differentiated by color (e.g., green for buy, red for sell).
            *   **Market Order Form:**
                *   **Amount Input:** An `Input` component (`src/components/ui/Input.tsx`) for the amount of crypto to buy/sell.
                *   **Buy/Sell Buttons:** Distinct `Button` components (`src/components/ui/Button.tsx`) for "Buy" and "Sell".
            *   **Available Balance Display:** Show the user's available balance for the selected currency.
            *   **No Leverage/Margin Elements:** Strictly adhere to the design constraint of excluding any margin, leverage, or futures-related UI elements.

**Functional Requirements for Order Entry Form:**
*   **Order Type Selection:** Users can easily toggle between Limit and Market orders using tabs.
*   **Price/Amount Input:**
    *   **Limit Orders:**
        *   Price field should auto-populate with the last traded price or the best bid/ask, but allow manual adjustment.
        *   Amount input should have clear units (e.g., BTC, ETH).
    *   **Market Orders:**
        *   Only amount input is required.
*   **Real-time Calculation:** Dynamically calculate and display the total amount based on price and quantity inputs.
*   **Balance Check:** Prevent order submission if the user's available balance is insufficient. Display an error message.
*   **Confirmation:** A brief confirmation modal or toast message after successful order placement.
*   **Error Handling:** Clear error messages for invalid inputs, insufficient funds, or API errors.
*   **No Advanced Order Types:** Only support Limit and Market orders. Stop-limit, OCO, etc., are out of scope.
