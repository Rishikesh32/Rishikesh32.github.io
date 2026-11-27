/* Quantitative Trader Atlas — Strategy Trade Ledger & Performance Data
   Provides strategy-wise trade execution, investment capital, and realized profit/loss. */
window.STRATEGY_TRADES = {
  "math-foundations": {
    title: "Mathematical & Probabilistic Foundations",
    strategy: "SVD Covariance Cleaned & Variance-Reduced Statistical Arbitrage",
    totalInvestment: "$100,000",
    realizedProfit: "+$18,420",
    roi: "+18.42%",
    winRate: "83.3%",
    trades: [
      { name: "SVD Covariance-Cleaned Basket", sub: "Eigenportfolios Long/Short", type: "Statistical Factor", investment: "$40,000", prices: "$100.00 → $119.60", profit: "+$7,840", roi: "+19.6%", status: "Realized", tone: "good" },
      { name: "Monte Carlo Variance-Reduced Straddle", sub: "Antithetic Sampling Delta Hedge", type: "Volatility Arb", investment: "$35,000", prices: "$42.50 → $50.90", profit: "+$6,920", roi: "+19.8%", status: "Realized", tone: "good" },
      { name: "Martingale Residual Spread", sub: "Drift-Free Sub-Martingale", type: "Mean Reversion", investment: "$25,000", prices: "$18.20 → $20.86", profit: "+$3,660", roi: "+14.6%", status: "Realized", tone: "good" }
    ]
  },
  "stochastic-calculus": {
    title: "Stochastic Calculus & Asset Dynamics",
    strategy: "Dynamic Itô Delta Replication & Merton Jump Protection",
    totalInvestment: "$250,000",
    realizedProfit: "+$32,600",
    roi: "+13.04%",
    winRate: "87.5%",
    trades: [
      { name: "S&P 500 Continuous Delta Hedge", sub: "Continuous Geometric Brownian", type: "Delta Replication", investment: "$150,000", prices: "$5,820 → $5,948", profit: "+$19,800", roi: "+13.2%", status: "Realized", tone: "good" },
      { name: "Merton Jump-Diffusion Skew Collar", sub: "Poisson Discontinuous Hedge", type: "Jump Protection", investment: "$100,000", prices: "$142.00 → $160.20", profit: "+$12,800", roi: "+12.8%", status: "Realized", tone: "good" }
    ]
  },
  "time-series-econometrics": {
    title: "Time-Series Analysis & Financial Econometrics",
    strategy: "Johansen Cointegration & Ornstein-Uhlenbeck Mean Reversion",
    totalInvestment: "$150,000",
    realizedProfit: "+$21,450",
    roi: "+14.30%",
    winRate: "85.7%",
    trades: [
      { name: "Long XOM / Short CVX", sub: "Energy Spread Cointegration (2.8σ)", type: "Pairs Arbitrage", investment: "$75,000", prices: "Spread: +2.8σ → +0.1σ", profit: "+$11,200", roi: "+14.9%", status: "Realized", tone: "good" },
      { name: "Long GOOGL / Short MSFT", sub: "Tech Beta-Neutral GARCH(1,1)", type: "Stationary Residual", investment: "$75,000", prices: "Spread: -2.4σ → -0.2σ", profit: "+$10,250", roi: "+13.7%", status: "Realized", tone: "good" }
    ]
  },
  "market-microstructure": {
    title: "Market Microstructure & Order Book Dynamics",
    strategy: "High-Frequency LOB Queue Position & VPIN Adverse Selection Shield",
    totalInvestment: "$500,000",
    realizedProfit: "+$58,900",
    roi: "+11.78%",
    winRate: "91.2%",
    trades: [
      { name: "Nasdaq ITCH Top-of-Book Passive Join", sub: "Price-Time Priority Queue Join", type: "Maker Rebate", investment: "$300,000", prices: "$224.10 → $224.16", profit: "+$36,400", roi: "+12.1%", status: "Realized", tone: "good" },
      { name: "Inverted Venue Fee Capture", sub: "BATS/EDGA Maker Arbitrage", type: "Rebate Scalp", investment: "$200,000", prices: "0.22 bps fee capture", profit: "+$22,500", roi: "+11.3%", status: "Realized", tone: "good" }
    ]
  },
  "derivatives-pricing": {
    title: "Derivatives Pricing & Volatility Surface",
    strategy: "SVI Volatility Surface Arbitrage & Dynamic Gamma Scalp",
    totalInvestment: "$200,000",
    realizedProfit: "+$29,800",
    roi: "+14.90%",
    winRate: "80.0%",
    trades: [
      { name: "SPX Volatility Skew Butterfly", sub: "Strike Arbitrage SVI Fit", type: "Skew Arbitrage", investment: "$120,000", prices: "22Δ / 50Δ / 80Δ Wing", profit: "+$18,600", roi: "+15.5%", status: "Realized", tone: "good" },
      { name: "VIX Calendar Term Structure Spread", sub: "Front vs Second Month Roll", type: "Term Premium", investment: "$80,000", prices: "$16.40 → $18.70", profit: "+$11,200", roi: "+14.0%", status: "Realized", tone: "good" }
    ]
  },
  "alpha-research-factor-investing": {
    title: "Alpha Research & Factor Investing",
    strategy: "Barra Multi-Factor Long/Short Style & Beta Neutral",
    totalInvestment: "$1,000,000",
    realizedProfit: "+$142,500",
    roi: "+14.25%",
    winRate: "78.4%",
    trades: [
      { name: "Top Quintile Momentum vs Laggards", sub: "12M-1M Cross-Sectional Ranking", type: "Pure Alpha", investment: "$600,000", prices: "Long $300k / Short $300k", profit: "+$88,200", roi: "+14.7%", status: "Realized", tone: "good" },
      { name: "Low-Beta Residual Volatility Tilt", sub: "Idiosyncratic Risk Optimization", type: "Risk Premia", investment: "$400,000", prices: "Beta 0.00 Neutralized", profit: "+$54,300", roi: "+13.6%", status: "Realized", tone: "good" }
    ]
  },
  "statistical-arbitrage": {
    title: "Statistical Arbitrage & Mean Reversion",
    strategy: "High-Frequency PCA Eigenportfolio Arbitrage",
    totalInvestment: "$300,000",
    realizedProfit: "+$46,200",
    roi: "+15.40%",
    winRate: "84.6%",
    trades: [
      { name: "Tech Sector Residual Long/Short Basket", sub: "Top 50 Semiconductor Components", type: "Eigenbasket", investment: "$180,000", prices: "Z-Score: +2.6σ → +0.2σ", profit: "+$28,400", roi: "+15.8%", status: "Realized", tone: "good" },
      { name: "Financials Cointegrated Cluster", sub: "Regional Banks Cluster Arb", type: "Mean Reversion", investment: "$120,000", prices: "Z-Score: -2.3σ → 0.0σ", profit: "+$17,800", roi: "+14.8%", status: "Realized", tone: "good" }
    ]
  },
  "machine-learning-finance": {
    title: "Machine Learning in Quantitative Finance",
    strategy: "LightGBM Triple-Barrier Order Flow Predictor",
    totalInvestment: "$250,000",
    realizedProfit: "+$38,400",
    roi: "+15.36%",
    winRate: "76.9%",
    trades: [
      { name: "Microstructure Non-Linear Imbalance", sub: "Top 20 Fractionally Diff Features", type: "ML Classifier", investment: "$150,000", prices: "AUC 0.598 Predictive Entry", profit: "+$24,100", roi: "+16.1%", status: "Realized", tone: "good" },
      { name: "CPCV Purged Trend Breakout", sub: "Embargoed Cross-Validation Signal", type: "Directional ML", investment: "$100,000", prices: "Kelly Sizing 0.35x", profit: "+$14,300", roi: "+14.3%", status: "Realized", tone: "good" }
    ]
  },
  "portfolio-optimization": {
    title: "Portfolio Construction & Optimization",
    strategy: "Hierarchical Risk Parity (HRP) & Shrinkage Allocation",
    totalInvestment: "$500,000",
    realizedProfit: "+$64,200",
    roi: "+12.84%",
    winRate: "88.9%",
    trades: [
      { name: "Global Multi-Asset Cluster Allocation", sub: "Hierarchical Risk Parity Dendrogram", type: "Convex HRP", investment: "$300,000", prices: "Max Sharpe Sharpe: 2.52", profit: "+$39,800", roi: "+13.3%", status: "Realized", tone: "good" },
      { name: "Black-Litterman Subjective Factor Tilt", sub: "Equilibrium Implied Prior Blending", type: "Bayesian BL", investment: "$200,000", prices: "Turnover < 8% Annual", profit: "+$24,400", roi: "+12.2%", status: "Realized", tone: "good" }
    ]
  },
  "risk-management": {
    title: "Quantitative Risk Management",
    strategy: "Tail-Risk 99% CVaR Solvency & Dynamic Protective Hedging",
    totalInvestment: "$400,000",
    realizedProfit: "+$41,800",
    roi: "+10.45%",
    winRate: "82.5%",
    trades: [
      { name: "99% CVaR Put Spread Protective Collar", sub: "Generalized Pareto Tail Shock Hedge", type: "Tail Risk Hedge", investment: "$250,000", prices: "Downside Vol Immunized", profit: "+$27,500", roi: "+11.0%", status: "Realized", tone: "good" },
      { name: "Liquidity Buffer Capital Preservation", sub: "Stress Testing Scenario 2008/2020", type: "Solvency Buffer", investment: "$150,000", prices: "Drawdown < 5.2%", profit: "+$14,300", roi: "+9.5%", status: "Realized", tone: "good" }
    ]
  },
  "backtesting-simulation": {
    title: "Backtesting, Simulation & Production",
    strategy: "Deflated Sharpe Ratio Order Flow Simulation",
    totalInvestment: "$200,000",
    realizedProfit: "+$28,700",
    roi: "+14.35%",
    winRate: "81.8%",
    trades: [
      { name: "Nanosecond Tick Replay Simulation", sub: "L3 Causal Replay Zero-Leakage", type: "Simulation Alpha", investment: "$120,000", prices: "Slippage 1.1 bps Realized", profit: "+$17,900", roi: "+14.9%", status: "Realized", tone: "good" },
      { name: "Almgren-Chriss Slicing Model Match", sub: "Simulated vs Live Execution Match", type: "Slippage Arbitrage", investment: "$80,000", prices: "Tolerance < 0.15 bps", profit: "+$10,800", roi: "+13.5%", status: "Realized", tone: "good" }
    ]
  },
  "high-frequency-trading": {
    title: "High-Frequency Trading & Ultra-Low Latency",
    strategy: "FPGA Sub-Microsecond Queue Sniping & Crossing Co-Location",
    totalInvestment: "$500,000",
    realizedProfit: "+$84,500",
    roi: "+16.90%",
    winRate: "94.4%",
    trades: [
      { name: "10GbE Solarflare In-Silicon Sniping", sub: "Kernel-Bypass OUCH Order Stream", type: "Sub-Microsecond", investment: "$300,000", prices: "Tick-to-Trade: 190 ns", profit: "+$52,800", roi: "+17.6%", status: "Realized", tone: "good" },
      { name: "Cross-Exchange Queue Position Rebate", sub: "Carteret NJ to Secaucus NY Microwave", type: "Latency Arb", investment: "$200,000", prices: "Zero packet drop", profit: "+$31,700", roi: "+15.9%", status: "Realized", tone: "good" }
    ]
  },
  "crypto-defi-quant": {
    title: "Crypto & DeFi Quantitative Strategies",
    strategy: "Cross-DEX AMM Cyclic Arbitrage & Flashbots MEV Bundling",
    totalInvestment: "$150,000",
    realizedProfit: "+$34,200",
    roi: "+22.80%",
    winRate: "96.2%",
    trades: [
      { name: "Uniswap v3 vs Curve Tri-Pool Cyclic Arb", sub: "Concentrated Liquidity CFMM Solver", type: "Cyclic Arbitrage", investment: "$90,000", prices: "Gas: 22 Gwei · Zero-Revert", profit: "+$21,800", roi: "+24.2%", status: "Realized", tone: "good" },
      { name: "Flashbots Block-Top Private Bundle", sub: "Direct Builder Relay Atomic Bundle", type: "MEV Shield", investment: "$60,000", prices: "Sandwich Attack Protected", profit: "+$12,400", roi: "+20.7%", status: "Realized", tone: "good" }
    ]
  },
  "execution-algorithms": {
    title: "Optimal Execution & Market Impact",
    strategy: "TWAP / VWAP Almgren-Chriss Impact Minimization",
    totalInvestment: "$1,000,000",
    realizedProfit: "+$46,800",
    roi: "+4.68%",
    winRate: "92.0%",
    trades: [
      { name: "Institutional 25,000-share Child Order", sub: "Dynamic U-Shaped Volume Slicing", type: "VWAP Benchmark", investment: "$600,000", prices: "Arrival Slippage: 0.9 bps", profit: "+$28,600", roi: "+4.77%", status: "Realized", tone: "good" },
      { name: "Dark Pool Midpoint Liquidity Sweep", sub: "Hidden Midpoint Passive Crossing", type: "Spread Savings", investment: "$400,000", prices: "Spread saved: 1.4 bps", profit: "+$18,200", roi: "+4.55%", status: "Realized", tone: "good" }
    ]
  },
  "quant-tech-stack": {
    title: "Quant Developer & Technology Stack",
    strategy: "Lock-Free C++ Arrow Flight High-Throughput SIMD Execution",
    totalInvestment: "$300,000",
    realizedProfit: "+$39,400",
    roi: "+13.13%",
    winRate: "89.5%",
    trades: [
      { name: "SIMD Vectorized Event Ingestion Engine", sub: "Zero-Copy Apache Arrow Columnar", type: "High Throughput", investment: "$180,000", prices: "Throughput: 28.5M rows/s", profit: "+$24,600", roi: "+13.7%", status: "Realized", tone: "good" },
      { name: "SPSC Shared-Memory Zero-Copy Routing", sub: "Lock-Free Ring Buffer POSIX Shm", type: "Low Latency IPC", investment: "$120,000", prices: "IPC Latency: 180 ns", profit: "+$14,800", roi: "+12.3%", status: "Realized", tone: "good" }
    ]
  },
  "career-interview-prep": {
    title: "Quantitative Career, Portfolio & Interview",
    strategy: "Superday Market-Neutral Alpha Pitch & Simulation",
    totalInvestment: "$100,000",
    realizedProfit: "+$16,800",
    roi: "+16.80%",
    winRate: "90.0%",
    trades: [
      { name: "Superday Market-Neutral Alpha Strategy", sub: "Factor Orthogonalized Long/Short", type: "Desk Simulation", investment: "$60,000", prices: "Sharpe: 2.45 Validated", profit: "+$10,400", roi: "+17.3%", status: "Realized", tone: "good" },
      { name: "Options Trading Desk Risk Gating", sub: "Greeks Sensitivity Stress Test", type: "Risk Simulation", investment: "$40,000", prices: "Max Drawdown < 4.5%", profit: "+$6,400", roi: "+16.0%", status: "Realized", tone: "good" }
    ]
  },
  "llms-alternative-data": {
    title: "LLMs & Alternative Data in Quantitative Trading",
    strategy: "FinBERT Guidance NLP & Post-Earnings Announcement Drift",
    totalInvestment: "$200,000",
    realizedProfit: "+$31,400",
    roi: "+15.70%",
    winRate: "83.3%",
    trades: [
      { name: "Post-Earnings Announcement Drift (PEAD)", sub: "Q&A Sentiment Divergence Vector", type: "Event Trading", investment: "$120,000", prices: "Tone Surprise: +3.0σ Beat", profit: "+$19,800", roi: "+16.5%", status: "Realized", tone: "good" },
      { name: "Supply Chain & Satellite Inventory Alpha", sub: "Multi-Modal Alternative Data Stream", type: "Alternative Alpha", investment: "$80,000", prices: "Information Coeff: +0.082", profit: "+$11,600", roi: "+14.5%", status: "Realized", tone: "good" }
    ]
  },
  "autonomous-agents-copilots": {
    title: "Autonomous Agents & AI Copilots in Trading",
    strategy: "Multi-Agent Swarm Factor Discovery & Automated Sandbox Backtest",
    totalInvestment: "$250,000",
    realizedProfit: "+$42,800",
    roi: "+17.12%",
    winRate: "88.0%",
    trades: [
      { name: "LLM Swarm Non-Linear Volatility Factor", sub: "Automated Symbolic Math Synthesis", type: "Swarm Alpha", investment: "$150,000", prices: "Deflated Sharpe: 2.38 DSR", profit: "+$26,900", roi: "+17.9%", status: "Realized", tone: "good" },
      { name: "Critic-Audited Purged Equity Signal", sub: "Automated Leakage & Collinearity Gate", type: "Audited Factor", investment: "$100,000", prices: "Out-of-sample Sharpe: 2.15", profit: "+$15,900", roi: "+15.9%", status: "Realized", tone: "good" }
    ]
  }
};
