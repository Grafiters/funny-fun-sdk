// @ts-check

import axios from "axios";
import { DEFAULT_DOMAIN, DEFAULT_FEATURE, DEFAULT_NETWORK_WALLET, DEFAULT_VERSION } from "./contsant";

/**
 * @param {String} subdomain - sub-domain url from website
 * @param {String} domain - domain url from website
 * @param {String} feature - feature of platform like ('api' or 'request')
 * @param {String} version - version of platform api url
 * @returns {String} - returns string url
 */
export const baseApi = (subdomain = '', domain = DEFAULT_DOMAIN, feature = DEFAULT_FEATURE, version = DEFAULT_VERSION) => {
    if (!subdomain) {
        return `${domain}${feature}${version}`;
    }

    if(domain.startsWith('https://')) return `${domain}${feature}${version}`;
    return `https://${subdomain}.${domain}${feature}${version}`;
}

/**
 * @param {String} baseUrl - url for request
 * @param {Boolean} secure - url is secure or not
 * @returns {import("axios").AxiosInstance} - returns axios instence
 */
export const baseRequest = (baseUrl, secure = true) => {

    const req = axios.create({
        baseURL: baseUrl.replace(/\/+$/, ''),
        withCredentials: secure
    })

    req.defaults.headers.common['Content-Type'] = 'application/json';

    return req;
}

/**
 * @param {import("./service/api/constant").NetworkInfo[]} data
 * @param {String} network
 * @param {Number} [chainId]
 * @returns {import("./service/api/constant").NetworkInfo}
 */
export const filterBlockchainNetwork = (data, network, chainId) => {
    let filtered;
    if (typeof chainId === 'undefined' || typeof chainId !== 'number' || isNaN(chainId) || network === DEFAULT_NETWORK_WALLET.solana) {
        filtered = data.filter(item => item.key.startsWith('solana'));
    } else {
        filtered = data.filter(item => item.key.endsWith(chainId.toString()));
    }

    return filtered[0];
}