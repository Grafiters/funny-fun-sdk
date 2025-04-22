// @ts-check
/// <reference path="constant.js" />

import axios from "axios";
import { DEFAULT_NETWORK_WALLET } from "../../contsant";
import { baseApi, baseRequest } from "../../utils";
import { dataUrl } from "../../utils/image";
import { detectBufferMime } from "mime-detect";
import { ALLOWED_IMAGE_FORMAT, MAX_SIZE_OF_FILE } from "./api-constant";

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
     * @param {String} signature - signature from wallet connection
     */
    setSignatureAuth = (signature) => {
        this.fetch.defaults.headers["Authorization"] = signature;
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
     * check auth from signature
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
}