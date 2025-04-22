import axios from "axios";
import { DEFAULT_MESSAGE, DEFAULT_NETWORK_WALLET } from "./contsant";
import Platform from "./service/api";
import EVMWallet from "./service/evm";
import SolanaWallet from "./service/solana";
import { filterBlockchainNetwork } from "./utils";

/**
 * @class FunnyFunSdk
 * @classdesc software development kit of funny fun platform with 2 type network blockchain (evm, and solana)
 */
/**
 * @typedef {import("./lib/wallet.d.ts").WalletImplemented & import("./lib/api.d.ts").ApiImpelemanted} services
 */
export default class FunnyFunSdk {
    /**
     * @arg {Object} options
     * @arg {String} options.serverUrl - an server url from platform
     * @arg {String} options.privateKey - an secret key from wallet
     * @arg {String} [options.rpcUrl] - an rpc url from blockchain network
     * @arg {Number} [options.chainId] - chain id from wallet there is from wallet only on evm wallet
     * @arg {import("@solana/web3.js").Cluster} [options.solanaNetwork]
     * @arg {keyof typeof DEFAULT_NETWORK_WALLET} options.network
     */
    constructor (options) {
        let axiosInstance = axios;

        /**@type {import("./lib/api.d.ts").ApiImpelemanted} */
        const apiConfig = !options.serverUrl ? new Platform() : new Platform({fetch: axiosInstance});

        const config = {
            chainId: options.chainId,
            privateKey: options.privateKey,
            cluster: options.solanaNetwork,
            serverUrl: options.serverUrl
        }
        /** @type {import("./lib/wallet.d.ts").WalletImplemented} */
        const wallet = options.network === DEFAULT_NETWORK_WALLET.evm ? new EVMWallet(config) : new SolanaWallet(config);
        
        this.config = {
            api: apiConfig,
            wallet: wallet,
            walletConfig: wallet.config(),
            options: options,
            network: options.network,
            message: DEFAULT_MESSAGE[options.network]
        }

    }
    
    /**
     * get lis of all token from spesified network
     * @returns {Promise<tokenLists[]>}
     */
    tokenLists = async () => {
        try {
            const req = await this.config.api.tokens(this.config.network);

            /**@type {tokenLists[]} */
            return req;
        } catch ( /**@type {any} */ error) {
            throw new Error(error)
        }
    }

    /**
     * get signature message from wallet
     */
    signature = async () => {
        try {
            await this.config.api.checkStatusServer(this.config.options.serverUrl);
            
            const nonce = await this.config.api.nonce(this.config.walletConfig.address.toString(), this.config.options.network);
            const signature = await this.config.wallet.signMessage({
                message: DEFAULT_MESSAGE[this.config.network],
                nonce: nonce,
                domain: this.config.walletConfig.domain,
                url: this.config.walletConfig.origin
            })

            this.config.api.setSignatureAuth(signature);

            await this.config.api.authCheck();
            return signature;
        } catch ( /**@type {any} */ error) {
            throw new Error(error)
        }
    }

    /**
     * get blockchain data with spesific network
     * @returns {Promise<NetworkInfo>}
     */
    getBlockchainData = async() => {
        await this.config.api.checkStatusServer(this.config.options.serverUrl);

        const blcokchain = await this.config.api.blockchains();
        const filteredBlockchain = filterBlockchainNetwork(blcokchain, this.config.network, this.config.options.chainId);

        this.blockchain = filteredBlockchain;
        return filteredBlockchain;
    }

    /**
     * upload metadata token only for solana config
     * @param {tokenMetaData} params - parameter for token meta data but for solana only
     * @returns {Promise<String>}
     */
    uplaodMetaData = async (params) => {
        await this.config.api.checkStatusServer(this.config.options.serverUrl);

        const uploadMeta = await this.config.api.uploadMetaData(params);
        return uploadMeta;
    }

    /**
     * deploy token with smart contract spesified by network blockchains
     * @param {String} tokenName
     * @param {String} tokenSymbol
     * @param {String} [metadataUrl]
     * @returns {Promise<String>}
     */
    deployToken = async (tokenName, tokenSymbol, metadataUrl = undefined) => {
        const deploy = await this.config.wallet.createToken(
            tokenName,
            tokenSymbol,
            this.blockchain?.tokenFactoryContractAddress,
            this.blockchain?.tokenCreationFee,
            metadataUrl
        );

        return deploy;
    }

    /**
     * update token data to platform
     * @param {tokens} params
     * @returns {Promise<any>}
     */
    createToken = async(params) => {
        try {
            const req = await this.config.api.uploadTokenData(params);
            return req;
        } catch ( /**@type {any} */ error) {
            throw new Error(error)
        }
    }

    /**
     * deploy and create token with same action
     * @param {tokens} params token data
     * @returns {Promise<any>}
     */
    deployAndRequestCreateToken = async(params) => {
        let metadataUrl = '';
        try {
            if (this.config.network !== DEFAULT_NETWORK_WALLET.solana) {
                /**@type {tokenMetaData} */
                const metadata = {
                    blockchainKey: this.blockchain?.key ?? '',
                    tokenName: params.tokenName,
                    tokenSymbol: params.tokenSymbol,
                    tokenImage: params.tokenImage,
                    tokenDescription: params.tokenDescription,
                    tokenDiscord: params.tokenDiscord,
                    tokenWebsite: params.tokenWebsite,
                    tokenTwitter: params.tokenTwitter,
                    tokenTelegram: params.tokenTelegram
                }
    
                const url = await this.uplaodMetaData(params);
    
                metadataUrl = url;
            }
    
            const deployToken = await this.deployToken(params.tokenName, params.tokenSymbol, metadataUrl);
            if (this.config.network !== DEFAULT_NETWORK_WALLET.solana) {
                params.txHash = deployToken;
            }
    
            const createToken = await this.createToken(params);

            return createToken;
        } catch ( /**@type {any} */ error) {
            throw new Error(error);
        }
    }
}