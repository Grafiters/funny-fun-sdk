// @ts-check

import axios from "axios";
import { DEFAULT_DOMAIN, DEFAULT_FEATURE, DEFAULT_VERSION } from "./contsant";

/**
 * @param {String} subdomain - sub-domain url from website
 * @param {String} domain - domain url from website
 * @param {String} feature - feature of platform like ('api' or 'request')
 * @param {String} version - version of platform api url
 * @returns {String} - returns string url
 */
export const baseApi = (subdomain = '', domain = DEFAULT_DOMAIN, feature = DEFAULT_FEATURE, version = DEFAULT_VERSION) => {
    if (!subdomain) {
        return `https://${domain}${feature}${version}`;
    }

    return `https://${subdomain}.${domain}${feature}${version}`;
}

/**
 * @param {String} baseUrl - url for request
 * @param {Boolean} secure - url is secure or not
 * @returns {import("axios").AxiosInstance} - returns axios instence
 */
export const baseRequest = (baseUrl, secure = true) => {
    const req = axios.create({
        baseURL: baseUrl,
        withCredentials: secure
    })

    req.defaults.headers.common['Content-Type'] = 'application/json';

    return req;
}