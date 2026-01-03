# Bitcoin Power Trend Chart

An interactive visualization of Bitcoin's historical price with a power law trend line and its percentile bands.

## Technologies Used

- **Node.js**: For running data fetching scripts
- **HighCharts**: JavaScript library for interactive data visualization
- **CryptoCompare API**: Source of Bitcoin historical data
- **HTML/CSS/JavaScript**: Frontend for visualization

## Installation

1. Clone this repository:
```bash
git clone https://github.com/clriesco/btc-power-trend-chart.git
cd btc-power-trend-chart
```

2. Install dependencies:
```bash
npm install
```

## Execution

1. Get historical data by running:
```bash
npm run fetch-data
```

2. Start the web server:
```bash
npm start
```

You can also open `index.html` directly in your browser.

## Automated Data Updates

The project uses GitHub Actions to automatically update Bitcoin data daily. The workflow:

- Runs every day at 00:00 UTC
- Fetches the latest Bitcoin price data from CryptoCompare API
- Automatically commits and pushes changes to the `main` branch
- Triggers Netlify deployment automatically

You can also manually trigger the update from the GitHub Actions tab in your repository.

## Bitcoin Power Law Trend Analysis

### The Mathematical Relationship

Bitcoin follows a trend that fits a power law with the following formula:

```
y = ax^b
```

Where:
- y: Bitcoin price (dependent variable)
- a: Intercept coefficient (1.47E-17)
- b: Slope coefficient (5.78)
- x: Time in days since the genesis block (January 3, 2009)

### Percentile Bands

The bands around the trend line represent historical percentiles, similar to standard deviations in statistics, but without assuming a bell curve:

- Between the red bands (2.5 and 97.5 percentile): represents 95% of observations
- Between the blue bands (16.5 and 83.5 percentile): represents 67% of observations

### Log-Log Chart

A distinctive characteristic of power laws is that when plotted on logarithmic scales for both price (y-axis) and time (x-axis), the trend becomes a straight line. This pattern visually confirms the power law nature of Bitcoin's price.

### Price Doubling

A detailed analysis shows that for approximately every 12.7% increase in the number of days Bitcoin has existed, the price on the trend line doubles. This proportional pattern remains consistent regardless of the starting point.

For example:
| Date | Days since genesis | Trend price | Days to double | % Increase in days |
|-------|-------------------:|------------------|-------------------:|---------------------:|
| 2020-12-11 | 4,360 | 16,318 | 492 | 12.7% |
| 2022-06-20 | 4,916 | 32,637 | 556 | 12.7% |
| 2024-03-07 | 5,542 | 65,274 | 626 | 12.7% |

### The Long-Term Trend

The trend line has remained remarkably stable since 2016, adjusting to each new daily data point. This stability indicates that the power law model may be a useful framework for understanding Bitcoin's long-term price behavior.

It's important to note that this model doesn't "predict" the future in the strict sense. It serves more as a guide and reference, adjusting with each new data point:
- If the price is below the trend line, it adjusts downward
- If the price is above, the trend adjusts upward

### Why a Power Law?

The reason Bitcoin follows a power law is likely related to its network adoption nature. While traditional financial markets typically move exponentially due to credit and compound interest, Bitcoin behaves differently because it represents the adoption of a new form of secure digital money on a global scale.

### Outlier Analysis & Extreme Events Regression

#### Identifying Market Extremes

The visualization includes an outlier analysis that identifies extreme market conditions:

- **Extreme Outliers**: Points that deviate significantly from the power trend (beyond the 2.5 and 97.5 percentile bands)
- **Market Cycle Tops**: Local maxima that represent significant price peaks
- **Market Cycle Bottoms**: Local minima that represent significant price troughs

#### Extreme Events Regression Line

A linear regression line connects the most significant market tops and bottoms when plotted on the log-log chart:

```
log(y) = m * log(x) + b
```

Where:
- y: Bitcoin price at extreme points
- x: Time in days since genesis
- m: Slope coefficient
- b: Intercept coefficient

This regression line serves several purposes:
- Identifies the trajectory of market extremes
- Provides potential support and resistance levels
- Helps distinguish between normal volatility and true market extremes

#### Practical Applications

The extreme events regression can be used to:

1. **Gauge Market Temperature**: Extreme deviations above the regression line may indicate overheated market conditions
2. **Identify Potential Value Zones**: Areas near or below the regression line during downtrends may represent value accumulation opportunities
3. **Risk Management**: Setting rational expectations about potential drawdowns based on historical extreme events

It's important to note that this analysis is descriptive, not prescriptive. Past patterns may not repeat exactly, but they provide a framework for understanding Bitcoin's volatility characteristics.

## Visualizer Features

- Interactive chart with zoom and pan capabilities
- Logarithmic scale for better visualization of growth
- Export to PNG, JPEG, PDF, and CSV
- Responsive design that adapts to different screen sizes
- Alternative view in log-log chart
- **Power Law Oscillator**: Normalized deviation from the trend line showing market "temperature"
- **Halving Event Markers**: Visual indicators for all Bitcoin halving events with countdown timer
- **Synchronized Charts**: Price chart and oscillator chart are synchronized for easy comparison

## Power Law Oscillator

The Power Law Oscillator is a normalized representation of the distance between the actual Bitcoin price and the central trend line (y = ax^b). It eliminates the upward slope to show only market "volatility" or "temperature" on a horizontal scale, making it easier to identify periods of overvaluation or undervaluation relative to the long-term power law trend.

### Why Use Logarithms?

Bitcoin's price has grown exponentially over time, following a power law relationship. This means that:
- A $1,000 deviation from the trend in 2010 represents a much larger percentage change than a $1,000 deviation in 2024
- The absolute difference between price and trend becomes less meaningful as prices increase
- Using logarithms normalizes these differences, making them comparable across different time periods

### Mathematical Foundation

The oscillator is calculated using the formula:

```
Oscillator = log₁₀(Actual Price) - log₁₀(Trend Price)
```

This formula transforms the multiplicative relationship between actual price and trend price into an additive one. In logarithmic space:
- **Positive values**: The actual price is above the trend line (overvalued relative to trend)
- **Negative values**: The actual price is below the trend line (undervalued relative to trend)
- **Zero value**: The actual price exactly matches the trend line

### Understanding the Scale

The oscillator uses a logarithmic scale, which means:
- **+0.3**: The price is approximately 2× (10^0.3 ≈ 2) the trend price
- **+0.6**: The price is approximately 4× (10^0.6 ≈ 4) the trend price
- **-0.3**: The price is approximately 0.5× (10^-0.3 ≈ 0.5) the trend price
- **-0.6**: The price is approximately 0.25× (10^-0.6 ≈ 0.25) the trend price

### Interpretation Zones

The oscillator chart is divided into three color-coded zones based on historical percentiles:

#### Green Zone (Oversold Conditions)
- **Values ≤ 2.5th percentile**: Historically, only 2.5% of observations fall at or below this level
- **Market condition**: Extreme undervaluation relative to the power trend
- **Historical context**: These periods have often preceded significant price increases
- **Risk/Reward**: Higher potential reward, but timing entry can be challenging

#### Neutral Zone (Normal Range)
- **Values between 2.5th and 97.5th percentiles**: Represents 95% of historical observations
- **Market condition**: Price is within normal historical deviation from trend
- **Trading context**: Most of Bitcoin's history has been spent in this range

#### Red Zone (Overbought Conditions)
- **Values ≥ 97.5th percentile**: Historically, only 2.5% of observations fall at or above this level
- **Market condition**: Extreme overvaluation relative to the power trend
- **Historical context**: These periods have often preceded significant price corrections
- **Risk/Reward**: Higher risk of correction, but timing exit can be challenging

### Practical Applications

#### 1. Market Temperature Gauge
The oscillator serves as a "thermometer" for Bitcoin's market condition:
- **High positive values** (red zone): Market is "hot" - prices are significantly above the long-term trend
- **Low negative values** (green zone): Market is "cold" - prices are significantly below the long-term trend
- **Near zero**: Market is "temperate" - prices align with the power law trend

#### 2. Historical Context
By removing the upward trend, the oscillator allows you to:
- Compare market conditions across different eras (e.g., 2013 vs 2021)
- Identify when current conditions are similar to past extremes
- Understand that a $10,000 price in 2013 might be as "overvalued" as a $100,000 price in 2024

#### 3. Trend Reversion Analysis
The oscillator helps identify:
- **Mean reversion opportunities**: Extreme values tend to revert toward zero over time
- **Momentum continuation**: Values near zero with strong momentum may continue
- **Cycle identification**: Patterns of oscillation around the trend line

#### 4. Risk Management
Use the oscillator to:
- **Set expectations**: Understand when prices are at historical extremes
- **Position sizing**: Consider reducing exposure in red zones, increasing in green zones
- **Time horizons**: Extreme values may persist longer than expected, requiring patience

### Advantages Over Other Metrics

1. **Time-normalized**: Unlike percentage deviations, the oscillator accounts for Bitcoin's exponential growth
2. **Trend-relative**: Measures deviation from the power law trend, not arbitrary price levels
3. **Historical perspective**: Uses percentiles based on all historical data, not just recent periods
4. **Visual clarity**: The horizontal scale makes it easy to compare conditions across time

### Limitations and Considerations

- **Not a timing tool**: Extreme values don't predict when reversals will occur
- **Trend adaptation**: The power trend itself adjusts with new data, so the oscillator is relative, not absolute
- **Context matters**: External factors (regulations, adoption, macro conditions) can override historical patterns
- **Past ≠ Future**: Historical patterns may not repeat exactly

### Synchronization with Price Chart

The oscillator chart is synchronized with the main price chart:
- **Shared X-axis**: Both charts show the same time period
- **Zoom synchronization**: Zooming or panning one chart automatically updates the other
- **Tooltip integration**: Hovering over the price chart shows the corresponding oscillator value

This synchronization allows you to:
- See how price movements relate to trend deviations
- Identify periods when price and oscillator diverge
- Analyze the relationship between price action and trend alignment

## Halving Events Analysis

The visualization includes automatic markers for all Bitcoin halving events:

- **H1**: November 28, 2012 (25 BTC reward era)
- **H2**: July 9, 2016 (12.5 BTC reward era)
- **H3**: May 11, 2020 (6.25 BTC reward era)
- **H4**: April 20, 2024 (3.125 BTC reward era)
- **H5**: April 20, 2028 (1.5625 BTC reward era - projected)

Each halving is marked with a vertical line and labeled with its corresponding era. A countdown timer displays the time remaining until the next halving event.

### Configuration

Halving dates are stored in `constants.js` for easy updates. The configuration includes:
- Exact dates for historical halvings
- Projected dates for future halvings
- Block heights and reward amounts
- Era labels for each halving period

## License

```
Apache License 2.0

Copyright 2026 Charly López

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```