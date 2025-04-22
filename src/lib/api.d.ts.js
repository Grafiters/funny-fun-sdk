/// <reference path="../service/api/constant.js" />
import { DEFAULT_NETWORK_WALLET } from "../contsant";

/**
 * @typedef {Object} ApiImpelemanted
 * @property {(serverUrl: string) => Promise<{up: boolean, status?: number, error?: string}>} checkStatusServer - check server status is up or not
 * @property {(address: string, network: keyof typeof DEFAULT_NETWORK_WALLET) => Promise<String|any> } nonce - get nonce user from platform
 * @property {() => Promise<NetworkInfo[]|any>} blockchains - get blockchain information with related wallet connect
 * @property {(signature: string) => any} setSignatureAuth - set signature auth on platform service
 * @property {() => Promise<any>} authCheck - to check authenticate wallet user on platform
 * @property {(params: tokenMetaData) => Promise<any>} uploadMetaData - upload metadata on platform only work for solana network
 * @property {(params: tokens) => Promise<any>} uploadTokenData - upload token data
 * @property {(blockchainKey: string) => Promise<tokenLists[]>} tokens - get all list tokens from spesified network wallet connection
 * @property {(query: tokenBalanceQuery) => Promise<tokenBalanceInfo>} account - get detail of balance information
 * @property {(query: depositQuery) => Promise<deposit[]>} deposit - get all deposit data
 * @property {(params: withdrawalRequest) => Promise<withdrawals>} withdrawalRequest - create withdraw request
 * @property {(query: withdrawalQuery) => Promise<withdrawals[]>} withdraw - get all withdraw data
 * @property {(query: marketFilterQuery) => Promise<markets[]>} market - get all active market on platform
 * @property {(query: transactionQuery) => Promise<transactions[]>} transaction - get all history transaction
 * @property {(query: tradeQuery) => Promise<trades[]>} trade - get all trade history
 * @property {(params: tokenOrder) => Promise<{message: string, orderUid: string}>} orderCreation - post and make new order on market
 * @property {(params: marketRequest) => Promise<amountData>} markeTypeAmountOrPrice - to get outpyt amount or price spesified by market tyep on sell or buy and amount or price
 */