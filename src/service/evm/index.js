// @ts-check

import { ethers } from "ethers";
import { SiweMessage } from "siwe";

/**
 * @class EVMWallet
 * @classdesc The evm wallet configuration and related with server
 */
export default class EVMWallet {
    /**
    * @arg {Object} options
    * @arg {String} [options.serverUrl] - an server url for making request
    * @arg {String} [options.address] - an evm user address for authentiation
    * @arg {String} [options.privateKey] - an private key to interaction with web3 or smart contract
    * @arg {String} [options.rpcUrl] - an rpc url from blockchain
    * @arg {Number} [options.chainId] - chain id from connected network
    */
    constructor(options = {}) {
        // Validasi untuk memastikan serverUrl tidak undefined
        if (!options.serverUrl) {
            throw new Error('serverUrl is required.');
        }
        /** @type {string|undefined} */
        this.serverUrl = options.serverUrl;

        if (!options.privateKey) {
            throw new Error('privateKey is required.');
        }
        /** @type {string|undefined} */
        this.privateKey = options.privateKey;

        if (!options.chainId) {
            throw new Error('chain id is required.');
        }
        /** @type {number|undefined} */
        this.chainId = options.chainId;

        if (!options.rpcUrl) {
            throw new Error('Rpc Url is required.');
        }
        /** @type {string|undefined} */
        this.rpcUrl = options.rpcUrl;

        const domainParse = new URL(this.serverUrl);
        this.domain = domainParse.hostname;

        const provider = new ethers.JsonRpcProvider(this.rpcUrl);
        const wallet = new ethers.Wallet(this.privateKey, provider)

        /** @type {string|undefined} */
        this.address = options.address || wallet.address;

        this.EvmConfig = {
            address: wallet.address,
            domain: this.domain,
            origin: domainParse.origin,
            rpcUrl: this.rpcUrl,
            provider: provider,
            wallet: wallet
        }
    }

    /**
     * @arg {Object} params
     * @arg {String} [params.message] - message to get signature
     * @arg {Number} [params.nonce] - nonce from request platform endpoint
     * @arg {String} [params.domain] - domain of project
     * @arg {String} [params.url] - url of platform project
     * @returns {Promise<{message: String, signature: String, address: String}>} - return signature of messages
     */
    signMessage = async (params) => {

        const message = new SiweMessage({
            domain: params.domain,
            address: this.address,
            statement: params.message,
            uri: params.url,
            version: '1',
            chainId: this.chainId,
            nonce: params.nonce?.toString(),
            issuedAt: new Date().toISOString()
        });


        const messageToSign = message.prepareMessage();
        const signature = await this.EvmConfig.wallet.signMessage(messageToSign);
        return {
            message: messageToSign,
            signature: signature,
            address: this.EvmConfig.address
        }
    }
}