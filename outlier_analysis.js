/**
 * Bitcoin Outlier Analysis and Prediction
 * This script analyzes Bitcoin price outliers and predicts the next extreme event
 * @author Charly López
 * @date 2025-05-12
 */

const fs = require("fs");

/**
 * Identifies outliers in the Bitcoin price data based on percentile bands
 * @param {Array} data - Bitcoin price and trend data
 * @param {number} threshold - Percentile threshold to consider (90 for outliers, default was 97.5)
 * @returns {Array} Array of outlier events with date and severity metrics
 */
function identifyOutliers(data, threshold = 90) {
  console.log("Identifying outliers...");

  const outliers = [];

  // Loop through data to find price points exceeding the upper percentile band
  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const price = point.price;

    // For thresholds not explicitly calculated in the data, we need to interpolate
    let upperPercentile;

    if (threshold === 83.5 || threshold === 97.5) {
      // Use the pre-calculated percentiles
      upperPercentile = point[`percentile${threshold}`];
    } else if (threshold === 90) {
      // Interpolate between 83.5 and 97.5 percentiles
      const weight = (threshold - 83.5) / (97.5 - 83.5);
      upperPercentile =
        point.percentile83_5 +
        weight * (point.percentile97_5 - point.percentile83_5);
    } else {
      console.warn(
        `Percentile ${threshold} not supported. Using 83.5 percentile instead.`
      );
      upperPercentile = point.percentile83_5;
    }

    // Calculate how much the price exceeds the upper percentile band (severity)
    if (price > upperPercentile) {
      const severity = price / upperPercentile;
      outliers.push({
        date: new Date(point.date),
        days: point.days,
        price: price,
        percentile: upperPercentile,
        severity: severity,
        deviation: price - upperPercentile,
      });
    }
  }

  console.log(
    `Found ${outliers.length} outliers exceeding the ${threshold} percentile.`
  );
  return outliers;
}

/**
 * Groups outliers into distinct extreme events (market cycles peaks)
 * @param {Array} outliers - Array of outlier points
 * @param {number} maxGapDays - Maximum days between outliers to be considered the same event
 * @returns {Array} Array of outlier events
 */
function groupOutlierEvents(outliers, maxGapDays = 90) {
  console.log("Grouping outliers into distinct events...");

  if (outliers.length === 0) return [];

  // Sort outliers by date
  outliers.sort((a, b) => a.date - b.date);

  const events = [];
  let currentEvent = [outliers[0]];

  for (let i = 1; i < outliers.length; i++) {
    const prevOutlier = outliers[i - 1];
    const currOutlier = outliers[i];

    // Calculate gap in days between consecutive outliers
    const dayGap =
      (currOutlier.date - prevOutlier.date) / (1000 * 60 * 60 * 24);

    if (dayGap <= maxGapDays) {
      // Part of the same event
      currentEvent.push(currOutlier);
    } else {
      // Start a new event
      events.push(currentEvent);
      currentEvent = [currOutlier];
    }
  }

  // Don't forget the last event
  events.push(currentEvent);

  // Calculate event metrics (peak severity, duration, etc.)
  const eventSummaries = events.map((event) => {
    const peakOutlier = event.reduce(
      (max, o) => (o.severity > max.severity ? o : max),
      event[0]
    );
    const startDate = event[0].date;
    const endDate = event[event.length - 1].date;
    const durationDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

    return {
      startDate: startDate,
      endDate: endDate,
      days: peakOutlier.days,
      peakDate: peakOutlier.date,
      peakPrice: peakOutlier.price,
      peakSeverity: peakOutlier.severity,
      durationDays: durationDays,
      outlierCount: event.length,
    };
  });

  console.log(`Identified ${eventSummaries.length} distinct outlier events.`);
  return eventSummaries;
}

/**
 * Performs regression analysis on outlier events to predict next occurrence
 * @param {Array} events - Array of outlier events
 * @returns {Object} Prediction for next event including date and severity
 */
function predictNextOutlier(events) {
  console.log("Performing regression analysis on outlier events...");

  if (events.length < 2) {
    console.log("Insufficient events for regression analysis.");
    return null;
  }

  // Extract days and severity data for regression
  const X = events.map((e) => e.days); // Days since genesis
  const Y_severity = events.map((e) => e.peakSeverity); // Severity (how much price exceeded the percentile)

  // Calculate time between events (cycle length)
  const intervals = [];
  for (let i = 1; i < events.length; i++) {
    intervals.push(events[i].days - events[i - 1].days);
  }

  // Logarithmic regression for peak severity
  // ln(y) = a * ln(x) + b  =>  y = e^b * x^a
  const lnX = X.map((x) => Math.log(x));
  const lnY = Y_severity.map((y) => Math.log(y));

  // Simple linear regression on logarithmic values
  const n = lnX.length;
  const sumLnX = lnX.reduce((sum, x) => sum + x, 0);
  const sumLnY = lnY.reduce((sum, y) => sum + y, 0);
  const sumLnXLnY = lnX.reduce((sum, x, i) => sum + x * lnY[i], 0);
  const sumLnX2 = lnX.reduce((sum, x) => sum + x * x, 0);

  const a = (n * sumLnXLnY - sumLnX * sumLnY) / (n * sumLnX2 - sumLnX * sumLnX);
  const b = (sumLnY - a * sumLnX) / n;

  // Power law form: y = e^b * x^a
  const coefB = Math.exp(b);
  const coefA = a;

  // Analyze cycle lengths (time between peaks)
  // Often follows a decreasing exponential pattern
  const cycleLengthRegression = {};
  if (intervals.length > 1) {
    // Calculate coefficients for exponential decay: y = k * e^(-r*x) for cycle length
    const logIntervals = intervals.map((i) => Math.log(i));
    const xValues = Array.from({ length: intervals.length }, (_, i) => i + 1);

    const sumX = xValues.reduce((sum, x) => sum + x, 0);
    const sumLogY = logIntervals.reduce((sum, y) => sum + y, 0);
    const sumXLogY = xValues.reduce(
      (sum, x, i) => sum + x * logIntervals[i],
      0
    );
    const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope =
      (intervals.length * sumXLogY - sumX * sumLogY) /
      (intervals.length * sumX2 - sumX * sumX);
    const intercept = (sumLogY - slope * sumX) / intervals.length;

    const decayRate = -slope;
    const initialCycleLength = Math.exp(intercept);

    // Predicted next cycle length = initialCycleLength * e^(-decayRate * x)
    const nextCycleLength =
      initialCycleLength * Math.exp(-decayRate * intervals.length);

    cycleLengthRegression.initialCycleLength = initialCycleLength;
    cycleLengthRegression.decayRate = decayRate;
    cycleLengthRegression.nextPredictedLength = nextCycleLength;
  }

  // Regression for severity (how extreme the price goes above the upper percentile)
  const severityRegression = {
    powerLawForm: `Severity = ${coefB.toFixed(4)} * days^${coefA.toFixed(4)}`,
    coefficientA: coefA,
    coefficientB: coefB,
  };

  // Predict next event
  const nextEventDays =
    events[events.length - 1].days +
    (cycleLengthRegression.nextPredictedLength ||
      intervals[intervals.length - 1]);

  // Predict severity using the power law model
  const nextEventSeverity = coefB * Math.pow(nextEventDays, coefA);

  // Calculate date for next event
  const genesisDate = new Date("2009-01-03");
  const nextEventDate = new Date(
    genesisDate.getTime() + nextEventDays * 24 * 60 * 60 * 1000
  );

  return {
    prediction: {
      days: nextEventDays,
      date: nextEventDate,
      expectedSeverity: nextEventSeverity,
    },
    cycleLengthRegression,
    severityRegression,
    pastEvents: events,
  };
}

/**
 * Main function to analyze data and make predictions
 */
async function main() {
  try {
    console.log("Loading Bitcoin data...");
    const rawData = fs.readFileSync("bitcoin_data.json");
    const data = JSON.parse(rawData);

    // Identify outliers exceeding the 90 percentile (changed from 97.5)
    const outliers = identifyOutliers(data.powerTrend, 90);

    // Group outliers into distinct events (market cycle peaks)
    const events = groupOutlierEvents(outliers);

    // Print outlier events
    console.log("\nOutlier Events (Market Cycle Peaks):");
    events.forEach((event, i) => {
      console.log(`\nEvent ${i + 1}:`);
      console.log(`Peak Date: ${event.peakDate.toISOString().split("T")[0]}`);
      console.log(`Days since Genesis: ${event.days}`);
      console.log(`Peak Price: $${event.peakPrice.toLocaleString()}`);
      console.log(
        `Severity (price/percentile): ${event.peakSeverity.toFixed(2)}x`
      );
      console.log(`Duration: ${event.durationDays.toFixed(0)} days`);

      if (i > 0) {
        const daysSincePreviousPeak = event.days - events[i - 1].days;
        console.log(`Days since previous peak: ${daysSincePreviousPeak}`);
      }
    });

    // Predict next outlier event
    const prediction = predictNextOutlier(events);

    if (prediction) {
      console.log("\nPrediction for Next Extreme Event:");
      console.log(
        `Estimated Date: ${
          prediction.prediction.date.toISOString().split("T")[0]
        }`
      );
      console.log(
        `Days since Genesis: ${prediction.prediction.days.toFixed(0)}`
      );
      console.log(
        `Expected Severity: ${prediction.prediction.expectedSeverity.toFixed(
          2
        )}x above the 90 percentile`
      );

      if (prediction.cycleLengthRegression.nextPredictedLength) {
        console.log(
          `Predicted Cycle Length: ${prediction.cycleLengthRegression.nextPredictedLength.toFixed(
            0
          )} days`
        );
      }

      console.log(
        `\nRegression Model (Severity): ${prediction.severityRegression.powerLawForm}`
      );
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run the script
main();
