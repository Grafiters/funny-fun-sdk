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

import { PublicKey } from "@solana/web3.js";
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

/**
 * @typedef {Object} tokenMetaData
 * @property {String} blockchainKey
 * @property {String} tokenName
 * @property {String} tokenSymbol
 * @property {String} tokenDescription
 * @property {String} tokenImage
 * @property {String} [tokenWebsite]
 * @property {String} [tokenTwitter]
 * @property {String} [tokenTelegram]
 * @property {String} [tokenDiscord]
 */

/**
 * @typedef {Object} tokens
 * @property {String} [tokenAddress]
 * @property {String} blockchainKey
 * @property {String} quoteTokenId
 * @property {String} initialBuyPrice
 * @property {String} [txHash]
 * @property {String} tokenName
 * @property {String} tokenSymbol
 * @property {String} tokenDescription
 * @property {String} tokenImage
 * @property {boolean} [isLocked] - default value of isLocked set into false
 * @property {string} [amountLocked]
 * @property {number} [timeLocked]
 * @property {String} [tokenWebsite]
 * @property {String} [tokenTwitter]
 * @property {String} [tokenTelegram]
 * @property {String} [tokenDiscord]
 */

/**
 * @typedef {Object} tokenLists
 * @property {string} tokenId
 * @property {string} tokenAddress
 * @property {string} tokenName
 * @property {string} tokenSymbol
 * @property {string} tokenImageUrl
 * @property {string} [tokenDescription]
 * @property {string} totalSupply
 * @property {string} circulatingSupply
 * @property {string} availableTokenAmount
 * @property {string} [tokenWebsite]
 * @property {string} [tokenTwitter]
 * @property {string} [tokenTelegram]
 * @property {string} [tokenDiscord]
 * @property {string} [tokenTiktok]
 * @property {Array<string>} tokenTags
 * @property {number} creationTime
 * @property {string} creationRelTime
 * @property {string} creatorUserAddress
 * @property {string} creatorUserName
 * @property {string} creatorUserImageUrl
 * @property {string} numOfComments
 * @property {number} lastTransactionTime
 * @property {string} lastTransactionRelTime
 * @property {string} bnbMarketCap
 * @property {string} usdMarketCap
 * @property {string} tradeVolLast5Min
 * @property {string} tradeVolLast1Hour
 * @property {string} tradeVolLast6Hour
 * @property {string} tradeVolLast1Day
 * @property {string} tradeVolAllTime
 * @property {string} top10HoldersPercentage
 * @property {string} devHoldingPercentage
 * @property {string} bondingCurvePercentage
 * @property {string} prev5MinBondingCurvePerventageChange
 * @property {string} kingOfHillPercentage
 * @property {string} numOfHolders
 * @property {Array<string>} previewChartTicks
 * @property {string} bondingCurveLiquidityAddress
 * @property {boolean} availableAsQuote
 */

/**
 * deposit creation
 * @typedef {Object} depositsCreation
 * @property {string} amount - eth format
 * @property {string} blockchainKey
 * @property {string} tokenId - get from data tokenId on token lists
 */

/**
 * deposit query data
 * @typedef {Object} depositQuery
 * @property {String} [blockchainKey]
 * @property {String} [userAddress]
 * @property {Number} limit
 * @property {Number} page
 */

/**
 * deposit data
 * @typedef {Object} deposits
 * @property {string} blockchainKey
 * @property {string} tokenId
 * @property {string} tokenAddress
 * @property {string} tokenName
 * @property {string} tokenSymbol
 * @property {string} tokenImageUrl
 * @property {string} userAddress
 * @property {string} userName
 * @property {string} userImageUrl
 * @property {number} depositTime
 * @property {string} formattedDepositTime
 * @property {string} depositTxHash
 * @property {string} depositAmount
 * @property {string} formattedDepsoitAmount
 * @property {'Pending' | 'Success' | 'Failed'} status
 * @property {string} [failureReason]
 */

/**
 * withdrawal creation request
 * @typedef {Object} withdrawalRequest
 * @property {string} [blockchainKey]
 * @property {string} tokenId - get token id from token lists data get on token list
 * @property {string} userAddress - user to withdraw amount destination
 * @property {string} requestAmount
 */

/**
 * deposit query data
 * @typedef {Object} withdrawalQuery
 * @property {String} [userAddress]
 * @property {Number} limit = 25
 * @property {Number} page = 1
 */

/**
 * withdrawals response data
 * @typedef {Object} withdrawals
 * @property {string} uid
 * @property {string} blockchainKey
 * @property {string} tokenId
 * @property {string} tokenAddress
 * @property {string} tokenName
 * @property {string} tokenSymbol
 * @property {string} tokenImageUrl
 * @property {string} userAddress
 * @property {string} userName
 * @property {string} userImageUrl
 * @property {number} requestTime
 * @property {string} formattedRequestTime
 * @property {string} requestAmount
 * @property {string} formattedRequestAmount
 * @property {'Requested' | 'Sent' | 'Success' | 'Failed'} status
 * @property {string} [sentTxHash]
 * @property {number} [sentTime]
 * @property {string} [formattedSentTime]
 * @property {string} [failureReason]
 */



/**
 * market request by side
 * @typedef {Object} marketRequest
 * @property {string} [blockchainKey]
 * @property {string} baseTokenId
 * @property {string} quoteTokenId
 * @property {'buy' | 'sell'} side
 * @property {'price' | 'amount'} marketType
 * @property {string} [amount]
 * @property {string} [price]
 */

/**
 * response from market request result daata
 * @typedef {Object} amountData
 * @property {string} [amount]
 * @property {string} [price]
 * @property {string} [formattedPrice]
 * * @property {string} [formattedAmount]
 */

/**
 * @typedef {Object} markets    
 * @property {string} blockchainKey
 * @property {string} blockchainName
 * @property {string} blockchainImageUrl
 * @property {string} baseTokenId
 * @property {string} quoteTokenId
 * @property {string} baseTokenFeePercentage
 * @property {string} quoteTokenFeePercentage
 * @property {string} quoteTokenName
 * @property {string} quoteTokenSymbol
 * @property {string} quoteTokenImageUrl
 * @property {string} tokenAddress
 * @property {string} tokenName
 * @property {string} tokenSymbol
 * @property {string} tokenImageUrl
 * @property {string} [tokenDescription]
 * @property {string} totalSupply
 * @property {string} circulatingSupply
 * @property {string} baseTokenSold
 * @property {string} maxBaseTokenToBeBought
 * @property {string} availableTokenAmount
 * @property {string} availableBaseTokenToBeBought
 * @property {string} [tokenWebsite]
 * @property {string} [tokenTwitter]
 * @property {string} [tokenTelegram]
 * @property {string} [tokenDiscord]
 * @property {string} [tokenTiktok]
 * @property {number} baseTokenDecimals
 * @property {number} quoteTokenDecimals
 * @property {string} initRealBaseReserve
 * @property {string} initVirtBaseReserve
 * @property {string} initRealQuoteReserve
 * @property {string} initVirtQuoteReserve
 * @property {string} realBaseReserve
 * @property {string} virtBaseReserve
 * @property {string} realQuoteReserve
 * @property {string} virtQuoteReserve
 * @property {Array<string>} tokenTags - @deprecated irrelevant for new multichain specification
 * @property {number} creationTime
 * @property {string} creationRelTime
 * @property {string} creatorUserAddress
 * @property {string} creatorUserName
 * @property {string} creatorUserImageUrl
 * @property {string} numOfComments
 * @property {number} lastTransactionTime
 * @property {string} lastTransactionRelTime
 * @property {string} lastTradePrice
 * @property {string} formattedLastTradePrice
 * @property {string} bnbMarketCap
 * @property {string} usdMarketCap
 * @property {string} tradeVolLast5Min
 * @property {string} tradeVolLast1Hour
 * @property {string} tradeVolLast6Hour
 * @property {string} tradeVolLast1Day
 * @property {string} tradeVolAllTime
 * @property {string} top10HoldersPercentage
 * @property {string} devHoldingPercentage
 * @property {string} bondingCurvePercentage
 * @property {string} prev5MinBondingCurvePerventageChange
 * @property {string} kingOfHillPercentage
 * @property {string} numOfHolders
 * @property {Array<string>} previewChartTicks
 * @property {string} marketCap
 * @property {string} formattedMarketCap
 * @property {string} marketCapTarget
 * @property {string} formattedMarketCapTarget
 * @property {string} marketCapAth
 * @property {string} formattedMarketCapAth
 * @property {boolean} isBondingCurveReached
 * @property {string} [dexUrl]
 * @property {string} [dexName]
 * @property {string} [dexImageUrl]
 */

/**
 * @typedef {Object} tokenOrder
 * @property {string} [blockchainKey] - data from blockchain data
 * @property {string} baseTokenId
 * @property {string} quoteTokenId
 * @property {'buy' | 'sell'} orderType
 * @property {string} amount - get it from data by input itself or from estimate
 * @property {string} price - get it from data by input itself or from estimate
 * @property {string} slippage - max slippage input untill 50%
 * @property {number} deadline - deadline time format is in second data and must be greater then today
 */

/**
 * @typedef {Object} trades
 * @property {string} userAddress
 * @property {string} userName
 * @property {string} userImageUrl
 * @property {'buy' | 'sell'} orderType
 * @property {string} baseAmount
 * @property {string} formattedBaseAmount
 * @property {string} quoteAmount
 * @property {string} formattedQuoteAmount
 * @property {number} executionTime
 * @property {string} formattedExecutionTime
 * @property {string} uid
 */

/**
 * query of trade
 * @typedef {Object} tradeQuery
 * @property {string} [blockchainKey]
 * @property {string} [tokenId]
 * @property {string} [userAddress]
 * @property {string} [minQuoteAmount]
 */

/**
 * transaction response data
 * @typedef {Object} transactions
 * @property {string} txHash
 * @property {string} uid
 * @property {'buy' | 'sell'} transactionType
 * @property {string} transactionRelTime
 * @property {string} tokenId
 * @property {string} tokenAddress
 * @property {string} userAddress
 * @property {string} userName
 * @property {string} userImageUrl
 * @property {string} formattedTokenAmount
 * @property {string} formattedCoinAmount
 */

/**
 * query of transaction
 * @typedef {Object} transactionQuery
 * @property {string} [tokenId]
 * @property {string} [userAddress]
 * @property {string} [minCoinAmount]
 */

/**
 * market query data
 * @typedef {Object} marketFilterQuery
 * @property {string} [blockchainKey]
 * @property {string} [baseTokenId]
 * @property {string} [quoteTokenId]
 * @property {string} [favoriteOfUserAddress]
 * @property {string} [creatorUserAddress]
 * @property {string} [minMarketCap]
 * @property {string} [maxMarketCap]
 * @property {string} [minTradeVol]
 * @property {string} [maxTradeVol]
 * @property {string} [minNumOfHolders]
 * @property {string} [maxNumOfHolders]
 * @property {string} [maxBondingCurvePercentage]
 * @property {number} page
 * @property {number} limit
 * @property {'creationTimeAsc' | 'creationTimeDesc' | 'trend5mDesc' | 'trend1hDesc' | 'trend6hDesc' | 'trend1dDesc' | 'lastTransactionTimeDesc' | 'bondingCurvePercentageDesc'} orderBy
 */

/**
 * query or account balance info
 * @typedef {Object} tokenBalanceQuery
 * @property {string} blockchainKey
 * @property {string | PublicKey} userAddress
 * @property {Number} [limit]
 * @property {Number} [page]
 */

/**
 * @typedef {Object} tokenBalanceInfo
 * @property {string} blockchainKey
 * @property {string} baseTokenId
 * @property {string} quoteTokenId
 * @property {string} tokenId
 * @property {string} tokenAddress
 * @property {string} tokenName
 * @property {number} tokenDecimals
 * @property {string} tokenSymbol
 * @property {string} tokenImageUrl
 * @property {number} tokenMaximumFractionDigits
 * @property {string} userAddress
 * @property {string} balance
 * @property {string} formattedBalance
 * @property {string} holdingPercentage
 * @property {boolean} availableAsQuote
 */

/**
 * @typedef {Object} preMarketRequest
 * @property {string} blockchainKey
 * @property {string} quoteTokenId
 * @property {string} price
 */

/**
 * @typedef {Object} preMarketResponse
 * @property {string} blockchainKey
 * @property {string} maxInitialBuyPrice
 * @property {string} formattedMaxInitialBuyPrice
 * @property {number} baseTokenDecimals
 * @property {string} baseTokenSupply
 * @property {string} amount
 * @property {string} formattedAmount
 */