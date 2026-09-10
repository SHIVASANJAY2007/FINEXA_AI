export const COURSES = [
  {
    id: 'foundations-finance',
    title: 'Foundations of Personal Finance',
    category: 'Personal Finance',
    level: 'Beginner',
    readTime: '15 min',
    rewardXP: 100,
    badge: 'Money Architect',
    badgeIcon: '🏛️',
    badgeImg: '/badges/badge_money_architect.png',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    colorClass: 'text-burgundy',
    bgClass: 'bg-burgundy',
    borderClass: 'border-burgundy/30',
    description: 'Master the core mechanics of personal money management, budgeting frameworks, and the exponential magic of compound interest.',
    lessons: [
      {
        id: 'f1',
        title: '1. The Magic of Compound Interest',
        subtitle: 'Why time in the market beats timing the market',
        content: `Compound interest is often called the eighth wonder of the world. Unlike simple interest, which pays interest only on your principal, compound interest pays interest on your original principal PLUS all cumulative interest earned.

### The Mathematical Formula:
$$A = P \\left(1 + \\frac{r}{n}\\right)^{nt}$$

- **A** = Final balance
- **P** = Initial Principal
- **r** = Annual interest rate
- **n** = Compounding frequency per year
- **t** = Time in years

### Real-World Example:
If you invest **$100 per month** at an average annual return of **8%**:
- After 10 years: ~$18,294 (You invested $12,000; earned $6,294 in growth)
- After 30 years: ~$149,035 (You invested $36,000; earned $113,035 in growth!)

Notice how over 75% of your total wealth at Year 30 comes purely from compounding gains.`,
        keyTakeaway: 'Start early. Even small monthly contributions compound into significant wealth over multi-year time horizons.'
      },
      {
        id: 'f2',
        title: '2. The 50/30/20 Budgeting Matrix',
        subtitle: 'A simple framework for financial freedom',
        content: `Managing your cash flow doesn\'t require complex spreadsheets. The **50/30/20 Rule** provides an intuitive division of your net (after-tax) income:

- **50% Needs**: Essential survival expenses (Housing, utilities, basic groceries, insurance, minimum debt payments).
- **30% Wants**: Lifestyle choices (Dining out, streaming services, travel, hobbies).
- **20% Savings & Debt Repayments**: Wealth building (Emergency fund, index funds, retirement accounts, paying down high-interest loans).

### Automation Strategy:
Set up automated bank transfers on payday. Automatically route 20% directly into your investment account before you have the chance to spend it. This practice is known as **Paying Yourself First**.`,
        keyTakeaway: 'Automate your 20% savings first. Never spend what is left after saving; save what is left after spending.'
      },
      {
        id: 'f3',
        title: '3. Emergency Funds & Inflation Defense',
        subtitle: 'Protecting your wealth against unforeseen events',
        content: `An **Emergency Fund** is liquid capital reserved exclusively for unplanned financial shocks (job loss, medical emergencies, sudden car repairs).

- **Recommended Size**: 3 to 6 months of living expenses.
- **Where to Store**: High-Yield Savings Accounts (HYSA) or liquid money market funds—NEVER volatile stocks or illiquid real estate.

### Fighting Inflation:
Holding cash in a zero-interest checking account causes purchasing power to erode by ~3-4% annually due to inflation. Always keep emergency reserves in yield-generating liquid accounts while deploying excess funds into productive growth assets.`,
        keyTakeaway: 'An emergency fund gives you psychological leverage and prevents you from liquidating long-term investments during market pullbacks.'
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is the primary difference between simple interest and compound interest?',
        options: [
          'Simple interest compounds monthly, while compound interest compounds yearly.',
          'Compound interest earns interest on both the principal and previously earned interest.',
          'Simple interest offers higher returns over long periods of time.',
          'There is no functional difference between the two.'
        ],
        correctAnswer: 1,
        explanation: 'Compound interest generates returns on accumulated past interest, leading to exponential growth over time.'
      },
      {
        id: 'q2',
        question: 'In the 50/30/20 budgeting rule, what does the 20% allocation represent?',
        options: [
          'Housing, utilities, and essential groceries',
          'Entertainment, dining out, and hobbies',
          'Savings, emergency funds, and investment growth',
          'Taxes and mandatory insurance payments'
        ],
        correctAnswer: 2,
        explanation: 'The 20% portion is dedicated strictly to savings, debt payoff, and long-term investments.'
      },
      {
        id: 'q3',
        question: 'Where is the ideal location to store a 3-to-6 month Emergency Fund?',
        options: [
          'In high-volatility cryptocurrency tokens for maximum upside',
          'In a High-Yield Savings Account (HYSA) or liquid money market fund',
          'Locked in a 5-year illiquid real estate investment',
          'Underneath your mattress in physical cash'
        ],
        correctAnswer: 1,
        explanation: 'Emergency funds must remain safe, liquid, and accessible immediately without capital loss risk.'
      }
    ]
  },
  {
    id: 'stock-markets-101',
    title: 'Intro to Stock Markets & Equities',
    category: 'Investing',
    level: 'Beginner',
    readTime: '20 min',
    rewardXP: 150,
    badge: 'Wall St Titan',
    badgeIcon: '📈',
    badgeImg: '/badges/badge_wallst_titan.png',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
    colorClass: 'text-teal',
    bgClass: 'bg-teal',
    borderClass: 'border-teal/30',
    description: 'Understand how public stock exchanges operate, how equity pricing works, and how to evaluate business fundamentals.',
    lessons: [
      {
        id: 's1',
        title: '1. What is a Stock & How Markets Work',
        subtitle: 'Buying fractional ownership in real businesses',
        content: `When you buy a share of stock in a public company (like Apple, Microsoft, or Tesla), you acquire **fractional equity ownership** in that enterprise.

### Key Terminology:
- **Market Capitalization**: Total value of all outstanding shares.
  $$\\text{Market Cap} = \\text{Total Share Count} \\times \\text{Current Stock Price}$$
- **Primary Market**: Where companies issue new shares via Initial Public Offerings (IPOs) to raise capital.
- **Secondary Market**: Exchanges (NYSE, NASDAQ) where investors buy and sell existing shares to one another.

Stock prices move based on the continuous equilibrium between **Supply and Demand**. If buyer demand exceeds seller supply, the share price rises.`,
        keyTakeaway: 'Stocks aren\'t ticker symbols—they represent actual fractional ownership of cash-generating companies.'
      },
      {
        id: 's2',
        title: '2. Dividends vs Growth Investing',
        subtitle: 'Two distinct pathways to equity returns',
        content: `Investors generate financial returns through two primary mechanisms:

### 1. Capital Appreciation (Growth)
Companies reinvest 100% of profits back into expansion, R&D, and acquisitions. Investors profit when company valuation grows over time.
- *Examples*: High-growth tech companies, early-stage innovators.

### 2. Dividend Income
Mature, highly profitable companies distribute excess cash directly to shareholders on a quarterly basis.
- **Dividend Yield**: Annual dividend per share divided by current share price.
- **DRIP (Dividend Reinvestment Plan)**: Automatically buying additional fractional shares using dividend payouts to compound holdings.`,
        keyTakeaway: 'Combine growth stocks for capital expansion with dividend payers for cash flow resilience.'
      },
      {
        id: 's3',
        title: '3. Index Funds & Broad Diversification',
        subtitle: 'Eliminating single-company risk effortlessly',
        content: `Picking individual winning stocks requires extensive financial analysis. **Index Funds and ETFs** (Exchange Traded Funds) allow investors to purchase hundreds of companies in a single basket.

### The S&P 500 Benchmark:
The S&P 500 tracks the 500 largest publicly traded US corporations. Historically, the S&P 500 has delivered an average annual return of **~10%** over multi-decade periods.

- **Low Expense Ratios**: Top index funds charge less than 0.05% in annual management fees.
- **Instant Diversification**: If one company in the index fails, it is replaced automatically without damaging your entire portfolio.`,
        keyTakeaway: 'Indexing allows you to own the entire market engine instead of gambling on individual stock picks.'
      }
    ],
    quiz: [
      {
        id: 'sq1',
        question: 'How is a company’s Market Capitalization calculated?',
        options: [
          'Annual revenue multiplied by net profits',
          'Total outstanding shares multiplied by current share price',
          'Total assets minus liabilities on the balance sheet',
          'Average trading volume multiplied by dividend yield'
        ],
        correctAnswer: 1,
        explanation: 'Market Cap equals the current market price per share multiplied by the total number of shares outstanding.'
      },
      {
        id: 'sq2',
        question: 'What is a Dividend Reinvestment Plan (DRIP)?',
        options: [
          'Selling your stock whenever dividends are announced',
          'Automatically using cash dividends to purchase additional shares',
          'Investing dividends into high-risk option contracts',
          'Using dividends to pay management fees'
        ],
        correctAnswer: 1,
        explanation: 'DRIP automatically reinvests cash dividends back into the stock, accelerating compound share growth.'
      },
      {
        id: 'sq3',
        question: 'Why do financial advisors recommend S&P 500 Index Funds for long-term investors?',
        options: [
          'They guarantee 50% returns every single year without exception',
          'They offer instant diversification across 500 major companies at very low fees',
          'They eliminate tax obligations on all capital gains',
          'They are exempt from general stock market downturns'
        ],
        correctAnswer: 1,
        explanation: 'Index funds provide broad diversification across top companies with minimal expense fees.'
      }
    ]
  },
  {
    id: 'technical-analysis',
    title: 'Technical Analysis & Chart Dynamics',
    category: 'Trading',
    level: 'Intermediate',
    readTime: '25 min',
    rewardXP: 200,
    badge: 'Chartist Elite',
    badgeIcon: '📊',
    badgeImg: '/badges/badge_chartist_elite.png',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=80',
    colorClass: 'text-terracotta',
    bgClass: 'bg-terracotta',
    borderClass: 'border-terracotta/30',
    description: 'Master price action analysis, candlestick geometries, support & resistance levels, and volume momentum indicators.',
    lessons: [
      {
        id: 't1',
        title: '1. Reading Japanese Candlesticks',
        subtitle: 'Deconstructing price action in real-time',
        content: `A candlestick visually summarizes price action over a specific timeframe (e.g., 1 minute, 1 hour, 1 day).

### Component Anatomy:
- **Body**: The range between the Opening price and Closing price.
- **Wicks (Shadows)**: The highest and lowest prices reached during the period.
- **Green (Bullish)**: Closed higher than Open.
- **Red (Bearish)**: Closed lower than Open.

### Essential Candlestick Patterns:
- **Hammer**: Long lower wick after a downtrend, signaling potential bullish reversal.
- **Bullish Engulfing**: A large green candle completely engulfing the previous small red candle.
- **Doji**: Open and Close prices are nearly identical, signaling market indecision.`,
        keyTakeaway: 'Candlesticks tell the psychological story of buyer vs seller control during any given session.'
      },
      {
        id: 't2',
        title: '2. Support, Resistance & Trendlines',
        subtitle: 'Mapping market psychological levels',
        content: `Price moves in cycles rather than straight lines. Support and Resistance are key horizontal levels where buyer or seller interest concentrates:

- **Support**: A price floor where buying demand is strong enough to prevent prices from falling further.
- **Resistance**: A price ceiling where selling pressure stops upward momentum.
- **Role Reversal**: When a Resistance level is broken decisively, it frequently converts into new Support during pullback tests.

### Trendlines:
Connecting higher lows creates an **Upward Trendline**. Connecting lower highs creates a **Downward Trendline**. Always trade in alignment with the dominant higher-timeframe trend.`,
        keyTakeaway: 'Respect major support/resistance levels. Never buy directly into major resistance without a breakout confirmation.'
      },
      {
        id: 't3',
        title: '3. Moving Averages & RSI Indicators',
        subtitle: 'Smoothing noise and gauging momentum',
        content: `Technical indicators use statistical formulas to highlight momentum trends:

### 1. Simple Moving Average (SMA)
- **50 SMA & 200 SMA**: Widely watched institutional benchmarks.
- **Golden Cross**: 50 SMA crosses above 200 SMA (Bullish breakout signal).
- **Death Cross**: 50 SMA crosses below 200 SMA (Bearish breakdown signal).

### 2. Relative Strength Index (RSI)
RSI measures the speed and velocity of price changes on a scale of 0 to 100:
- **RSI > 70**: Overbought (Risk of cooling off/pullback).
- **RSI < 30**: Oversold (Potential value rebound opportunity).`,
        keyTakeaway: 'Use indicators as secondary confirmation alongside clean price action and volume analysis.'
      }
    ],
    quiz: [
      {
        id: 'tq1',
        question: 'What does a "Hammer" candlestick pattern typically indicate after a prolonged downtrend?',
        options: [
          'Immediate continuation of panic selling',
          'Market indecision with equal buyer and seller force',
          'Potential bullish trend reversal as buyers step in at lower prices',
          'An impending corporate bankruptcy announcement'
        ],
        correctAnswer: 2,
        explanation: 'A Hammer shows sellers pushed prices down, but aggressive buyers stepped in to push price back up, signaling reversal potential.'
      },
      {
        id: 'tq2',
        question: 'What occurs during a "Golden Cross" event on a stock chart?',
        options: [
          'The 50-day moving average crosses above the 200-day moving average',
          'The price drops below all major moving averages simultaneously',
          'The RSI indicator reaches 100',
          'The stock pays an extraordinary dividend'
        ],
        correctAnswer: 0,
        explanation: 'A Golden Cross is a classic bullish chart setup where short-term momentum (50 SMA) overtakes long-term trend (200 SMA).'
      },
      {
        id: 'tq3',
        question: 'If an asset\'s RSI (Relative Strength Index) reading is 82, it is generally considered:',
        options: [
          'Extremely oversold and undervalued',
          'Overbought, suggesting potential price exhaustion or pullback risk',
          'Failing to generate any trading volume',
          'Neutral and dormant'
        ],
        correctAnswer: 1,
        explanation: 'An RSI reading above 70 indicates an overbought condition where buyers may be overextended.'
      }
    ]
  },
  {
    id: 'risk-management',
    title: 'Risk Management & Position Sizing',
    category: 'Risk & Strategy',
    level: 'Intermediate',
    readTime: '20 min',
    rewardXP: 250,
    badge: 'Risk Strategist',
    badgeIcon: '🛡️',
    badgeImg: '/badges/badge_risk_strategist.png',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&q=80',
    colorClass: 'text-gold',
    bgClass: 'bg-gold',
    borderClass: 'border-gold/30',
    description: 'Learn institutional capital preservation tactics, calculating stop-loss ratios, and preventing portfolio drawdowns.',
    lessons: [
      {
        id: 'r1',
        title: '1. The Golden 2% Capital Protection Rule',
        subtitle: 'Never blow up your trading account',
        content: `Professional traders prioritize risk management above profit targets. The core golden rule of risk control is:

$$\\text{Maximum Risk Per Trade} \\le 2\\% \\text{ of Total Portfolio Capital}$$

### Why This Matters:
If you lose 10% of your account, you need an 11% gain to break even. But if you suffer a 50% drawdown, you need a **100% gain** just to get back to where you started!

By limiting risk to 1-2% per trade, even a sequence of 5 consecutive losses results in less than a 10% total portfolio drawdown, keeping your account healthy and intact.`,
        keyTakeaway: 'Capital preservation is rule #1. You cannot win the game if you run out of chips.'
      },
      {
        id: 'r2',
        title: '2. Position Sizing & Stop-Loss Placement',
        subtitle: 'Calculating exact share count before entering',
        content: `Never guess how many shares to buy based on intuition. Calculate position size systematically using your stop-loss distance:

### Position Size Formula:
$$\\text{Shares} = \\frac{\\text{Account Capital} \\times \\text{Risk \\%}}{\\text{Entry Price} - \\text{Stop Loss Price}}$$

### Scenario Example:
- **Account Capital**: $10,000
- **Risk Target (2%)**: $200
- **Stock Entry**: $50
- **Stop Loss**: $46 (Risk per share = $4)
- **Position Size**: $200 / $4 = **50 Shares** ($2,500 total position value)

If the trade hits your stop loss at $46, your exact total loss is capped at $200 (2%).`,
        keyTakeaway: 'Always place your stop-loss order immediately upon entry. Remove emotion from trade exits.'
      },
      {
        id: 'r3',
        title: '3. Risk-to-Reward Ratios & Expectancy',
        subtitle: 'Winning with a 40% win rate',
        content: `You do not need a 90% win rate to be extremely profitable. Profitability depends on your **Risk-to-Reward Ratio (R:R)**:

- **1:2 Risk-Reward Ratio**: Risking $100 to make $200.
- **1:3 Risk-Reward Ratio**: Risking $100 to make $300.

### The Math of Expectancy:
With a **1:3 R:R**, if you execute 10 trades and lose 6 of them (40% win rate):
- 6 Losses $\\times$ -$100 = -$600
- 4 Wins $\\times$ +$300 = +$1,200
- **Net Profit**: **+$600**

Focus on taking trades where potential upside substantially outweighs downside risk.`,
        keyTakeaway: 'High risk-to-reward ratios allow you to be wrong more often than right and still build compounding wealth.'
      }
    ],
    quiz: [
      {
        id: 'rq1',
        question: 'If your portfolio is $20,000 and you adhere to the 2% risk rule, what is the maximum amount you should risk losing on a single trade?',
        options: [
          '$400',
          '$2,000',
          '$100',
          '$1,000'
        ],
        correctAnswer: 0,
        explanation: '$20,000 multiplied by 2% (0.02) equals $400 maximum risk.'
      },
      {
        id: 'rq2',
        question: 'Why is recovering from a 50% account drawdown mathematically difficult?',
        options: [
          'Brokers freeze accounts after 50% losses',
          'It requires a 100% gain on remaining capital just to reach break-even',
          'Stock exchanges double their trading fees after big drawdowns',
          'Inflation automatically wipes out remaining capital'
        ],
        correctAnswer: 1,
        explanation: 'If a $100 account drops 50% to $50, gaining 50% only brings it to $75. A full 100% gain ($50 -> $100) is required.'
      },
      {
        id: 'rq3',
        question: 'With a 1:3 Risk-to-Reward ratio, what win rate is required to remain profitable?',
        options: [
          'At least 75%',
          'Greater than 25%',
          'Must be 100%',
          'Exactly 50%'
        ],
        correctAnswer: 1,
        explanation: 'At 1:3 R:R, winning just 1 out of 4 trades (25%) breaks even (+3R - 3R). Anything above 25% is net profitable.'
      }
    ]
  },
  {
    id: 'crypto-defi',
    title: 'Cryptocurrency, DeFi & Web3',
    category: 'Digital Assets',
    level: 'Advanced',
    readTime: '30 min',
    rewardXP: 300,
    badge: 'Web3 Pioneer',
    badgeIcon: '⚡',
    badgeImg: '/badges/badge_web3_pioneer.png',
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&q=80',
    colorClass: 'text-burgundy',
    bgClass: 'bg-burgundy',
    borderClass: 'border-burgundy/30',
    description: 'Explore blockchain architecture, smart contracts, decentralized liquidity protocols, and digital asset valuation.',
    lessons: [
      {
        id: 'c1',
        title: '1. Blockchain Protocols & Consensus Mechanics',
        subtitle: 'Trustless decentralized ledgers',
        content: `A **blockchain** is an immutable, distributed database maintained across a global peer-to-peer network without centralized intermediaries.

### Key Consensus Mechanisms:
- **Proof of Work (PoW)**: Miners execute computational energy to secure blocks (e.g., Bitcoin).
- **Proof of Stake (PoS)**: Validators stake native tokens as collateral to validate transactions, consuming >99% less energy (e.g., Ethereum).

### Smart Contracts:
Self-executing code stored on blockchain nodes that automatically enforce agreements when predetermined conditional triggers are met.`,
        keyTakeaway: 'Blockchains provide cryptographic trust, enabling direct peer-to-peer asset transfers without bank intermediaries.'
      },
      {
        id: 'c2',
        title: '2. Decentralized Finance (DeFi) & AMMs',
        subtitle: 'Automated market making without order books',
        content: `Traditional exchanges rely on market makers. **DeFi Automated Market Makers (AMMs)** like Uniswap use smart contract liquidity pools governed by the constant product formula:

$$x \\cdot y = k$$

- **x**: Token A quantity in pool
- **y**: Token B quantity in pool
- **k**: Constant invariant pool balance

Liquidity providers deposit paired assets into smart contracts and earn a proportional cut of trading fees generated by users swapping tokens.`,
        keyTakeaway: 'DeFi replaces centralized financial middlemen with automated open-source smart contracts.'
      },
      {
        id: 'c3',
        title: '3. Tokenomics & Halving Supply Dynamics',
        subtitle: 'Evaluating digital asset scarcity',
        content: `**Tokenomics** analyzes the supply, distribution, and utility model of a crypto token:

- **Max Supply**: Hard cap on total tokens that can ever exist (e.g., Bitcoin\'s 21 Million cap).
- **Halving Events**: In Bitcoin, the block reward paid to miners cuts in half every 210,000 blocks (~4 years), programmatically reducing new supply emission.
- **Burn Mechanics**: Permanently destroying tokens from circulation during usage to introduce deflationary pressure.`,
        keyTakeaway: 'Always analyze circulating supply versus fully diluted valuation (FDV) before investing in digital assets.'
      }
    ],
    quiz: [
      {
        id: 'cq1',
        question: 'What is a Smart Contract in blockchain networks?',
        options: [
          'A legal paper contract signed by corporate attorneys',
          'Self-executing code that automatically carries out contract terms when conditions are met',
          'A subscription agreement with a crypto exchange',
          'A digital certificate used only for domain registration'
        ],
        correctAnswer: 1,
        explanation: 'Smart contracts execute automatically on-chain when predefined conditions are satisfied.'
      },
      {
        id: 'cq2',
        question: 'What mathematical formula powers Automated Market Maker (AMM) liquidity pools?',
        options: [
          'E = mc^2',
          'x * y = k',
          'P = IV',
          'A = P(1 + r/n)'
        ],
        correctAnswer: 1,
        explanation: 'The constant product formula x * y = k maintains balance between token reserves in AMM pools.'
      },
      {
        id: 'cq3',
        question: 'What is the hard upper limit on the total number of Bitcoins that will ever exist?',
        options: [
          '100 Million',
          '21 Million',
          '1 Billion',
          'Unlimited supply'
        ],
        correctAnswer: 1,
        explanation: 'Bitcoin has a hard-coded mathematical supply cap of 21 million BTC.'
      }
    ]
  },
  {
    id: 'ai-trading-strategies',
    title: 'AI & Automated Trading Systems',
    category: 'AI & Quant',
    level: 'Advanced',
    readTime: '30 min',
    rewardXP: 350,
    badge: 'Quant Strategist',
    badgeIcon: '🤖',
    badgeImg: '/badges/badge_quant_strategist.png',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
    colorClass: 'text-gold',
    bgClass: 'bg-gold',
    borderClass: 'border-gold/30',
    description: 'Explore quantitative finance models, sentiment NLP models, backtesting integrity, and agentic algorithmic execution.',
    lessons: [
      {
        id: 'a1',
        title: '1. Machine Learning in Quant Finance',
        subtitle: 'Transforming unstructured data into alpha signals',
        content: `Modern financial artificial intelligence processes terabytes of market data per second to uncover predictive trading signals (Alpha).

### Core AI Applications:
- **NLP & Sentiment Analysis**: Real-time parsing of financial news, earnings call transcripts, and SEC filings to gauge sentiment scores.
- **Predictive Time-Series Models**: Utilizing LSTM networks and Transformers to forecast statistical probability curves for asset volatility.
- **Pattern Recognition**: Computer vision models identifying multi-frame support breakouts before human traders react.`,
        keyTakeaway: 'AI models excel at extracting subtle correlations across vast unstructured market datasets.'
      },
      {
        id: 'a2',
        title: '2. Backtesting Rigor & Avoiding Overfitting',
        subtitle: 'Ensuring your strategy survives live market conditions',
        content: `**Backtesting** involves running a algorithmic strategy against historical market data to evaluate performance metrics:

### Key Metrics to Monitor:
- **Sharpe Ratio**: Risk-adjusted return measure. A Sharpe ratio $> 1.5$ is considered strong.
  $$\\text{Sharpe} = \\frac{R_p - R_f}{\\sigma_p}$$
- **Maximum Drawdown (MDD)**: The peak-to-trough drop in strategy equity.

### The Danger of Overfitting (Curve Fitting):
Optimizing an algorithm with dozens of hyper-parameters to fit past data perfectly almost guarantees failure in live markets. Always validate strategies on **Out-of-Sample** data.`,
        keyTakeaway: 'A backtest is only valid if tested against unseen out-of-sample data and simulated with realistic transaction slippage.'
      },
      {
        id: 'a3',
        title: '3. Agentic Autonomous Portfolio Management',
        subtitle: 'The future of self-balancing AI portfolios',
        content: `An **Agentic AI Financial System** (like FINEXA AI) continuously monitors market macro conditions, portfolio concentration, and risk limits 24/7.

### Autonomous Capabilities:
- **Dynamic Rebalancing**: Automatically trimming overperforming assets and allocating into undervalued sectors when target drift exceeds thresholds.
- **Risk Guardrails**: Triggering defensive cash positions during extreme tail-risk volatility events.
- **Tax-Loss Harvesting**: Intelligently realizing capital losses to offset tax liabilities automatically.`,
        keyTakeaway: 'Agentic AI combines quantitative execution speed with disciplined, emotionless risk enforcement.'
      }
    ],
    quiz: [
      {
        id: 'aq1',
        question: 'What is the risk of "Overfitting" (Curve-Fitting) when developing an algorithmic trading model?',
        options: [
          'The strategy runs too fast for the exchange servers',
          'The model is over-optimized for past data noise and fails when trading live market data',
          'The broker increases interest fees on margin accounts',
          'The algorithm buys only index funds'
        ],
        correctAnswer: 1,
        explanation: 'Overfitting occurs when a model memorizes historical noise rather than learning true underlying market signals.'
      },
      {
        id: 'aq2',
        question: 'What does a high Sharpe Ratio (e.g. > 1.5) indicate about an investment strategy?',
        options: [
          'High risk-adjusted returns relative to portfolio volatility',
          'Zero trade execution fees',
          'Guaranteed monthly cash dividends',
          'That the strategy only trades cryptocurrency'
        ],
        correctAnswer: 0,
        explanation: 'The Sharpe Ratio measures excess return generated per unit of risk/volatility undertaken.'
      },
      {
        id: 'aq3',
        question: 'In an agentic AI financial platform, what is "Dynamic Rebalancing"?',
        options: [
          'Changing your password every month automatically',
          'Autonomous realignment of portfolio asset weights back to target risk allocations',
          'Closing all bank accounts upon market pullbacks',
          'Converting all investments into physical commodities'
        ],
        correctAnswer: 1,
        explanation: 'Dynamic rebalancing keeps portfolio risk consistent by automatically adjusting asset weights back to target parameters.'
      }
    ]
  }
];
