// @ts-check
/// <reference path="constant.js" />

import axios from "axios";
import { DEFAULT_NETWORK_WALLET } from "../../contsant";
import { baseApi, baseRequest } from "../../utils";
import { dataUrl } from "../../utils/image";
import { detectBufferMime } from "mime-detect";
import { ALLOWED_IMAGE_FORMAT, MAX_SIZE_OF_FILE } from "./api-constant";
import { objectToQuery } from "../../utils/object-to-string";

/**w
 * @class Platform
 * @classdesc Service for request to platform
 */
/**@type {import("../../lib/api.d.ts").ApiImpelemanted} */
export default class Platform {
    /**
     * @arg {Object} options
     * @arg {import("axios").AxiosInstance} [options.fetch] - returns axios instence
     */
    constructor (options = {}) {
        /**@type {import("axios").AxiosInstance} */
        let axiosInstance = axios;
        if (!options.fetch) {
            const apiUrl = baseApi();
            axiosInstance = baseRequest(apiUrl, true);
        }
        this.fetch = options.fetch || axiosInstance;
    }

    /**
     * @param {String} serverUrl - server url to platform
     * @returns {Promise<{ up: boolean, status?: number, error?: string }>}
     */
    checkStatusServer = async (serverUrl) => {
        try {
            const res = await this.fetch.head(serverUrl, {timeout: 5000});
            return {
                up: true,
                status: res.status
            }
        } catch (/** @type {any} */error) {
            let errMsg = 'unknown';

            if (error.response) {
                errMsg = `Response error: ${error.response.status}`;
            } else if (error.request) {
                errMsg = 'No response (possible timeout or network error)';
            } else if (error.code) {
                errMsg = error.code;
            } else if (error.message) {
                errMsg = error.message;
            }

            return {
                up: false,
                error: errMsg,
                status: error.response?.status || null,
            };
        }
    }

    /**
     * @param {String} signature - signature from wallet connection
     */
    setSignatureAuth = (signature) => {
        this.fetch.defaults.headers["Authorization"] = signature;
    }

    /**
     * userAccount data
     * @param {tokenBalanceQuery} query
     * @returns {Promise<tokenBalanceInfo>}
     */
    account = async (query) => {
        const convertToQuery = objectToQuery(query);
        try {
            const req = await this.fetch.get(`/accounts?${convertToQuery}`);

            /** @type {tokenBalanceInfo} */
            const data = req.data;
            return data;
        } catch (error) {
            console.error(error);
            throw new Error(`Cannot request to get detail account balance info`);
        }
    }

    /**
     * @param {String} address - user wallet address
     * @param {keyof typeof DEFAULT_NETWORK_WALLET} network - wallet network with specific type (e.g, 'evm', or 'solana')
     * @returns {Promise<String|any>} - return number of nonce
     */
    nonce = async (address, network) => {
        try {
            const req = await this.fetch.post('/auth-nonce', {
                userAddress: address,
                blockchainType: network
            })

            return req.data.nonce;
        } catch (error) {
            return error
        }
    }

    /**
     * @returns {Promise<NetworkInfo[]|any>} - return with format network info or data blockchain has implemanted on platform
     */
    blockchains = async () => {
        try {
            const res = await this.fetch.get('/blockchains');
            if (res.status !== axios.HttpStatusCode.Ok) {
                console.error(`failed to get data blockchain with Error:`);
                console.error(res);
                console.error(`HTTP error: ${res.status}`);
                return null;
            }

            /** @type {NetworkInfo[]} */
            const data = res.data;
            return data
        } catch (error) {
            console.error(error)
            return error
        }
    }

    /**
     * @returns {Promise<AppConfig|any>} - return with format network info or data blockchain has implemanted on platform
     */
    config = async () => {
        try {
            const res = await this.fetch.get('/app-config');
            if (res.status !== axios.HttpStatusCode.Ok) {
                console.error(`failed to get data app-config with Error:`);
                console.error(res);
                console.error(`HTTP error: ${res.status}`);
                return null;
            }

            /**@type {AppConfig} */
            return res.data;
        } catch (error) {
            console.error(error)
            return error
        }
    }

    /**
     * get token data spesified by network
     * @param {String} blockchainKey - blockchain key of network
     * @returns {Promise<tokenLists[]>}
     */
    tokens = async (blockchainKey) => {
        try {
            const req = await this.fetch.get(`/tokens?blockchainKey=${blockchainKey}`);

            /**@type {tokenLists[]} */
            const res = req.data
            return res;
        } catch ( /**@type {any} */ error) {
            console.error(error)
            throw new Error(`Cannot get data list of tokens`);
        }
    }

    /**
     * check auth from signature
     * @returns {Promise<any>}
     */
    authCheck = async () => {
        try {
            const req = await this.fetch.get('/auth-check');
            const res = req.data;
            return res;
        } catch (error) {
            console.error(error)
            throw new Error(`Cannot get data auth user`);
        }
    }

    /**
     * upload metadata to ipfs
     * @param {tokenMetaData} params - body parameter to request
     * @returns {Promise<String>}
     */
    uploadMetaData = async (params) => {
        const isImage = dataUrl(params.tokenImage);
        if (!isImage) {
            throw new Error(`invalid base64 encode image format`);
        }

        const mimeType = await detectBufferMime(isImage);
        if (isImage.byteLength > MAX_SIZE_OF_FILE) {
            throw new Error(`File size is to large max ${MAX_SIZE_OF_FILE}`)
        }
    
        if (!ALLOWED_IMAGE_FORMAT.includes(mimeType)) {
            throw new Error(`Unsupported format. Supported mage formats are ${ALLOWED_IMAGE_FORMAT.join(', ')}, got ${mimeType}.`);
        }

        try {
            const req = await this.fetch.post('/token-metadata', params);
            /**@type {string} */
            const res = req.data;
            return res
        } catch (error) {
            console.error(error)
            throw new Error(`Cannot request to token meta data`);
        }
    }


    /**
     * @param {tokens} params - body params for token creation
     */
    uploadTokenData = async (params) => {
        const isImage = dataUrl(params.tokenImage);
        if (!isImage) {
            throw new Error(`invalid base64 encode image format`);
        }

        const mimeType = await detectBufferMime(isImage);
        if (isImage.byteLength > MAX_SIZE_OF_FILE) {
            throw new Error(`File size is to large max ${MAX_SIZE_OF_FILE}`)
        }
    
        if (!ALLOWED_IMAGE_FORMAT.includes(mimeType)) {
            throw new Error(`Unsupported format. Supported mage formats are ${ALLOWED_IMAGE_FORMAT.join(', ')}, got ${mimeType}.`);
        }

        try {
            const req = await this.fetch.post('/tokens', params);
            const res = req.data;
            return res;
        } catch (error) {
            console.error(error)
            throw new Error(`Cannot request to token meta data`);
        }
    }

    /**
     * get depost list data
     * @param {depositQuery} query
     * @returns {Promise<deposit[]>}
     */
    deposit = async (query) => {
        const convertToQuery = objectToQuery(query);
        try {
            const req = await this.fetch.get(`/deposits?${convertToQuery}`);
            /** @type {deposit[]} */
            return req.data;
        } catch ( /** @type {any} */ error) {
            console.error(error);
            throw new Error(`Cannot request to token meta data`);
        }
    }

    /**
     * post withdrawals request
     * @param {withdrawalRequest} params
     * @returns {Promise<withdrawals>}
     */
    withdrawalRequest = async (params) => {
        try {
            const req = await this.fetch.post('/withdrawals', params);

            /** @type {withdrawals} */
            return req.data;
        } catch (error) {
            console.error(error);
            throw new Error(`Cannot request to token meta data`);
        }
    }

    /**
     * get list of data withdrawals
     * @param {withdrawalQuery} query
     * @returns {Promise<withdrawals[]>}
     */
    withdraw = async (query) => {
        const convertToQuery = objectToQuery(query);
        try {
            const req = await this.fetch.get(`/withdrawals?${convertToQuery}`);
            /** @type {withdrawals[]} */
            return req.data;
        } catch (error) {
            console.error(error);
            throw new Error(`Cannot request to token meta data`);
        }
    }

    /**
     * get list of market
     * @param {marketFilterQuery} query - filtering query of market
     * @returns {Promise<markets[]>}
     */
    market = async (query) => {
        const convertToQuery = objectToQuery(query);
        try {
            const req = await this.fetch.get(`/markets?${convertToQuery}`);

            /** @type {markets[]}*/
            return req.data;
        } catch (error) {
            console.error(error);
            throw new Error(`Cannot request to get all markets data`);
        }
    }

    /**
     * get transaction with filter
     * @param {transactionQuery} query - query for transaction data
     * @returns {Promise<transactions[]>}
     */
    transaction = async(query) => {
        const convertToQuery = objectToQuery(query);
        try {
            const req = await this.fetch.get(`/transactions?${convertToQuery}`);

            /** @type {transactions[]}*/
            return req.data;
        } catch (error) {
            console.error(error);
            throw new Error(`Cannot request to transaction data`);
        }
    }

    /**
     * @param {tradeQuery} query - query for trade history
     * @returns {Promise<trades[]>}
     */
    trade = async(query) => {
        const convertToQuery = objectToQuery(query);
        try {
            const req = await this.fetch.get(`/trades?${convertToQuery}`);

            /** @type {trades[]}*/
            return req.data;
        } catch (error) {
            console.error(error);
            throw new Error(`Cannot request to trades data`);
        }
    }

    /**
     * make trade request creation
     * @param {tokenOrder} params
     * @returns {Promise<{message: string, orderUid: string}>}
     */
    orderCreation = async(params) => {
        try {
            const req = await this.fetch.post('/orders', params);

            /**@type {{message: string, orderUid: string}} */
            return req.data;
        } catch (error) {
            console.error(error);
            throw new Error(`Cannot request to create trade order`);
        }
    }

    /**
     * @param {marketRequest} params
     * @returns {Promise<amountData>}
     */
    markeTypeAmountOrPrice = async(params) => {
        try {
            const req = await this.fetch.post(`/market-${params.side}-${params.marketType}`, params);
            
            /**@type {amountData} */
            return req.data;
        } catch (error) {
            console.error(error);
            throw new Error(`Cannot request to get result amount`);
        }
    }   
}