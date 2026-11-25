window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["stochastic-calculus"] = {
  quiz: {
  "brownian-motion": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Brownian Motion & Wiener Process?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Brownian Motion & Wiener Process to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Brownian Motion & Wiener Process?",
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
      "q": "Which performance or risk metric is most critical when evaluating Brownian Motion & Wiener Process?",
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
  "ito-lemma": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Itô's Lemma & Stochastic Integration?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Itô's Lemma & Stochastic Integration to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Itô's Lemma & Stochastic Integration?",
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
      "q": "Which performance or risk metric is most critical when evaluating Itô's Lemma & Stochastic Integration?",
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
  "girsanov-theorem": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Girsanov's Theorem & Risk-Neutral Measures?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Girsanov's Theorem & Risk-Neutral Measures to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Girsanov's Theorem & Risk-Neutral Measures?",
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
      "q": "Which performance or risk metric is most critical when evaluating Girsanov's Theorem & Risk-Neutral Measures?",
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
  "geometric-brownian-motion": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Geometric Brownian Motion (GBM)?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Geometric Brownian Motion (GBM) to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Geometric Brownian Motion (GBM)?",
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
      "q": "Which performance or risk metric is most critical when evaluating Geometric Brownian Motion (GBM)?",
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
  "ornstein-uhlenbeck": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Ornstein-Uhlenbeck Mean-Reverting Process?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Ornstein-Uhlenbeck Mean-Reverting Process to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Ornstein-Uhlenbeck Mean-Reverting Process?",
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
      "q": "Which performance or risk metric is most critical when evaluating Ornstein-Uhlenbeck Mean-Reverting Process?",
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
  "jump-diffusion": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Jump-Diffusion & Merton Model?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Jump-Diffusion & Merton Model to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Jump-Diffusion & Merton Model?",
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
      "q": "Which performance or risk metric is most critical when evaluating Jump-Diffusion & Merton Model?",
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
