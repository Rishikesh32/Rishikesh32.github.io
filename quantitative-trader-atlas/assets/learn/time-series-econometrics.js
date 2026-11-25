window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["time-series-econometrics"] = {
  quiz: {
  "stationarity-tests": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Stationarity, Autocorrelation & Unit Root Tests?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Stationarity, Autocorrelation & Unit Root Tests to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Stationarity, Autocorrelation & Unit Root Tests?",
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
      "q": "Which performance or risk metric is most critical when evaluating Stationarity, Autocorrelation & Unit Root Tests?",
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
  "arima-models": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind AR, MA, ARMA & ARIMA Models?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing AR, MA, ARMA & ARIMA Models to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing AR, MA, ARMA & ARIMA Models?",
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
      "q": "Which performance or risk metric is most critical when evaluating AR, MA, ARMA & ARIMA Models?",
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
  "garch-volatility": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind GARCH, EGARCH & Volatility Clustering?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing GARCH, EGARCH & Volatility Clustering to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing GARCH, EGARCH & Volatility Clustering?",
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
      "q": "Which performance or risk metric is most critical when evaluating GARCH, EGARCH & Volatility Clustering?",
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
  "cointegration-tests": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Cointegration & Engle-Granger Two-Step?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Cointegration & Engle-Granger Two-Step to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Cointegration & Engle-Granger Two-Step?",
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
      "q": "Which performance or risk metric is most critical when evaluating Cointegration & Engle-Granger Two-Step?",
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
  "vector-autoregression": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Vector Autoregression (VAR) & VECM?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Vector Autoregression (VAR) & VECM to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Vector Autoregression (VAR) & VECM?",
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
      "q": "Which performance or risk metric is most critical when evaluating Vector Autoregression (VAR) & VECM?",
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
  "regime-switching": [
    {
      "q": "In quantitative trading, what is the primary theoretical principle behind Markov Regime-Switching Models?",
      "choices": [
        "Formulating robust mathematical risk controls and eliminating lookahead/overfitting leakage",
        "Using uncalibrated heuristics without backtesting",
        "Maximizing leverage regardless of volatility",
        "Ignoring transaction costs and order slippage"
      ],
      "answer": 0,
      "why": "Quantitative rigor requires formalizing Markov Regime-Switching Models to ensure statistical validity, risk-adjusted returns, and survivability under regime shifts."
    },
    {
      "q": "What is the most dangerous practical pitfall when implementing Markov Regime-Switching Models?",
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
      "q": "Which performance or risk metric is most critical when evaluating Markov Regime-Switching Models?",
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
