// API DOCUMENTATION

/**
 * @typedef {Object} NetworkInfo
 * @property {string} key - Chain ID with namespace (e.g., eip155:97)
 * @property {string} name - Human-readable network name
 * @property {string} imageUrl - URL of the network image (usually hosted on IPFS or similar)
 * @property {string} depositAddress - Deposit address on this network
 * @property {string} tokenFactoryContractAddress - Contract address for the token factory
 * @property {string} tokenCreationFee - Token creation fee in wei (as string to preserve precision)
 * @property {string} addressExplorerUrl - Template URL to explore addresses, replace `{address}` with actual address
 * @property {string} transactionExplorerUrl - Template URL to explore transactions, replace `{hash}` with actual tx hash
 * @property {string} lastIndexedBlockNumber - The last block number that was indexed (as string)
 */

// This file only contains type definitions for reuse via JSDoc.

/** 
 * @typedef {Object} AppConfig
 * @property {Number} chainId - deprecated use blockchain key on network info instead
 * @property {String} bnbInUsd - irrelevant for new multichain specification
 * @property {String} quickBuyBnbAmount - irrelevant for new multichain specification. Use quickBuyDefaultUsdAmount instead
 * @property {String} bondingCurveBnbTarget - use bondingCurveUsdTarget on /api/v1/blockchains instead
 * @property {String} winnerMilestoneBnbTarget - irrelevant for new multichain specification
 * @property {String} tokenFactoryAddress - deprecated use blockchain key on network info instead
 * @property {String} quickBuySlippage - use quickBuyDefaultSlippage instead
 * @property {String} quickBuyDefaultUsdAmount - 
 * @property {String} quickBuyDefaultSlippage - 
 * @property {String} bondingCurveUsdTarget - 
 * @property {String} winnerMilestoneUsdTarget - 
*/