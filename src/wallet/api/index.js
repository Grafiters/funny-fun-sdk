// @ts-check

import axios from "axios";
import { DEFAULT_NETWORK_WALLET } from "../../contsant";
import { baseApi, baseRequest } from "../../utils";

/**
 * @class Platform
 * @classdesc Service for request to platform
 */
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
     * @param {String} address - user wallet address
     * @param {keyof typeof DEFAULT_NETWORK_WALLET} network - wallet network with specific type (e.g, 'evm', or 'solana')
     * @returns {Promise<Number|any>} - return number of nonce
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
}