/**
 * Script to fetch historical Bitcoin price data from CryptoCompare API
 * @author Your Name
 * @date ${new Date().toISOString().split('T')[0]}
 */

const https = require("https");
const fs = require("fs");

/**
 * Sleep function to handle API rate limits
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetches data from the API with retry logic
 * @param {string} url - API URL to fetch
 * @returns {Promise<Object>} - JSON response
 */
async function fetchWithRetry(url) {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`Fetching: ${url}`);
      const response = await new Promise((resolve, reject) => {
        https
          .get(url, (res) => {
            if (res.statusCode === 429) {
              reject(new Error("Rate limited"));
              return;
            }

            let data = "";
            res.on("data", (chunk) => {
              data += chunk;
            });
            res.on("end", () => {
              try {
                resolve(JSON.parse(data));
              } catch (e) {
                reject(new Error(`Invalid JSON: ${e.message}`));
              }
            });
          })
          .on("error", reject);
      });

      return response;
    } catch (error) {
      console.error(
        `Attempt ${retries + 1}/${maxRetries} failed: ${error.message}`
      );
      retries++;

      if (error.message.includes("Rate limited")) {
        const waitTime = Math.pow(2, retries) * 1000; // Exponential backoff
        console.log(`Rate limited. Waiting ${waitTime / 1000} seconds...`);
        await sleep(waitTime);
      } else if (retries === maxRetries) {
        throw error;
      } else {
        await sleep(1000);
      }
    }
  }

  throw new Error("Max retries reached");
}

/**
 * Fetches all historical daily Bitcoin price data from CryptoCompare
 * @returns {Promise<Array>} - Combined price data
 */
async function fetchBitcoinHistoricalData() {
  // CryptoCompare API limits
  const LIMIT = 2000; // Max data points per request

  try {
    console.log("Fetching all historical Bitcoin data from CryptoCompare...");

    // Fetch all historical daily data
    // CryptoCompare has complete historical data and automatically returns all available data
    const url =
      "https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=2000&allData=true";

    const response = await fetchWithRetry(url);

    if (response.Response === "Error") {
      throw new Error(`API Error: ${response.Message}`);
    }

    const data = response.Data.Data;
    console.log(`Fetched ${data.length} daily price points`);

    // Convert to our format
    return data
      .filter((item) => item.time > 0 && item.close > 0) // Filter out any invalid entries
      .map((item) => ({
        date: new Date(item.time * 1000).toISOString().split("T")[0],
        price: item.close,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error(`Error fetching Bitcoin data: ${error.message}`);
    throw error;
  }
}

/**
 * Calculates power trend line and percentile bands
 * @param {Array<{date: string, price: number}>} data - Price data array
 * @returns {Array<Object>} Power trend data and percentile bands
 */
function calculatePowerTrend(data) {
  const INTERCEPT = 1.47e-17;
  const SLOPE = 5.78;

  // Genesis block date
  const genesisDate = new Date("2009-01-03");

  return data
    .map((point) => {
      const daysFromGenesis =
        (new Date(point.date) - genesisDate) / (1000 * 60 * 60 * 24);

      // Skip entries with invalid days (avoid negative or zero)
      if (daysFromGenesis <= 0) return null;

      const trendPrice = INTERCEPT * Math.pow(daysFromGenesis, SLOPE);

      // Calculate percentile bands based on the article's methodology
      return {
        date: point.date,
        days: Math.floor(daysFromGenesis),
        price: point.price,
        trendPrice: trendPrice,
        percentile2_5: trendPrice * 0.2, // Approximate multipliers based on article
        percentile16_5: trendPrice * 0.5,
        percentile83_5: trendPrice * 2,
        percentile97_5: trendPrice * 5,
      };
    })
    .filter(Boolean); // Remove null entries
}

/**
 * Main function to fetch data and save to file
 */
async function main() {
  try {
    console.log("Fetching Bitcoin historical price data...");
    const priceData = await fetchBitcoinHistoricalData();

    console.log(`Processing ${priceData.length} daily price points`);
    console.log("Calculating power trend...");

    const powerTrendData = calculatePowerTrend(priceData);

    // Create final data object
    const outputData = {
      lastUpdated: new Date().toISOString(),
      dataPoints: priceData.length,
      prices: priceData,
      powerTrend: powerTrendData,
      coefficients: {
        intercept: 1.47e-17,
        slope: 5.78,
      },
    };

    // Save to file
    fs.writeFileSync("bitcoin_data.json", JSON.stringify(outputData, null, 2));

    console.log("Data successfully saved to bitcoin_data.json");
  } catch (error) {
    console.error("Error in main process:", error);
    process.exit(1);
  }
}

// Run the script
main();
