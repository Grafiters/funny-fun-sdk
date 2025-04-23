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
     * @returns {Promise<import("./service/api/constant").tokenLists[]>}
     */
    tokenLists = async () => {
        try {
            const req = await this.config.api.tokens(this.config.network);

            /**@type {import("./service/api/constant").tokenLists[]} */
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
     * @returns {Promise<import("./service/api/constant").NetworkInfo>}
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
     * @param {import("./service/api/constant").tokenMetaData} params - parameter for token meta data but for solana only
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
        if (!this.blockchain) {
            await this.getBlockchainData();
        }
        
        try {
            const deploy = await this.config.wallet.createToken(
                tokenName,
                tokenSymbol,
                this.blockchain?.tokenFactoryContractAddress,
                this.blockchain?.tokenCreationFee,
                metadataUrl
            );

            return deploy;
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }

    /**
     * update token data to platform
     * @param {import("./service/api/constant").tokens} params
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
     * @param {import("./service/api/constant").tokens} params token data
     * @returns {Promise<any>}
     */
    deployAndRequestCreateToken = async(params) => {
        if (!this.blockchain) {
            await this.getBlockchainData();
        }
        let metadataUrl = '';
        try {
            if (this.config.network !== DEFAULT_NETWORK_WALLET.solana) {
                /**@type {import("./service/api/constant").tokenMetaData} */
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
    
                const url = await this.uplaodMetaData(metadata);
    
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

    /**
     * get deposit data
     * @param {import("./service/api/constant").depositQuery} query - query from deposit data
     * @returns {Promise<import("./service/api/constant").deposits[]>}
     */
    getDeposit = async (query) => {
        if (!this.blockchain) {
            await this.getBlockchainData();
        }
        try {
            const req = await this.config.api.deposit(query);

            return req;
        } catch (/** @type {any} */error) {
            throw new Error(error);
        }
    }

    /**
     * make a deposit token spesified blockchain network and wallet
     * @param {import("./service/api/constant").depositsCreation} body
     * @returns {Promise<string>}
     */
    createDepositToken = async(body) => {
        if (!this.blockchain) {
            await this.getBlockchainData();
        }
        if (body.blockchainKey !== this.blockchain?.key) {
            throw new Error(`invalid blockchain key`);
        }

        if (!body.tokenId) {
            throw new Error(`invalid token address`);
        }

        const tokens = await this.tokenLists();

        const filteredToken = tokens.filter(item => item.tokenId === body.tokenId);
        if(!filteredToken) {
            throw new Error(`invalid token address`);
        }

        const token = filteredToken[0];
        const amount = Math.floor(parseFloat(body.amount))
        if (amount <= 0) {
            throw new Error(`amount deposit cannot lower or equal then zero`);
        }
        try {
            const tokenType = token.tokenId.split(':')
            if(tokenType[0] === 'erc20' || tokenType[0] === 'token') {
                const depoReq = await this.config.wallet.depositToken(
                    this.blockchain.depositAddress,
                    body.amount,
                    body.tokenId
                );
                
                return depoReq
            }else{
                throw new Error('cannot doing deposit token network type is invalid')
            }
        } catch (/** @type {any} */error) {
            throw new Error(error);
        }
    }

    /**
     * make a deposit spesified blockchain network and wallet
     * @param {import("./service/api/constant").depositsCreation} body
     * @returns {Promise<string>}
     */
    createDeposit = async(body) => {
        if (!this.blockchain) {
            await this.getBlockchainData();
        }
        if (body.blockchainKey !== this.blockchain?.key) {
            throw new Error(`invalid blockchain key`);
        }

        const amount = Math.floor(parseFloat(body.amount))
        if (amount <= 0) {
            throw new Error(`amount deposit cannot lower or equal then zero`);
        }
        try {
            const depoReq = await this.config.wallet.depositToken(
                this.blockchain.depositAddress,
                body.amount
            );
            
            return depoReq
        } catch (/** @type {any} */error) {
            throw new Error(error);
        }
    }

    /**
     * get withdrawal data
     * @param {import("./service/api/constant").withdrawalQuery} query
     * @returns {Promise<import("./service/api/constant").withdrawals[]>}
     */
    getWithdrawals = async(query) => {
        try {
            const req = await this.config.api.withdraw(query);

            return req;
        } catch (/** @type {any} */error) {
            throw new Error(error);
        }
    }

    /**
     * create withdrawal request creation
     * @param {import("./service/api/constant").withdrawalRequest} body
     * @returns {Promise<{message: string, withdrawalUid: string}>}
     */
    createWithdraw = async(body) => {
        if(!this.blockchain) throw new Error(`haven't setup blockchain data`);
        body.blockchainKey = this.blockchain?.key;

        const tokens = await this.tokenLists();

        const filteredToken = tokens.filter(item => item.tokenId === body.tokenId);
        if(!filteredToken) {
            throw new Error(`invalid token address`);
        }

        const token = filteredToken[0];
        
        const amount = Math.floor(parseFloat(body.requestAmount))
        if (amount <= 0) {
            throw new Error(`amount deposit cannot lower or equal then zero`);
        }
        try {
            const withdrawReq = await this.config.api.withdrawalRequest(body);

            /**@type {{message: string, withdrawalUid: string}} */
            return withdrawReq
        } catch (/** @type {any} */error) {
            throw new Error(error);
        }
    }

    /**
     * get account detail from platform
     * @param {number} page
     * @param {number} limit
     * @returns {Promise<import("./service/api/constant").tokenBalanceInfo>}
     */
    getAccountBalance = async (page, limit) => {
        if (!this.blockchain) await this.getBlockchainData();
        /**@type {import("./service/api/constant").tokenBalanceQuery} */
        if (!this.blockchain?.key) throw new Error();
        const query = {
            blockchianKey: this.blockchain?.key,
            userAddress: this.config.walletConfig.address,
            limit: limit,
            page: page
        }

        try {
            const account = await this.config.api.account(query);

            return account;
        } catch (/** @type {any} */error) {
            throw new Error(error);
        }
    }

    /**
     * get all list of existing market
     * @param {import("./service/api/constant").marketFilterQuery} query
     * @returns {Promise<import("./service/api/constant").markets[]>}
     */
    getMarketList = async (query) => {
        if (this.blockchain) {
            query.blockchainKey = this.blockchain.key;
        }

        if (!query.page) query.page = 1;
        if (!query.limit) query.limit = 25;

        try {
            const markets = await this.config.api.market(query);
            
            return markets
        } catch (/** @type {any} */error) {
            throw new Error(error);
        }
    }

    /**
     * get all trade transaction
     * @param {import("./service/api/constant").tradeQuery} query
     * @returns {Promise<import("./service/api/constant").trades[]>}
     */
    getTradeHistory = async(query) => {
        if (this.blockchain) {
            query.blockchainKey = this.blockchain.key;
        }
        try {
            const trade = await this.config.api.trade(query);

            return trade;
        } catch (/** @type {any} */error) {
            throw new Error(error);
        }
    }

    /**
     * get all order creation request
     * @param {import("./service/api/constant").tokenOrder} body
     * @returns {Promise<{message: string, orderUid: string}>}
     */
    createOrder = async(body) => {
        if (this.blockchain) {
            body.blockchainKey = this.blockchain.key;
        }

        const dateNow = Math.floor(Date.now() / 1000);
        if (body.deadline <= dateNow) {
            throw new Error(`deadline order time must be greater then today and format must be in second`);
        }

        const amount = Math.floor(parseFloat(body.amount));
        if (amount <= 0) throw new Error(`order amount must be greater then zero`);
        try {
            const order = await this.config.api.orderCreation(body);

            return order;
        } catch (/** @type {any} */error) {
            throw new Error(error);
        }
    }

    /**
     * get estimate amount or price by side e.g (buy or sell)
     * @param {import("./service/api/constant").marketRequest} body
     * @returns {Promise<import("./service/api/constant").amountData>}
     */
    getEstimateAmountMarkets = async(body) => {
        if (this.blockchain) {
            body.blockchainKey = this.blockchain.key;
        }

        if (!body.amount) throw new Error(`must be choose one of type estimate`);
        if (!body.price) throw new Error(`must be choose one of type estimate`);
        
        const amount = body.amount ? Math.floor(parseFloat(body.amount)) : Math.floor(parseFloat(body.price));
        if (amount <= 0) throw new Error(`order amount must be greater then zero`);

        try {
            const estimate = await this.config.api.estimatedAmountMarkets(body);

            return estimate;
        } catch (/** @type {any} */error) {
            throw new Error(error);
        }
    }
}