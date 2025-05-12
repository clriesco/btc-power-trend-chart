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

## License

```
Apache License 2.0

Copyright 2025 Charly López

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