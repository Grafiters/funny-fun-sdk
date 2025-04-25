import axios from "axios";
import { DEFAULT_BASE_ORIGIN, DEFAULT_MESSAGE, DEFAULT_NETWORK_WALLET, DEFAULT_TOKEN_SUPPLY } from "./contsant";
import Platform from "./service/api";
import EVMWallet from "./service/evm";
import SolanaWallet from "./service/solana";
import { filterBlockchainNetwork } from "./utils";
import WebSocket from 'ws';
import { ethers, parseUnits } from "ethers";
import { getFutureEpochInMinutes } from "./utils/getFutureEpoach";

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
     * @arg {String} options.websocketUrl - an websocket realtime server user
     * @arg {String} [options.rpcUrl] - an rpc url from blockchain network
     * @arg {Number} [options.chainId] - chain id from wallet there is from wallet only on evm wallet
     * @arg {import("./service/solana").Cluster} [options.solanaNetwork]
     * @arg {keyof typeof DEFAULT_NETWORK_WALLET} options.network
     */
    constructor (options) {
        let axiosInstance = axios;

        /**@type {import("./lib/api.d.ts").ApiImpelemanted} */
        const apiConfig = !options.serverUrl ? new Platform({serverUrl: options.serverUrl}) : new Platform({fetch: axiosInstance, serverUrl: options.serverUrl});
        
        const config = {
            chainId: options.chainId,
            privateKey: options.privateKey,
            cluster: options.solanaNetwork,
            rpcUrl: options.rpcUrl,
            serverUrl: options.serverUrl
        }

        /** @type {import("./lib/wallet.d.ts").WalletImplemented} */
        const wallet = options.network === DEFAULT_NETWORK_WALLET.evm ? new EVMWallet(config) : new SolanaWallet(config);

        const socket = `${options.websocketUrl}?userSignature=${wallet.config().address}`;

        this.config = {
            api: apiConfig,
            wallet: wallet,
            walletConfig: wallet.config(),
            options: options,
            network: options.network,
            message: DEFAULT_MESSAGE[options.network],
            socket: socket
        }
    }
    
    /**
     * get lis of all token from spesified network
     * @returns {Promise<import("./service/api/constant").tokenLists[]>}
     */
    tokenLists = async () => {
        if (!this.blockchain) {
            await this.getBlockchainData();
            if (!this.blockchain) throw new Error("Blockchain data failed to load.");
        }
        try {
            const req = await this.config.api.tokens(this.blockchain?.key);

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
        if (!this.blockchain) {
            await this.getBlockchainData();
            if (!this.blockchain) throw new Error("Blockchain data failed to load.");
        }
        await this.config.api.checkStatusServer(this.config.options.serverUrl);
        
        const nonce = await this.config.api.nonce(this.config.walletConfig.address.toString(), this.config.options.network);
        const signature = await this.config.wallet.signMessage({
            message: DEFAULT_MESSAGE[this.config.network],
            nonce: nonce,
            domain: this.config.walletConfig.domain,
            url: this.config.walletConfig.origin == DEFAULT_BASE_ORIGIN ? this.config.walletConfig.origin : DEFAULT_BASE_ORIGIN
        });
        
        this.config.api.setSignatureAuth(signature);
        
        await this.config.api.authCheck(/** @type {String} */ this.blockchain?.key);
        return signature;
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
     * @returns {Promise<{tokenMetadataUrl: string}>}
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
     * @param {boolean} isLocked
     * @param {string} amountLocked
     * @param {number} timeLocked
     * @param {BigInt} initialbuyAmount
     * @param {String} [metadataUrl]
     * @returns {Promise<String>}
     */
    deployToken = async (tokenName, tokenSymbol, isLocked, amountLocked, timeLocked, initialbuyAmount, metadataUrl = undefined) => {
        if (!this.blockchain) {
            await this.getBlockchainData();
        }
        
        try {
            const deploy = await this.config.wallet.createToken(
                tokenName,
                tokenSymbol,
                isLocked,
                amountLocked,
                timeLocked,
                initialbuyAmount,
                this.blockchain?.tokenFactoryContractAddress,
                metadataUrl,
                this.blockchain?.tokenCreationFee
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
        console.log(params);
        
        try {
            const req = await this.config.api.uploadTokenData(params);
            return req;
        } catch ( /**@type {any} */ error) {
            throw new Error(error)
        }
    }

    /**
     * update token data to platform
     * @param {String} factoryAddress
     * @param {import("./service/api/constant").tokens} [params]
     * @returns {Promise<any>}
     */

    listener = async (factoryAddress, params) => {
        return new Promise(async (resolve, reject) => {  
            if (!factoryAddress) {
                return reject(new Error('Factory address is not configured'));
            }
            
            const onMessage = async (/** @type {any} */ event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log(data);
                    
                    if (data.result.event === 'TokenCreatedEvent' && params) {
                        cleanup();
                        console.log(data);
                        
                        resolve(data);
                    }
                    
                    if (data.result.event === 'UserDepositedEvent') {
                        cleanup();
                        
                        resolve(data)
                    }
                } catch (err) {
                    console.error('❌ Invalid WS message:', err);
                }
            };
        
            const onError = ( /** @type {any} */ err) => {
                cleanup();
                reject(new Error('WebSocket error: ' + err.message));
            };

            const socket = new WebSocket(this.config.socket);

            socket.onopen = async () => {
                socket.send(JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'subscribe',
                    params: [
                        ['TokenCreatedEvent', 'UserDepositedEvent'],
                        [],
                        [factoryAddress],
                    ]
                }));

                console.log('📡 Subscription request sent...');
            };

            const cleanup = () => {
                socket.removeEventListener('message', onMessage);
                socket.removeEventListener('error', onError);
                if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
                    socket.close();
                }
            };

            socket.addEventListener('message', onMessage);
            socket.addEventListener('error', onError);
        });
    };

    /**
     * deploy and create token with same action
     * @param {import("./service/api/constant").tokens} params token data
     * @returns {Promise<any>}
     */
    deployAndRequestCreateToken = async(params) => {        
        if (!this.blockchain) {
            await this.getBlockchainData();
        }

        if (!params.isLocked){
            params.isLocked = false;
            params.amountLocked = '0';
            params.timeLocked = 0;
        }

        if (params.isLocked){
            if (!params.timeLocked) {
                throw new Error(`amount locked must be exsits when token need to locked`);
            }
        };

        const accountBalance = await this.getAccountBalance();
        const filteredBalance = accountBalance.filter((item) => item.tokenId === params.quoteTokenId);
        const platformBalance = filteredBalance[0];
        const exactInitialBuy = ethers.parseUnits(params.initialBuyPrice, platformBalance.tokenDecimals);

        
        try {
            let initialBuyAmount = BigInt(0);
            if (exactInitialBuy > 0) {
                const exactPlarformBalance = ethers.parseUnits(params.initialBuyPrice, platformBalance.tokenDecimals);
                if (exactPlarformBalance < 0) throw new Error(`Insufficient balance user on platform, please deposit first`);

                const premarketPrice = await this.config.api.premarketRequest({
                    blockchainKey: this.blockchain?.key ?? '',
                    quoteTokenId: params.quoteTokenId,
                    price: params.initialBuyPrice
                });

                params.amountLocked = premarketPrice.amount;

                if (this.config.network === DEFAULT_NETWORK_WALLET.solana) {
                    initialBuyAmount = parseUnits(premarketPrice.amount, platformBalance.tokenDecimals);
                    const tokenSupply = DEFAULT_TOKEN_SUPPLY * 10 ** platformBalance.tokenDecimals;
                    const streamFlow = initialBuyAmount / 100n;
                    params.amountLocked = (BigInt(tokenSupply) - initialBuyAmount - streamFlow).toString();
                }
            }

            /** @type {Number} */
            let timeLocked = 0;
            if (params.timeLocked && params.isLocked) {
                timeLocked = params.timeLocked && params.isLocked ? params.timeLocked : 0;
            }

            if (!this.blockchain?.tokenFactoryContractAddress) throw new Error(`factory address undefined`);
            
            let metadataUrl = '';
            if (this.config.network === DEFAULT_NETWORK_WALLET.solana) {
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
    
                metadataUrl = url.tokenMetadataUrl;
            }
            
            /** @type {String} */
            let lockAmount = '0';
            if (params.amountLocked && params.isLocked) {
                lockAmount = !params.amountLocked && !params.isLocked ? '0' : params.amountLocked;
            }

            /**@type {any} */
            let update
            if (this.config.network === DEFAULT_NETWORK_WALLET.solana) {
                const deployToken = await this.deployToken(
                    params.tokenName,
                    params.tokenSymbol,
                    params.isLocked,
                    lockAmount,
                    timeLocked,
                    initialBuyAmount,
                    metadataUrl
                );
        
                params.txHash = deployToken;
                console.log(deployToken);
                

                update = await this.createToken(params);
            }else{
                const listenPromise = this.listener(this.blockchain?.tokenFactoryContractAddress, params)

                const deployToken = await this.deployToken(
                    params.tokenName,
                    params.tokenSymbol,
                    params.isLocked,
                    lockAmount,
                    timeLocked,
                    BigInt(0),
                    metadataUrl
                );
        
                params.txHash = deployToken;
        
                const listener = await listenPromise;
                update = await this.createToken(params);
            }
            
            return update;
        } catch (/** @type {any} */error) {
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
     * @returns {Promise<{message: string, txHash: string, time: number}>}
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

        const accountBalance = await this.getAccountBalance();
        const filteredBalance = accountBalance.filter((item) => item.blockchainKey === body.blockchainKey && item.tokenId === body.tokenId);

        const platformBalance = filteredBalance[0];
        
        if(!platformBalance) {
            throw new Error(`invalid token address`);
        }
        
        const amount = parseFloat(body.amount)
        if (amount <= 0) {
            throw new Error(`amount deposit cannot lower or equal then zero`);
        }
        if (!this.blockchain) {
            throw new Error(`data blockchain is invalid`);
        }

        /** @type {string} */
        let address = '';
        if (typeof this.config.walletConfig.address !== 'string') {
            /** @type {string} */
            address = this.config.walletConfig.address.toString();
        }else{
            address = this.config.walletConfig.address;
        }
        
        try {
            const listenPromise = this.listener(address);
            const tokenType = platformBalance.tokenId.split(':')
            if(tokenType[0] === 'erc20' || tokenType[0] === 'token') {
                const token = body.tokenId.split(':')[1];
                await this.config.wallet.depositToken(
                    this.blockchain?.depositAddress,
                    body.amount,
                    token
                );
                
                const listen = await listenPromise;
                
                return {
                    message: `user deposited success`,
                    time: listen.result.data.depositTime,
                    txHash: listen.result.data.depositTxHash
                }
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
     * @returns {Promise<{message: string, txHash: string, time: number}>}
     */
    createDeposit = async(body) => {
        if (!this.blockchain) {
            await this.getBlockchainData();
        }
        if (body.blockchainKey && body.blockchainKey !== this.blockchain?.key) {
            throw new Error(`invalid blockchain key`);
        }

        if (!this.blockchain) {
            throw new Error(`data blockchain is invalid`);
        }
        if (!body.blockchainKey) {
            body.blockchainKey = this.blockchain?.key;
        }
        
        const accountBalance = await this.getAccountBalance();
        const filteredBalance = accountBalance.filter((item) => item.blockchainKey === body.blockchainKey && item.tokenId === body.tokenId);
        
        const platformBalance = filteredBalance[0];

        const amount = ethers.parseUnits(body.amount, platformBalance.tokenDecimals)
        
        if (amount <= 0) {
            throw new Error(`amount deposit cannot lower or equal then zero`);
        }

        /** @type {string} */
        let address = '';
        if (typeof this.config.walletConfig.address !== 'string') {
            /** @type {string} */
            address = this.config.walletConfig.address.toString();
        }else{
            address = this.config.walletConfig.address;
        }
        
        try {
            const listenPromise = this.listener(address)
            await this.config.wallet.deposit(
                this.blockchain?.depositAddress,
                body.amount
            );

            const listen = await listenPromise;
            
            return {
                message: `user deposited success`,
                time: listen.result.data.depositTime,
                txHash: listen.result.data.depositTxHash
            }
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
     * @returns {Promise<{message: string, withdrawalUid: {uid: string}}>}
     */
    createWithdraw = async(body) => {
        if(!this.blockchain) throw new Error(`haven't setup blockchain data`);
        body.blockchainKey = this.blockchain?.key;

        const tokens = await this.tokenLists();

        const filteredToken = tokens.filter(item => item.tokenId === body.tokenId);
        if(!filteredToken) {
            throw new Error(`invalid token address`);
        }

        const amount = parseFloat(body.requestAmount)
        if (amount <= 0) {
            throw new Error(`amount deposit cannot lower or equal then zero`);
        }
        try {
            const withdrawReq = await this.config.api.withdrawalRequest(body);

            /**@type {{message: string, withdrawalUid: {uid: string}}}} */
            return withdrawReq
        } catch (/** @type {any} */error) {
            throw new Error(error);
        }
    }

    /**
     * get account detail from platform
     * @param {number} [page]
     * @param {number} [limit]
     * @returns {Promise<import("./service/api/constant").tokenBalanceInfo[]>}
     */
    getAccountBalance = async (page, limit) => {
        if (!this.blockchain) await this.getBlockchainData();

        /**@type {import("./service/api/constant").tokenBalanceQuery} */
        if (!this.blockchain?.key) throw new Error();

        const query = {
            blockchainKey: this.blockchain?.key,
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

        if (!body.amount && !body.price) throw new Error(`must be choose one of type estimate`);

        // @ts-ignore
        const amount = body.amount ? parseFloat(body.amount) : parseFloat(body.price);
        if (amount <= 0) throw new Error(`order amount must be greater then zero`);

        try {
            const estimate = await this.config.api.estimatedAmountMarkets(body);

            return estimate;
        } catch (/** @type {any} */error) {
            throw new Error(error);
        }
    }
}