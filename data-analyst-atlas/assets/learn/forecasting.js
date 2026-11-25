window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["forecasting"] = {
  quiz: {
    "ts-components": [
      { q: "What are the core components of classical time series decomposition?",
        choices: ["Slope, intercept, and error", "Trend, Seasonality, Cyclical patterns, and Irregular/Noise residuals", "Mean, median, and mode", "P-value, t-statistic, and F-statistic"],
        answer: 1,
        why: "Classical decomposition breaks a series into long-term Trend (T), repeating calendar Seasonality (S), business Cycles (C), and random Residual Noise (R)." },
      { q: "When should an analyst use a multiplicative decomposition (\(Y_t = T_t \times S_t \times R_t\)) rather than an additive decomposition (\(Y_t = T_t + S_t + R_t\))?",
        choices: ["When the seasonal swings increase in amplitude proportionally as the overall trend level of the series rises", "When the series has negative values", "When the seasonal fluctuations remain constant in size regardless of trend level", "Only on leap years"],
        answer: 0,
        why: "Multiplicative models suit series where seasonal swings expand proportionally with the trend (e.g. holiday retail revenue doubling as the company doubles in size)." },
      { q: "How does cyclical variation differ from seasonal variation in time series data?",
        choices: ["They are identical", "Seasonality has fixed, known calendar frequencies (e.g. 7-day weekly or 12-month annual); cycles vary in duration and are driven by macro-economic business fluctuations", "Cycles only occur on weekends", "Seasonality has no pattern"],
        answer: 1,
        why: "Seasonal patterns repeat at predictable calendar intervals; business cycles vary in duration and magnitude." }
    ],
    "smoothing": [
      { q: "In Simple Exponential Smoothing, what does a smoothing parameter of \(\alpha = 0.9\) imply?",
        choices: ["Equal weight to all historical observations", "Very heavy weight placed on the most recent observation, with older history discounted rapidly", "The forecast is completely flat", "No weighting on recent observations"],
        answer: 1,
        why: "Alpha controls the decay rate: values near 1 react rapidly to recent changes, while values near 0 produce very smooth, sluggish forecasts." },
      { q: "What does Holt-Winters exponential smoothing add beyond simple exponential smoothing?",
        choices: ["Deep neural network layers", "Explicit equations to track and update both Trend (\(\beta\)) and Seasonality (\(\gamma\)) components alongside level (\(\alpha\))", "SQL database joins", "Automatic outlier deletion"],
        answer: 1,
        why: "Holt-Winters (triple exponential smoothing) handles series with both ongoing linear/damped trends and repeating seasonal cycles." },
      { q: "Why is a centered moving average problematic for generating forward-looking business forecasts?",
        choices: ["It uses too much memory", "A centered moving average requires future observations that have not yet occurred to compute the middle point", "It cannot calculate averages", "It doubles all values"],
        answer: 1,
        why: "Centered moving averages smooth historical series by looking backward and forward; real-time forecasting requires trailing (causal) moving averages." }
    ],
    "baselines": [
      { q: "What is a Seasonal Naïve baseline forecast for monthly data?",
        choices: ["The average of the entire historical series", "Setting next month's forecast equal to the value observed in the exact same month of the previous year (\(\hat{y}_{t} = y_{t-12}\))", "Setting the forecast to zero", "A linear regression fit"],
        answer: 1,
        why: "Seasonal naïve forecasts project the most recent observation from the corresponding season, providing a tough baseline for complex models to beat." },
      { q: "Why is establishing simple baseline forecasts (Naïve, Seasonal Naïve, Drift) essential before building complex ML models?",
        choices: ["Baselines are required by database indexes", "If an expensive machine learning model cannot outperform a zero-effort seasonal naïve baseline, deploying it into production is an unjustified waste of resources", "Baselines remove all missing data", "Because python requires a baseline object"],
        answer: 1,
        why: "A complex model that fails to beat simple persistence or seasonal naive baselines does not add true predictive value." },
      { q: "What does the Drift method do in baseline forecasting?",
        choices: ["Randomly varies forecasts by ±10%", "Extrapolates the average historical change (slope) from the very first observation to the very last observation into the future", "Drifts all values toward the median", "Filters out weekends"],
        answer: 1,
        why: "The drift method draws a line connecting the first and last historical points, projecting that average historical trajectory into the future." }
    ],
    "arima-ets": [
      { q: "What does stationarity mean in time series analysis?",
        choices: ["The time series has a steep upward trend", "The statistical properties of the series (mean, variance, and autocovariance) are constant over time and do not depend on the time at which the series is observed", "The series has identical values every day", "The database is not updating"],
        answer: 1,
        why: "Stationarity requires constant mean, constant variance, and autocovariance that depends only on lag distance, satisfying ARIMA assumptions." },
      { q: "What does the 'I' (Integrated) parameter \(d\) represent in an \(\text{ARIMA}(p, d, q)\) model?",
        choices: ["The number of iterations", "The number of times the raw series must be differenced (\(y'_t = y_t - y_{t-1}\)) to achieve stationarity", "The number of input tables", "The interest rate"],
        answer: 1,
        why: "Differencing subtracts consecutive observations to eliminate non-stationary trends and unit roots." },
      { q: "What do the Partial Autocorrelation Function (PACF) plots help determine in ARIMA modeling?",
        choices: ["The number of seasons", "The order \(p\) of the Autoregressive (AR) component, by showing the direct correlation between \(y_t\) and \(y_{t-k}\) after controlling for intervening lags", "The forecast error rate", "The total database size"],
        answer: 1,
        why: "PACF cuts off sharply after lag \(p\) for pure AR processes, revealing the appropriate order of autoregressive terms." }
    ],
    "forecast-eval": [
      { q: "Why is standard k-fold cross-validation invalid for evaluating time series forecasting models?",
        choices: ["It takes too long to run", "Randomly shuffling data leaks future information into the training set, violating temporal causality", "Time series data cannot be stored in arrays", "Cross-validation only works on classification"],
        answer: 1,
        why: "Time series data has temporal dependency. Evaluating models requires forward-chaining rolling window validation (backtesting) that respects chronology." },
      { q: "What is a major limitation of Mean Absolute Percentage Error (MAPE)?",
        choices: ["It cannot be computed for large numbers", "It divides by the actual value, becoming undefined or exploding to infinity when actual values are zero or near zero, and penalizes over-forecasts more heavily than under-forecasts", "It ignores the error direction", "It requires KaTeX rendering"],
        answer: 1,
        why: "Division by zero makes MAPE unusable for intermittent or zero-demand series. MASE or WAPE are safer alternatives." },
      { q: "How does Root Mean Squared Error (RMSE) differ from Mean Absolute Error (MAE)?",
        choices: ["RMSE squares errors before averaging, penalizing large outlier forecast misses much more heavily than MAE", "MAE is always larger than RMSE", "RMSE ignores negative errors", "There is no difference"],
        answer: 0,
        why: "Because RMSE squares the error terms, large forecast misses contribute disproportionately, making it ideal when large errors carry severe business costs." }
    ],
    "anomalies": [
      { q: "How does STL (Seasonal and Trend decomposition using Loess) help in detecting time series anomalies?",
        choices: ["It deletes unusual values automatically", "By stripping away predictable trend and seasonal patterns, isolating the residual noise component where true anomalies appear as large statistical deviations", "It predicts stock market prices", "It normalizes all numbers to between 0 and 1"],
        answer: 1,
        why: "True anomalies are unexpected deviations from expected seasonal patterns, which show up clearly in the decomposed residuals." },
      { q: "Why is applying a static global threshold (e.g. 'alert if orders < 500') ineffective for detecting anomalies on a growing website?",
        choices: ["Static thresholds cannot trigger emails", "Normal daily volume naturally fluctuates with day-of-week seasonality and ongoing business growth, causing endless false alarms at night and missed failures during peak hours", "500 is not a valid number", "Databases only support percentage thresholds"],
        answer: 1,
        why: "Static thresholds ignore seasonality and trend. Effective alerting uses dynamic rolling bounds (e.g. 3 standard deviations from predicted seasonal baseline)." },
      { q: "What is a point anomaly compared to a contextual anomaly?",
        choices: ["A point anomaly is an individual data point that is an outlier globally; a contextual anomaly is normal in magnitude but abnormal within its specific temporal context (such as high sales at 3 AM)", "They are identical", "Point anomalies only happen on charts", "Contextual anomalies are always caused by hardware failure"],
        answer: 0,
        why: "Contextual anomalies depend on context: $10,000 in hourly sales is normal at noon on Black Friday, but a severe anomaly at 3:00 AM on a Tuesday." }
    ]
  }
};
