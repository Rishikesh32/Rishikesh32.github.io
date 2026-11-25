/* Single source of truth for areas and subtopics in Quantitative Trader Atlas */
window.ATLAS_LIVE = [
  "math-foundations",
  "stochastic-calculus",
  "time-series-econometrics",
  "market-microstructure",
  "derivatives-pricing",
  "alpha-research-factor-investing",
  "statistical-arbitrage",
  "machine-learning-finance",
  "portfolio-optimization",
  "risk-management",
  "backtesting-simulation",
  "high-frequency-trading",
  "crypto-defi-quant",
  "execution-algorithms",
  "quant-tech-stack",
  "career-interview-prep",
  "llms-alternative-data",
  "autonomous-agents-copilots"
];

window.ATLAS = {
  tiers: [
    { id: "A", name: "Foundations & Financial Mathematics", blurb: "Measure theory, linear algebra, SDEs, and econometrics", color: "var(--t1)" },
    { id: "B", name: "Market Dynamics & Derivatives", blurb: "Order book mechanics, Black-Scholes, and volatility surfaces", color: "var(--t2)" },
    { id: "C", name: "Quantitative Strategies & Alpha", blurb: "Multi-factor investing, stat arb, and financial ML", color: "var(--t3)" },
    { id: "D", name: "Portfolio, Risk & Execution", blurb: "Markowitz optimization, VaR stress testing, and HFT quoting", color: "var(--t4)" },
    { id: "E", name: "Crypto, Tech Stack & Career", blurb: "DeFi liquidity, C++ low latency, and interview drills", color: "var(--t5)" },
    { id: "F", name: "The AI & LLM Quant Frontier", blurb: "Earnings NLP, alternative data alpha, and autonomous agent swarms", color: "var(--t6)" }
  ],
  areas: [
    {
      n: 1, id: "math-foundations", file: "01-math-foundations.html", tier: "A",
      title: "Mathematical & Probabilistic Foundations", weeks: "4–6 wks", prereqs: [],
      summary: "Probability spaces, Martingales, SVD decomposition, and Monte Carlo variance reduction.",
      subs: [
        ["probability-spaces", "Probability Spaces & Measure Theory"],
        ["conditional-expectation", "Conditional Expectation & Martingales"],
        ["linear-algebra-svd", "Linear Algebra, SVD & PCA"],
        ["covariance-matrices", "Covariance Matrix Properties & Cleaning"],
        ["monte-carlo-methods", "Monte Carlo Simulation Fundamentals"],
        ["variance-reduction", "Variance Reduction Techniques"]
      ]
    },
    {
      n: 2, id: "stochastic-calculus", file: "02-stochastic-calculus.html", tier: "A",
      title: "Stochastic Calculus & Asset Dynamics", weeks: "5–6 wks", prereqs: [1],
      summary: "Brownian motion, Itô's Lemma, Girsanov theorem, and mean-reverting jump-diffusion processes.",
      subs: [
        ["brownian-motion", "Brownian Motion & Wiener Process"],
        ["ito-lemma", "Itô's Lemma & Stochastic Integration"],
        ["girsanov-theorem", "Girsanov's Theorem & Risk-Neutral Measures"],
        ["geometric-brownian-motion", "Geometric Brownian Motion (GBM)"],
        ["ornstein-uhlenbeck", "Ornstein-Uhlenbeck Mean-Reverting Process"],
        ["jump-diffusion", "Jump-Diffusion & Merton Model"]
      ]
    },
    {
      n: 3, id: "time-series-econometrics", file: "03-time-series-econometrics.html", tier: "A",
      title: "Time-Series Analysis & Financial Econometrics", weeks: "4–5 wks", prereqs: [1],
      summary: "Stationarity, ARMA/ARIMA modeling, GARCH volatility clustering, and cointegration testing.",
      subs: [
        ["stationarity-tests", "Stationarity, Autocorrelation & Unit Root Tests"],
        ["arima-models", "AR, MA, ARMA & ARIMA Models"],
        ["garch-volatility", "GARCH, EGARCH & Volatility Clustering"],
        ["cointegration-tests", "Cointegration & Engle-Granger Two-Step"],
        ["vector-autoregression", "Vector Autoregression (VAR) & VECM"],
        ["regime-switching", "Markov Regime-Switching Models"]
      ]
    },
    {
      n: 4, id: "market-microstructure", file: "04-market-microstructure.html", tier: "B",
      title: "Market Microstructure & Order Book Mechanics", weeks: "3–4 wks", prereqs: [],
      summary: "Limit order book dynamics, bid-ask spreads, order flow toxicity, and market impact models.",
      subs: [
        ["lob-mechanics", "Limit Order Book (LOB) Architecture & Level 2/3"],
        ["order-types", "Limit, Market, Iceberg & Hidden Orders"],
        ["order-flow-toxicity", "Order Flow Toxicity, VPIN & Kyle's Lambda"],
        ["market-impact", "Market Impact: Almgren-Chriss Framework"],
        ["queue-position", "Queue Position, Fill Probabilities & Latency"],
        ["maker-taker", "Maker-Taker Fees & Rebate Arbitrage"]
      ]
    },
    {
      n: 5, id: "derivatives-pricing", file: "05-derivatives-pricing.html", tier: "B",
      title: "Derivatives Pricing & Volatility Surface", weeks: "5–6 wks", prereqs: [2],
      summary: "Black-Scholes-Merton PDE, First and Second-Order Greeks, and Volatility Surface dynamics.",
      subs: [
        ["black-scholes", "Black-Scholes-Merton Formula & Assumptions"],
        ["the-greeks", "Delta, Gamma, Theta, Vega, Rho"],
        ["higher-order-greeks", "Higher-Order Greeks: Vanna, Volga & Charm"],
        ["volatility-surface", "Implied Volatility Smile & Surface"],
        ["local-stochastic-vol", "Dupire Local Vol & Heston Stochastic Vol"],
        ["exotic-derivatives", "Barrier Options & Structured Payoffs"]
      ]
    },
    {
      n: 6, id: "alpha-research-factor-investing", file: "06-alpha-research-factor-investing.html", tier: "C",
      title: "Alpha Research & Factor Investing", weeks: "5–6 wks", prereqs: [1, 3],
      summary: "CAPM, Fama-French multi-factor anomalies, Information Coefficient (IC), and cross-sectional scoring.",
      subs: [
        ["capm-fama-french", "CAPM & Fama-French Multi-Factor Models"],
        ["factor-zoo", "The Factor Zoo: Value, Momentum, Quality & Low-Vol"],
        ["information-coefficient", "Information Coefficient (IC) & Information Ratio (IR)"],
        ["fundamental-law", "Fundamental Law of Active Management (Grinold)"],
        ["cross-sectional-rank", "Cross-Sectional Factor Ranking & Quantile Spreads"],
        ["factor-decay", "Alpha Decay, Turnover & Capacity Estimation"]
      ]
    },
    {
      n: 7, id: "statistical-arbitrage", file: "07-statistical-arbitrage.html", tier: "C",
      title: "Statistical Arbitrage & Mean Reversion", weeks: "4–5 wks", prereqs: [3, 6],
      summary: "Pairs trading, Kalman filter dynamic hedge ratios, ETF basket arbitrage, and mean-reversion strategies.",
      subs: [
        ["pairs-trading-distance", "Distance & Minimum Sum of Squared Errors Method"],
        ["cointegration-pairs", "Cointegration Pairs Trading & Z-Score Bands"],
        ["kalman-filter-hedging", "Dynamic Hedge Ratios via Kalman Filtering"],
        ["etf-index-arbitrage", "ETF Arbitrage & Cash-and-Carry Mechanics"],
        ["lead-lag-relationships", "Lead-Lag Information Transmission Across Assets"],
        ["execution-slippage", "Managing Cooldown Periods, Stop-Loss & Slippage"]
      ]
    },
    {
      n: 8, id: "machine-learning-finance", file: "08-machine-learning-finance.html", tier: "C",
      title: "Machine Learning & Deep Learning in Finance", weeks: "5–6 wks", prereqs: [1, 6],
      summary: "Purged & embargoed K-Fold validation, tree ensembles, temporal transformers, and RL agents.",
      subs: [
        ["purged-kfold-cv", "Financial CV: Purged & Embargoed Cross-Validation"],
        ["feature-engineering-ml", "Stationary Feature Transformations & Fractional Differentiation"],
        ["tree-ensembles-xgboost", "Gradient Boosting (XGBoost, LightGBM) for Alphas"],
        ["deep-temporal-models", "LSTMs & Financial Temporal Transformers"],
        ["reinforcement-learning-trade", "Deep Q-Learning & PPO for Trading Agents"],
        ["overfitting-dsr", "Deflated Sharpe Ratio & Backtest Overfitting Proofs"]
      ]
    },
    {
      n: 9, id: "portfolio-optimization", file: "09-portfolio-optimization.html", tier: "D",
      title: "Portfolio Optimization & Asset Allocation", weeks: "4–5 wks", prereqs: [1, 6],
      summary: "Markowitz mean-variance frontier, Black-Litterman model, Hierarchical Risk Parity, and Ledoit-Wolf shrinkage.",
      subs: [
        ["mean-variance-markowitz", "Markowitz Mean-Variance & Efficient Frontier"],
        ["black-litterman", "Black-Litterman Model & Subjective Views"],
        ["risk-parity-hrp", "Equal Risk Contribution & Hierarchical Risk Parity (HRP)"],
        ["covariance-shrinkage", "Ledoit-Wolf & Oracle Shrinkage Estimators"],
        ["cardinality-constraints", "Transaction Cost & Turnover-Constrained Optimization"],
        ["rebalancing-friction", "Rebalancing Frequencies & Bandwidth Rules"]
      ]
    },
    {
      n: 10, id: "risk-management", file: "10-risk-management.html", tier: "D",
      title: "Quantitative Risk Management", weeks: "3–4 wks", prereqs: [1, 9],
      summary: "Value-at-Risk (VaR), Expected Shortfall (CVaR), multi-factor Barra models, and tail-risk hedging.",
      subs: [
        ["value-at-risk", "Historical, Parametric & Monte Carlo Value at Risk (VaR)"],
        ["expected-shortfall", "Expected Shortfall (CVaR) & Subadditivity"],
        ["stress-testing-scenarios", "Historical Scenario Analysis & Stress Testing"],
        ["factor-risk-models", "Multi-Factor Risk Models (Barra Framework)"],
        ["liquidity-risk", "Liquidity-Adjusted Risk & Asset-Liability Matching"],
        ["tail-risk-hedging", "Tail Risk Hedging & Convex Option Overlays"]
      ]
    },
    {
      n: 11, id: "backtesting-simulation", file: "11-backtesting-simulation.html", tier: "D",
      title: "Backtesting, Simulation & Execution Reality", weeks: "3–4 wks", prereqs: [6, 8],
      summary: "Lookahead bias, survivorship bias, realistic slippage modeling, and statistical significance testing.",
      subs: [
        ["lookahead-survivorship", "Eliminating Lookahead & Survivorship Bias"],
        ["fill-slippage-models", "Market Impact & Realistic Execution Slippage"],
        ["borrow-fees-shorting", "Short-Sale Constraints & Hard-to-Borrow Costs"],
        ["vectorized-vs-event", "Vectorized Backtesting vs Event-Driven Simulation"],
        ["performance-metrics", "Sharpe, Sortino, Calmar, Max Drawdown & Tail Ratio"],
        ["paper-trading-live", "Paper Trading Validation & Live Strategy Deployment"]
      ]
    },
    {
      n: 12, id: "high-frequency-trading", file: "12-high-frequency-trading.html", tier: "D",
      title: "High-Frequency Trading & Market Making", weeks: "5–6 wks", prereqs: [4, 5],
      summary: "Avellaneda-Stoikov quoting, inventory management, latency arbitrage, and hardware acceleration.",
      subs: [
        ["avellaneda-stoikov", "Avellaneda-Stoikov Market Making Equations"],
        ["inventory-risk-skew", "Inventory Risk & Dynamic Quoting Skew"],
        ["adverse-selection-hft", "Adverse Selection & Toxic Flow Mitigation"],
        ["latency-arbitrage", "Colocation, Microwave Networks & Latency Arbitrage"],
        ["fpga-kernel-bypass", "FPGA Hardware, Solarflare & Kernel Bypass (OpenOnload)"],
        ["pcap-tick-analysis", "PCAP Network Packet Capture & Tick Replay"]
      ]
    },
    {
      n: 13, id: "crypto-defi-quant", file: "13-crypto-defi-quant.html", tier: "E",
      title: "Crypto, DeFi & Digital Asset Quantitative Trading", weeks: "3–4 wks", prereqs: [4, 7],
      summary: "Uniswap v2/v3 concentrated liquidity formulas, MEV extraction, perpetual futures funding, and cross-DEX arb.",
      subs: [
        ["amm-constant-product", "Constant Function Market Makers (Uniswap v2 $x \\cdot y = k$)"],
        ["concentrated-liquidity", "Uniswap v3 Concentrated Liquidity & Impermanent Loss"],
        ["mev-arbitrage", "Maximal Extractable Value (MEV): Sandwiches & Arbitrage"],
        ["perpetuals-funding", "Perpetual Futures: Funding Rate Arbitrage & Basis Trade"],
        ["cross-exchange-arb", "CEX-DEX Triangular & Statistical Arbitrage"],
        ["on-chain-analytics", "Mempool Monitoring & Smart Contract Bot Architecture"]
      ]
    },
    {
      n: 14, id: "execution-algorithms", file: "14-execution-algorithms.html", tier: "E",
      title: "Execution Algorithms & Smart Order Routing (SOR)", weeks: "3–4 wks", prereqs: [4, 12],
      summary: "TWAP, VWAP, Implementation Shortfall, dark pools, and transaction cost analysis (TCA).",
      subs: [
        ["twap-execution", "Time-Weighted Average Price (TWAP) Slicing"],
        ["vwap-execution", "Volume-Weighted Average Price (VWAP) Dynamic Curves"],
        ["implementation-shortfall", "Implementation Shortfall (IS) & Arrival Price Benchmarks"],
        ["smart-order-routing", "Smart Order Routing (SOR) & Venue Selection"],
        ["dark-pools-crossing", "Dark Pools, Midpoint Crossing & Block Trading"],
        ["tca-post-trade", "Transaction Cost Analysis (TCA) & Execution Quality"]
      ]
    },
    {
      n: 15, id: "quant-tech-stack", file: "15-quant-tech-stack.html", tier: "E",
      title: "The Quant Tech Stack: C++, KDB+/q, Python", weeks: "4–5 wks", prereqs: [],
      summary: "Zero-copy C++20 memory layouts, lock-free ring buffers, KDB+/q tick databases, and Polars acceleration.",
      subs: [
        ["modern-cpp-quant", "C++20 for Quant: Zero-Copy, Cache Locality & SIMD"],
        ["lock-free-concurrency", "Lock-Free Ring Buffers & Atomic Synchronization"],
        ["kdb-q-tick-store", "KDB+/q Time-Series Database & Vectorized Queries"],
        ["python-polars-numba", "Python Acceleration: Polars, Numba, Cython & VectorBT"],
        ["messaging-ipc", "Shared Memory IPC & ZeroMQ Messaging Architectures"],
        ["tick-data-storage", "ClickHouse, Parquet & Historical Tick Lakehouses"]
      ]
    },
    {
      n: 16, id: "career-interview-prep", file: "16-career-interview-prep.html", tier: "E",
      title: "Career Roadmap & Quant Interview Preparation", weeks: "3–4 wks", prereqs: [],
      summary: "Prop shops vs hedge funds, probability brainteasers, mental math, coding rounds, and live drills.",
      subs: [
        ["industry-landscape", "Prop Shops (Jane Street, Citadel) vs Hedge Funds (Two Sigma, Millennium)"],
        ["role-profiles", "Quant Researcher vs Quant Trader vs Quant Developer"],
        ["probability-brainteasers", "Probability Puzzles & Green Book Brainteasers"],
        ["mental-math-drills", "Mental Math Shortcuts & Market Making Games"],
        ["technical-coding-rounds", "C++ & Python Data Structure Coding Challenges"],
        ["cv-portfolio-projects", "Building an Outstanding Quant Portfolio & GitHub Strategy"]
      ]
    },
    {
      n: 17, id: "llms-alternative-data", file: "17-llms-alternative-data.html", tier: "F",
      title: "LLMs & Alternative Data in Quantitative Alpha Research", weeks: "4–5 wks", prereqs: [6, 8],
      summary: "Earnings transcript parsing, central bank speech NLP, multi-modal alternative signals, and temporal leakage prevention.",
      subs: [
        ["unstructured-data-pipeline", "Financial Document Parsing: 10-K, 8-K & Earnings Calls"],
        ["financial-foundation-models", "FinBERT, BloombergGPT & Financial Embeddings"],
        ["guidance-sentiment-scoring", "Executive Tonal Sentiment & Guidance Revision Surprises"],
        ["central-bank-speech-nlp", "Hawkish vs Dovish NLP Quantification of Central Bank Speeches"],
        ["alternative-data-signals", "Satellite, Web Scraping, Social & Supply Chain Graphs"],
        ["preventing-temporal-leakage", "Point-in-Time Document Indexing & Lookahead Traps"]
      ]
    },
    {
      n: 18, id: "autonomous-agents-copilots", file: "18-autonomous-agents-copilots.html", tier: "F",
      title: "Autonomous Agents & AI Copilots in Trading", weeks: "4–5 wks", prereqs: [8, 14, 17],
      summary: "Multi-agent research swarms, automated strategy code synthesis, live compliance auditors, and RLFF alignment.",
      subs: [
        ["multi-agent-trading-swarms", "Multi-Agent Architectures: Fundamental, Macro & Risk Debates"],
        ["automated-strategy-synthesis", "LLM-Generated Vectorized Backtesting & C++ Code Synthesis"],
        ["real-time-news-distillation", "Streaming Breaking News to Risk Vector Conversion"],
        ["compliance-anomaly-detection", "LLM Live Market Surveillance & Spoofing Detection"],
        ["rlff-financial-alignment", "Reinforcement Learning from Financial Feedback (RLFF)"],
        ["guardrails-execution-safety", "Deterministic Guardrails for Autonomous Trading Agents"]
      ]
    }
  ]
};
