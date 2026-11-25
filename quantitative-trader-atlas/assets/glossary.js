/* Quantitative Trader Atlas — Term glossary tooltips */
window.ATLAS_GLOSSARY = [
  {
    "term": "Alpha",
    "cat": "Strategies",
    "def": "Excess return of an investment strategy relative to the return of a benchmark index, representing the value added by the quantitative model.",
    "match": "Alpha"
  },
  {
    "term": "Almgren-Chriss Framework",
    "cat": "Microstructure",
    "def": "The seminal optimal execution model that balances market impact costs (temporary and permanent) against inventory price volatility risk.",
    "match": "Almgren-Chriss Framework|almgren-chriss framework"
  },
  {
    "term": "Avellaneda-Stoikov Model",
    "cat": "Market Making",
    "def": "An optimal high-frequency market making framework determining reservation price and bid-ask spreads based on inventory risk aversion.",
    "match": "Avellaneda-Stoikov Model|avellaneda-stoikov model"
  },
  {
    "term": "Black-Scholes-Merton",
    "cat": "Derivatives",
    "def": "A mathematical framework for pricing European options using geometric Brownian motion and risk-neutral hedging arguments.",
    "match": "Black-Scholes-Merton"
  },
  {
    "term": "Brownian Motion (Wiener Process)",
    "cat": "Stochastic Calculus",
    "def": "A continuous-time stochastic process with stationary, independent Gaussian increments and continuous sample paths.",
    "match": "Brownian Motion|brownian motion"
  },
  {
    "term": "Calmar Ratio",
    "cat": "Performance",
    "def": "Ratio of annualized compound return to maximum drawdown over a specified time period (typically 36 months).",
    "match": "Calmar Ratio|calmar ratio"
  },
  {
    "term": "Cointegration",
    "cat": "Econometrics",
    "def": "A property where two or more non-stationary time series have a stationary linear combination, forming the mathematical basis of statistical arbitrage pairs trading.",
    "match": "Cointegration"
  },
  {
    "term": "Conditional Value at Risk (CVaR / Expected Shortfall)",
    "cat": "Risk",
    "def": "A coherent risk measure calculating the expected loss given that the loss exceeds the Value at Risk threshold.",
    "match": "Conditional Value at Risk|conditional value at risk"
  },
  {
    "term": "Deflated Sharpe Ratio (DSR)",
    "cat": "Backtesting",
    "def": "A statistical metric formulated by Marcos López de Prado that corrects for selection bias, non-normality, and multiple testing in strategy selection.",
    "match": "Deflated Sharpe Ratio|deflated sharpe ratio|DSR"
  },
  {
    "term": "Delta (Δ)",
    "cat": "Greeks",
    "def": "Rate of change of an option price with respect to changes in the underlying asset's price: ∂V/∂S.",
    "match": "Delta"
  },
  {
    "term": "Gamma (Γ)",
    "cat": "Greeks",
    "def": "Rate of change of portfolio Delta with respect to changes in the underlying asset's price: ∂²V/∂S².",
    "match": "Gamma"
  },
  {
    "term": "GARCH",
    "cat": "Econometrics",
    "def": "Generalized Autoregressive Conditional Heteroskedasticity; an econometric model estimating time-varying volatility clustering in asset returns.",
    "match": "GARCH"
  },
  {
    "term": "Hierarchical Risk Parity (HRP)",
    "cat": "Portfolio",
    "def": "A modern machine learning portfolio allocation technique developed by López de Prado using graph theory and hierarchical tree clustering on covariance matrices.",
    "match": "Hierarchical Risk Parity|hierarchical risk parity|HRP"
  },
  {
    "term": "Information Coefficient (IC)",
    "cat": "Alpha Research",
    "def": "The cross-sectional correlation between forecasted factor returns and actual future asset returns.",
    "match": "Information Coefficient|information coefficient|IC"
  },
  {
    "term": "Information Ratio (IR)",
    "cat": "Alpha Research",
    "def": "The ratio of active return to tracking error, mathematically governed by Grinold's Fundamental Law: IR ≈ IC × √Breadth.",
    "match": "Information Ratio|information ratio|IR"
  },
  {
    "term": "Itô's Lemma",
    "cat": "Stochastic Calculus",
    "def": "The stochastic calculus analogue of the Taylor series chain rule, incorporating second-order quadratic variation: df(X_t) = f'(X_t)dX_t + ½f''(X_t)(dX_t)².",
    "match": "Itô's Lemma|itô's lemma"
  },
  {
    "term": "Kalman Filter",
    "cat": "Stat Arb",
    "def": "An optimal recursive Bayesian estimation algorithm used to dynamically infer time-varying hedge ratios between cointegrated assets.",
    "match": "Kalman Filter|kalman filter"
  },
  {
    "term": "Kyle's Lambda (λ)",
    "cat": "Microstructure",
    "def": "A metric quantifying market illiquidity and order flow price impact: the price change per unit of net order flow volume.",
    "match": "Kyle's Lambda|kyle's lambda"
  },
  {
    "term": "Ledoit-Wolf Shrinkage",
    "cat": "Portfolio",
    "def": "An optimal linear combination of the sample covariance matrix and a structured target (e.g., identity or constant correlation) to eliminate estimation error in high dimensions.",
    "match": "Ledoit-Wolf Shrinkage|ledoit-wolf shrinkage"
  },
  {
    "term": "Limit Order Book (LOB)",
    "cat": "Microstructure",
    "def": "A centralized record of outstanding buy (bid) and sell (ask) limit orders sorted by price level and timestamp.",
    "match": "Limit Order Book|limit order book|LOB"
  },
  {
    "term": "Markowitz Efficient Frontier",
    "cat": "Portfolio",
    "def": "The set of optimal portfolios that offer the highest expected return for a defined level of variance risk.",
    "match": "Markowitz Efficient Frontier|markowitz efficient frontier"
  },
  {
    "term": "Maximal Extractable Value (MEV)",
    "cat": "Crypto",
    "def": "The total value that blockchain validators or searchers can extract by reordering, inserting, or censoring transactions within blocks (e.g., arbitrage, liquidations, sandwich attacks).",
    "match": "Maximal Extractable Value|maximal extractable value|MEV"
  },
  {
    "term": "Ornstein-Uhlenbeck Process",
    "cat": "Stochastic Calculus",
    "def": "A mean-reverting stochastic process described by dX_t = θ(μ - X_t)dt + σdW_t, foundational to pairs trading and interest rate modeling.",
    "match": "Ornstein-Uhlenbeck Process|ornstein-uhlenbeck process"
  },
  {
    "term": "Purged & Embargoed Cross-Validation",
    "cat": "Machine Learning",
    "def": "A cross-validation protocol that purges training labels overlapping with testing periods and embargos post-test observations to eliminate autoregressive information leakage.",
    "match": "Purged & Embargoed Cross-Validation|purged & embargoed cross-validation"
  },
  {
    "term": "Reinforcement Learning from Financial Feedback (RLFF)",
    "cat": "AI Frontier",
    "def": "The alignment of financial LLMs and agents using risk-adjusted return functions (Sharpe, max drawdown penalty) rather than generic text helpfulness.",
    "match": "Reinforcement Learning from Financial Feedback|reinforcement learning from financial feedback|RLFF"
  },
  {
    "term": "Sharpe Ratio",
    "cat": "Performance",
    "def": "The excess return of an asset or strategy above the risk-free rate divided by its standard deviation: (R_p - R_f) / σ_p.",
    "match": "Sharpe Ratio|sharpe ratio"
  },
  {
    "term": "Smart Order Routing (SOR)",
    "cat": "Execution",
    "def": "An automated algorithm that scans multiple liquidity pools, dark pools, and lit exchanges to optimize fill quality and minimize adverse selection.",
    "match": "Smart Order Routing|smart order routing|SOR"
  },
  {
    "term": "TWAP / VWAP",
    "cat": "Execution",
    "def": "Time-Weighted Average Price and Volume-Weighted Average Price algorithmic execution schedules used to break parent orders into child orders.",
    "match": "TWAP / VWAP|twap / vwap"
  },
  {
    "term": "Uniswap v3 Concentrated Liquidity",
    "cat": "Crypto",
    "def": "An automated market maker model where liquidity providers allocate capital within custom bounded price ranges, drastically amplifying capital efficiency.",
    "match": "Uniswap v3 Concentrated Liquidity|uniswap v3 concentrated liquidity"
  },
  {
    "term": "Value at Risk (VaR)",
    "cat": "Risk",
    "def": "A quantile risk measure calculating the maximum dollar or percentage loss not exceeded with a given confidence level over a specified time horizon.",
    "match": "Value at Risk|value at risk"
  },
  {
    "term": "Vega (ν)",
    "cat": "Greeks",
    "def": "Rate of change of an option price with respect to changes in the implied volatility of the underlying asset: ∂V/∂σ.",
    "match": "Vega"
  },
  {
    "term": "VPIN (Volume-Synchronized Probability of Toxicity)",
    "cat": "Microstructure",
    "def": "A high-frequency metric measuring the probability of informed trading and impending market illiquidity by analyzing volume-bucketed order imbalances.",
    "match": "VPIN"
  }
];
