window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["crypto-defi-quant"] = {
  quiz: {
  "amm-constant-product": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Constant Function Market Makers (Uniswap v2 $x \\cdot y = k$)?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Constant Function Market Makers (Uniswap v2 $x \\cdot y = k$) to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Constant Function Market Makers (Uniswap v2 $x \\cdot y = k$)?",
      "choices": [
        "Overfitting in-sample noise and suffering catastrophic live drawdown from non-stationarity",
        "Using too much compute in Python",
        "Calculating standard deviation too accurately",
        "Diversifying across too many uncorrelated assets"
      ],
      "answer": 0,
      "why": "In quantitative finance, backtests easily overfit historical noise. Strategies must be validated with purged cross-validation and tested under realistic execution slippage."
    },
    {
      "q": "Which performance or risk metric is most critical when evaluating Constant Function Market Makers (Uniswap v2 $x \\cdot y = k$)?",
      "choices": [
        "Risk-adjusted returns (Sharpe ratio, Information ratio, Maximum Drawdown, and Tail Risk CVaR)",
        "Raw cumulative return without risk adjustment",
        "Total number of trades executed per minute only",
        "The length of the Python script"
      ],
      "answer": 0,
      "why": "Raw returns are meaningless without quantifying the risk taken. Quants prioritize Sharpe/Information ratios and strictly bound tail drawdowns."
    }
  ],
  "concentrated-liquidity": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Uniswap v3 Concentrated Liquidity & Impermanent Loss?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Uniswap v3 Concentrated Liquidity & Impermanent Loss to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Uniswap v3 Concentrated Liquidity & Impermanent Loss?",
      "choices": [
        "Overfitting in-sample noise and suffering catastrophic live drawdown from non-stationarity",
        "Using too much compute in Python",
        "Calculating standard deviation too accurately",
        "Diversifying across too many uncorrelated assets"
      ],
      "answer": 0,
      "why": "In quantitative finance, backtests easily overfit historical noise. Strategies must be validated with purged cross-validation and tested under realistic execution slippage."
    },
    {
      "q": "Which performance or risk metric is most critical when evaluating Uniswap v3 Concentrated Liquidity & Impermanent Loss?",
      "choices": [
        "Risk-adjusted returns (Sharpe ratio, Information ratio, Maximum Drawdown, and Tail Risk CVaR)",
        "Raw cumulative return without risk adjustment",
        "Total number of trades executed per minute only",
        "The length of the Python script"
      ],
      "answer": 0,
      "why": "Raw returns are meaningless without quantifying the risk taken. Quants prioritize Sharpe/Information ratios and strictly bound tail drawdowns."
    }
  ],
  "mev-arbitrage": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Maximal Extractable Value (MEV): Sandwiches & Arbitrage?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Maximal Extractable Value (MEV): Sandwiches & Arbitrage to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Maximal Extractable Value (MEV): Sandwiches & Arbitrage?",
      "choices": [
        "Overfitting in-sample noise and suffering catastrophic live drawdown from non-stationarity",
        "Using too much compute in Python",
        "Calculating standard deviation too accurately",
        "Diversifying across too many uncorrelated assets"
      ],
      "answer": 0,
      "why": "In quantitative finance, backtests easily overfit historical noise. Strategies must be validated with purged cross-validation and tested under realistic execution slippage."
    },
    {
      "q": "Which performance or risk metric is most critical when evaluating Maximal Extractable Value (MEV): Sandwiches & Arbitrage?",
      "choices": [
        "Risk-adjusted returns (Sharpe ratio, Information ratio, Maximum Drawdown, and Tail Risk CVaR)",
        "Raw cumulative return without risk adjustment",
        "Total number of trades executed per minute only",
        "The length of the Python script"
      ],
      "answer": 0,
      "why": "Raw returns are meaningless without quantifying the risk taken. Quants prioritize Sharpe/Information ratios and strictly bound tail drawdowns."
    }
  ],
  "perpetuals-funding": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Perpetual Futures: Funding Rate Arbitrage & Basis Trade?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Perpetual Futures: Funding Rate Arbitrage & Basis Trade to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Perpetual Futures: Funding Rate Arbitrage & Basis Trade?",
      "choices": [
        "Overfitting in-sample noise and suffering catastrophic live drawdown from non-stationarity",
        "Using too much compute in Python",
        "Calculating standard deviation too accurately",
        "Diversifying across too many uncorrelated assets"
      ],
      "answer": 0,
      "why": "In quantitative finance, backtests easily overfit historical noise. Strategies must be validated with purged cross-validation and tested under realistic execution slippage."
    },
    {
      "q": "Which performance or risk metric is most critical when evaluating Perpetual Futures: Funding Rate Arbitrage & Basis Trade?",
      "choices": [
        "Risk-adjusted returns (Sharpe ratio, Information ratio, Maximum Drawdown, and Tail Risk CVaR)",
        "Raw cumulative return without risk adjustment",
        "Total number of trades executed per minute only",
        "The length of the Python script"
      ],
      "answer": 0,
      "why": "Raw returns are meaningless without quantifying the risk taken. Quants prioritize Sharpe/Information ratios and strictly bound tail drawdowns."
    }
  ],
  "cross-exchange-arb": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind CEX-DEX Triangular & Statistical Arbitrage?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing CEX-DEX Triangular & Statistical Arbitrage to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing CEX-DEX Triangular & Statistical Arbitrage?",
      "choices": [
        "Overfitting in-sample noise and suffering catastrophic live drawdown from non-stationarity",
        "Using too much compute in Python",
        "Calculating standard deviation too accurately",
        "Diversifying across too many uncorrelated assets"
      ],
      "answer": 0,
      "why": "In quantitative finance, backtests easily overfit historical noise. Strategies must be validated with purged cross-validation and tested under realistic execution slippage."
    },
    {
      "q": "Which performance or risk metric is most critical when evaluating CEX-DEX Triangular & Statistical Arbitrage?",
      "choices": [
        "Risk-adjusted returns (Sharpe ratio, Information ratio, Maximum Drawdown, and Tail Risk CVaR)",
        "Raw cumulative return without risk adjustment",
        "Total number of trades executed per minute only",
        "The length of the Python script"
      ],
      "answer": 0,
      "why": "Raw returns are meaningless without quantifying the risk taken. Quants prioritize Sharpe/Information ratios and strictly bound tail drawdowns."
    }
  ],
  "on-chain-analytics": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Mempool Monitoring & Smart Contract Bot Architecture?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Mempool Monitoring & Smart Contract Bot Architecture to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Mempool Monitoring & Smart Contract Bot Architecture?",
      "choices": [
        "Overfitting in-sample noise and suffering catastrophic live drawdown from non-stationarity",
        "Using too much compute in Python",
        "Calculating standard deviation too accurately",
        "Diversifying across too many uncorrelated assets"
      ],
      "answer": 0,
      "why": "In quantitative finance, backtests easily overfit historical noise. Strategies must be validated with purged cross-validation and tested under realistic execution slippage."
    },
    {
      "q": "Which performance or risk metric is most critical when evaluating Mempool Monitoring & Smart Contract Bot Architecture?",
      "choices": [
        "Risk-adjusted returns (Sharpe ratio, Information ratio, Maximum Drawdown, and Tail Risk CVaR)",
        "Raw cumulative return without risk adjustment",
        "Total number of trades executed per minute only",
        "The length of the Python script"
      ],
      "answer": 0,
      "why": "Raw returns are meaningless without quantifying the risk taken. Quants prioritize Sharpe/Information ratios and strictly bound tail drawdowns."
    }
  ]
}
};
