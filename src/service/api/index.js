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
     * @arg {String} [options.serverUrl] - server url to fetch data from platform
     * @arg {import("axios").AxiosInstance} [options.fetch] - returns axios instence
     */
    constructor (options = {}) {
        /**@type {import("axios").AxiosInstance} */
        let axiosInstance = axios;
        if (options.serverUrl) {
            const apiUrl = baseApi('', options.serverUrl);
            
            axiosInstance = baseRequest(apiUrl, true);
        }
        
        this.fetch = axiosInstance;        
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
        this.fetch.defaults.headers["Authorization"] = `Bearer ${signature}`;
    }

    /**
     * userAccount data
     * @param {import("./constant").tokenBalanceQuery} query
     * @returns {Promise<import("./constant").tokenBalanceInfo[]>}
     */
    account = async (query) => {
        const convertToQuery = objectToQuery(query);
        
        try {
            const req = await this.fetch.get(`/accounts?${convertToQuery}`);
            
            /** @type {import("./constant").tokenBalanceInfo[]} */
            const data = req.data;
            
            return data;
        } catch (/** @type {any} */ error) {
            console.error('🔍 Axios error detail:', error?.response?.data);
            throw new Error(error);
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
     * @returns {Promise<import("./constant").NetworkInfo[]|any>} - return with format network info or data blockchain has implemanted on platform
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

            /** @type {import("./constant").NetworkInfo[]} */
            const data = res.data;
            return data
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }

    /**
     * @returns {Promise<import("./constant").AppConfig|any>} - return with format network info or data blockchain has implemanted on platform
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

            /**@type {import("./constant").AppConfig} */
            return res.data;
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }

    /**
     * get token data spesified by network
     * @param {String} [blockchainKey] - blockchain key of network
     * @param {boolean} [availableAsQuote] - available quote 
     * @returns {Promise<import("./constant").tokenLists[]>}
     */
    tokens = async (blockchainKey, availableAsQuote) => {
        try {
            const req = await this.fetch.get(`/tokens?blockchainKey=${blockchainKey}&availableAsQuote=${availableAsQuote}`);

            /**@type {import("./constant").tokenLists[]} */
            const res = req.data
            return res;
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }

    /**
     * check auth from signature
     * @param {String} blockchainKey
     * @returns {Promise<any>}
     */
    authCheck = async (blockchainKey) => {        
        try {
            const req = await this.fetch.get(`/auth-check?blockchainKey=${blockchainKey}`);
            const res = req.data;
            return res;
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }

    /**
     * upload metadata to ipfs
     * @param {import("./constant").tokenMetaData} params - body parameter to request
     * @returns {Promise<{tokenMetadataUrl: string}>}
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
            /**@type {{tokenMetadataUrl: string}} */
            const res = req.data;
            return res
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }

    /**
     * @param {import("./constant").tokens} params - body params for token creation
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

        } catch (/** @type {any} */ error) {
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

            throw new Error(JSON.stringify({up: false, error: errMsg, status: error.response?.status || null}));
        }
    }

    /**
     * get depost list data
     * @param {import("./constant").depositQuery} query
     * @returns {Promise<import("./constant").deposits[]>}
     */
    deposit = async (query) => {
        const convertToQuery = objectToQuery(query);
        try {
            const req = await this.fetch.get(`/deposits?${convertToQuery}`);
            /** @type {import("./constant").deposits[]} */
            return req.data;
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }

    /**
     * post withdrawals request
     * @param {import("./constant").withdrawalRequest} params
     * @returns {Promise<{message: string, withdrawalUid: {uid: string} }>}
     */
    withdrawalRequest = async (params) => {
        try {
            const req = await this.fetch.post('/withdrawals', params);

            /** @type {{message: string, orderUid: string}} */
            return req.data;
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }

    /**
     * get list of data withdrawals
     * @param {import("./constant").withdrawalQuery} query
     * @returns {Promise<import("./constant").withdrawals[]>}
     */
    withdraw = async (query) => {
        const convertToQuery = objectToQuery(query);
        try {
            const req = await this.fetch.get(`/withdrawals?${convertToQuery}`);
            /** @type {import("./constant").withdrawals[]} */
            return req.data;
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }

    /**
     * get list of market
     * @param {import("./constant").marketFilterQuery} query - filtering query of market
     * @returns {Promise<import("./constant").markets[]>}
     */
    market = async (query) => {
        const convertToQuery = objectToQuery(query);
        try {
            const req = await this.fetch.get(`/markets?${convertToQuery}`);

            /** @type {import("./constant").markets[]}*/
            return req.data;
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }

    /**
     * get transaction with filter
     * @param {import("./constant").transactionQuery} query - query for transaction data
     * @returns {Promise<import("./constant").transactions[]>}
     */
    transaction = async(query) => {
        const convertToQuery = objectToQuery(query);
        try {
            const req = await this.fetch.get(`/transactions?${convertToQuery}`);

            /** @type {import("./constant").transactions[]}*/
            return req.data;
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }

    /**
     * @param {import("./constant").tradeQuery} query - query for trade history
     * @returns {Promise<import("./constant").trades[]>}
     */
    trade = async(query) => {
        const convertToQuery = objectToQuery(query);
        
        try {
            const req = await this.fetch.get(`/trades?${convertToQuery}`);

            /** @type {import("./constant").trades[]}*/
            return req.data;
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }

    /**
     * make trade request creation
     * @param {import("./constant").tokenOrder} params
     * @returns {Promise<{message: string, orderUid: string}>}
     */
    orderCreation = async(params) => {
        try {
            const req = await this.fetch.post('/orders', params);

            /**@type {{message: string, orderUid: string}} */
            return req.data;
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }

    /**
     * get estimated amount base by pair market e.g (quote or base)
     * market type declaration
     * price - quote on pair market
     * amount - base on pair market
     * @param {import("./constant").marketRequest} params
     * @returns {Promise<import("./constant").amountData>}
     */
    estimatedAmountMarkets = async(params) => {
        try {
            const req = await this.fetch.post(`/market-${params.side}-${params.marketType}`, params);
            
            /**@type {import("./constant").amountData} */
            return req.data;
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }

    /**
     * get premarket price data for initial create token when token is locked
     * @param {import("./constant").preMarketRequest} body
     * @returns {Promise<import("./constant").preMarketResponse>}
     */
    premarketRequest = async(body) => {
        try {
            const req = await this.fetch.post(`/premarket-buy-amount`, body);

            /** @type {import("./constant").preMarketResponse} */
            return req.data
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }
};