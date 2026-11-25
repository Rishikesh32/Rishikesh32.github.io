window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["portfolio-optimization"] = {
  quiz: {
  "mean-variance-markowitz": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Markowitz Mean-Variance & Efficient Frontier?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Markowitz Mean-Variance & Efficient Frontier to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Markowitz Mean-Variance & Efficient Frontier?",
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
      "q": "Which performance or risk metric is most critical when evaluating Markowitz Mean-Variance & Efficient Frontier?",
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
  "black-litterman": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Black-Litterman Model & Subjective Views?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Black-Litterman Model & Subjective Views to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Black-Litterman Model & Subjective Views?",
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
      "q": "Which performance or risk metric is most critical when evaluating Black-Litterman Model & Subjective Views?",
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
  "risk-parity-hrp": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Equal Risk Contribution & Hierarchical Risk Parity (HRP)?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Equal Risk Contribution & Hierarchical Risk Parity (HRP) to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Equal Risk Contribution & Hierarchical Risk Parity (HRP)?",
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
      "q": "Which performance or risk metric is most critical when evaluating Equal Risk Contribution & Hierarchical Risk Parity (HRP)?",
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
  "covariance-shrinkage": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Ledoit-Wolf & Oracle Shrinkage Estimators?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Ledoit-Wolf & Oracle Shrinkage Estimators to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Ledoit-Wolf & Oracle Shrinkage Estimators?",
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
      "q": "Which performance or risk metric is most critical when evaluating Ledoit-Wolf & Oracle Shrinkage Estimators?",
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
  "cardinality-constraints": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Transaction Cost & Turnover-Constrained Optimization?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Transaction Cost & Turnover-Constrained Optimization to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Transaction Cost & Turnover-Constrained Optimization?",
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
      "q": "Which performance or risk metric is most critical when evaluating Transaction Cost & Turnover-Constrained Optimization?",
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
  "rebalancing-friction": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Rebalancing Frequencies & Bandwidth Rules?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Rebalancing Frequencies & Bandwidth Rules to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Rebalancing Frequencies & Bandwidth Rules?",
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
      "q": "Which performance or risk metric is most critical when evaluating Rebalancing Frequencies & Bandwidth Rules?",
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
