// @ts-check

import { ethers } from "ethers";
import { SiweMessage } from "siwe";
import { abi } from "./abi";

/**
 * @class EVMWallet
 * @classdesc The evm wallet configuration and related with server
 */
/**@type {import("../../lib/wallet.d.ts").WalletImplemented} */
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

        this.abiFactory = abi;

        this.EvmConfig = {
            abiFactory: this.abiFactory,
            address: wallet.address,
            domain: this.domain,
            origin: domainParse.origin,
            rpcUrl: this.rpcUrl,
            provider: provider,
            wallet: wallet
        }
    }

    /**
     * @returns {{abiFactory: string, address: string, domain: string, origin: string, rpcUrl: string, provider: ethers.JsonRpcProvider, wallet: ethers.Wallet}}
     */
    config = () => {
        return this.EvmConfig;
    }

    /**
     * @arg {Object} params
     * @arg {String} params.message - message to get signature
     * @arg {String} params.nonce - nonce from request platform endpoint
     * @arg {String} params.domain - domain of project
     * @arg {String} params.url - url of platform project
     * @returns {Promise<String>} - return signature of messages
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
        return signature;
    }

    /**
     * @param {String} factoryAddress - an address smart contract
     * @param {String} tokenName - an token tokenName required
     * @param {String} tokenSymbol - an token tokenSymbol required
     * @returns {Promise<String|any>} - returning hash transaction of create token
     */
    createToken = async (factoryAddress, tokenName, tokenSymbol) => {
        const contract = new ethers.Contract(factoryAddress, this.EvmConfig.abiFactory, this.EvmConfig.provider);
        try {
            const fee = await contract.getTokenCreationFee();
            const tx = await contract.createToken(tokenName, tokenSymbol, {
                value: fee
            });

            await tx.wait();
            return tx.transactionHash;
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}