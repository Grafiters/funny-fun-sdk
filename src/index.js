import axios from "axios";
import { DEFAULT_MESSAGE, DEFAULT_NETWORK_WALLET } from "./contsant";
import Platform from "./service/api";
import EVMWallet from "./service/evm";
import SolanaWallet from "./service/solana";

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
     * get signature message from wallet
     */
    signature = async () => {
        const nonce = await this.config.api.nonce(this.config.walletConfig.address.toString(), this.config.options.network);
        const signature = await this.config.wallet.signMessage({
            message: DEFAULT_MESSAGE[this.config.network],
            nonce: nonce,
            domain: this.config.walletConfig.domain,
            url: this.config.walletConfig.origin
        })

        return signature;
    }
}