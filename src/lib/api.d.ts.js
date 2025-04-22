/// <reference path="../service/api/constant.js" />
import { DEFAULT_NETWORK_WALLET } from "../contsant";

/**
 * @typedef {Object} ApiImpelemanted
 * @property {(address: string, network: keyof typeof DEFAULT_NETWORK_WALLET) => Promise<String|any> } nonce - get nonce user from platform
 * @property {() => Promise<NetworkInfo[]|any>} blockchains - get blockchain information with related wallet connect
 * @property {(signature: string) => any} setSignatureAuth - set signature auth on platform service
 * @property {() => {}} authCheck - to check authenticate wallet user on platform
 * @property {(params: tokenMetaData) => Promise<any>} uploadMetaData - upload metadata on platform only work for solana network
 * @property {(params: tokens) => Promise<any>} uploadTokenData - upload token data
 */

