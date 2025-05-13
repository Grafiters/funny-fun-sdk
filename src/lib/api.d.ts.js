/// <reference path="../service/api/constant.js" />
import { DEFAULT_NETWORK_WALLET } from "../contsant";

/**
 * @typedef {Object} ApiImpelemanted
 * @property {(serverUrl: string) => Promise<{up: boolean, status?: number, error?: string}>} checkStatusServer - check server status is up or not
 * @property {(address: string, network: keyof typeof DEFAULT_NETWORK_WALLET) => Promise<String|any> } nonce - get nonce user from platform
 * @property {() => Promise<import("../service/api/constant").NetworkInfo[]|any>} blockchains - get blockchain information with related wallet connect
 * @property {(signature: string) => any} setSignatureAuth - set signature auth on platform service
 * @property {(blockchainKey: string) => Promise<any>} authCheck - to check authenticate wallet user on platform
 * @property {(params: import("../service/api/constant").tokenMetaData) => Promise<{tokenMetadataUrl: string}>} uploadMetaData - upload metadata on platform only work for solana network
 * @property {(params: import("../service/api/constant").tokens) => Promise<any>} uploadTokenData - upload token data
 * @property {(blockchainKey?: string | undefined, availableAsQuote?: boolean | undefined) => Promise<import("../service/api/constant").tokenLists[]>} tokens - get all list tokens from spesified network wallet connection
 * @property {(query: import("../service/api/constant").depositQuery) => Promise<import("../service/api/constant").deposits[]>} deposit - get all deposit data
 * @property {(params: import("../service/api/constant").withdrawalRequest) => Promise<{message: string, withdrawalUid: {uid: string}}>} withdrawalRequest - create withdraw request
 * @property {(query: import("../service/api/constant").withdrawalQuery) => Promise<import("../service/api/constant").withdrawals[]>} withdraw - get all withdraw data
 * @property {(query: import("../service/api/constant").tokenBalanceQuery) => Promise<import("../service/api/constant").tokenBalanceInfo[]>} account - get detail of balance information
 * @property {(query: import("../service/api/constant").marketFilterQuery) => Promise<import("../service/api/constant").markets[]>} market - get all active market on platform
 * @property {(query: import("../service/api/constant").tradeQuery) => Promise<import("../service/api/constant").trades[]>} trade - get all trade history
 * @property {(params: import("../service/api/constant").tokenOrder) => Promise<{message: string, orderUid: string}>} orderCreation - post and make new order on market
 * @property {(params: import("../service/api/constant").marketRequest) => Promise<import("../service/api/constant").amountData>} estimatedAmountMarkets - to get outpyt amount or price spesified by market tyep on sell or buy and amount or price
 * @property {(body: import("../service/api/constant").preMarketRequest) => Promise<import("../service/api/constant").preMarketResponse>} premarketRequest - get premarket initial price token when on create token is locked
 */