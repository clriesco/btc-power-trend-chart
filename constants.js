/**
 * Constants for Bitcoin Power Trend Chart
 * Contains halving dates and configuration values
 * @module constants
 */

/**
 * Bitcoin halving dates
 * @type {Array<Object>}
 */
const HALVINGS = [
  {
    number: 1,
    date: '2012-11-28',
    blockHeight: 210000,
    reward: 25,
    label: 'H1 - Era de Recompensa de 25 BTC'
  },
  {
    number: 2,
    date: '2016-07-09',
    blockHeight: 420000,
    reward: 12.5,
    label: 'H2 - Era de Recompensa de 12.5 BTC'
  },
  {
    number: 3,
    date: '2020-05-11',
    blockHeight: 630000,
    reward: 6.25,
    label: 'H3 - Era de Recompensa de 6.25 BTC'
  },
  {
    number: 4,
    date: '2024-04-20',
    blockHeight: 840000,
    reward: 3.125,
    label: 'H4 - Era de Recompensa de 3.125 BTC'
  },
  {
    number: 5,
    date: '2028-04-20', // Estimated based on ~4 year intervals
    blockHeight: 1050000,
    reward: 1.5625,
    label: 'H5 - Era de Recompensa de 1.5625 BTC (Proyectado)',
    isProjected: true
  }
];

/**
 * Power law coefficients
 * @type {Object}
 */
const POWER_LAW_COEFFICIENTS = {
  intercept: 1.47e-17,
  slope: 5.78
};

/**
 * Percentile bands configuration
 * @type {Object}
 */
const PERCENTILE_BANDS = {
  lower: 2.5,
  lowerMiddle: 16.5,
  upperMiddle: 83.5,
  upper: 97.5
};

/**
 * Genesis block date
 * @type {Date}
 */
const GENESIS_DATE = new Date('2009-01-03');

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HALVINGS,
    POWER_LAW_COEFFICIENTS,
    PERCENTILE_BANDS,
    GENESIS_DATE
  };
}

// Export for browser
if (typeof window !== 'undefined') {
  window.BTC_CONSTANTS = {
    HALVINGS,
    POWER_LAW_COEFFICIENTS,
    PERCENTILE_BANDS,
    GENESIS_DATE
  };
}

