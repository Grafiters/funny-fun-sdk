import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { Header, Payload, SIWS } from "@web3auth/sign-in-with-solana";
import nacl from "tweetnacl";

/**
 * @class SolanaWallet
 * @classdesc the solana walet configration and related with server
 */
export default class SolanaWallet {
    /**
    * @arg {Object} options
    * @arg {String} [options.serverUrl] - an server url for making request
    * @arg {String} [options.address] - an evm user address for authentiation
    * @arg {String} [options.privateKey] - an private key to interaction with web3 or smart contract - e.g ()
    * @arg {import("@solana/web3.js").Cluster} [options.cluster] - an rpc url from blockchain
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
        try {
            if (options.privateKey.length > 64) {
                this.privateKey = Uint8Array.from(Buffer.from(options.privateKey, 'base64'));
            }else{
                this.privateKey = Uint8Array.from(Buffer.from(options.privateKey, 'hex'));
            }
        } catch (error) {
            throw new Error("Invalid privateKey format. Must be base64 or hex.");
        }

        if (!options.chainId) {
            throw new Error('chain id is required.');
        }
        /** @type {number|undefined} */
        this.chainId = options.chainId;

        if (!options.cluster) {
            throw new Error('Rpc Url is required.');
        }
        /** @type {string|undefined} */
        this.cluster = options.cluster;

        const domainParse = new URL(this.serverUrl);
        this.domain = domainParse.hostname;

        const provider = new Connection(clusterApiUrl(options.cluster), 'confirmed')
        const wallet = Keypair.fromSecretKey(this.privateKey);

        /** @type {string|undefined} */
        this.address = options.address || wallet.publicKey.toString();

        this.SolanaConfig = {
            address: wallet.publicKey,
            domain: this.domain,
            origin: domainParse.origin,
            cluster: this.cluster,
            provider: provider,
            wallet: wallet
        }
    }

    /**
     * @arg {Object} params
     * @arg {String} [params.message] - message to get signature
     * @arg {String} [params.nonce] - nonce from request platform endpoint
     * @arg {String} [params.domain] - domain of project
     * @arg {String} [params.url] - url of platform project
     * @returns {Promise<{message: String, signature: String, address: String}>} - return signature of messages
     */
    signMessages = async (params) => {
        const exp = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const header = new Header();
        header.t = 'sip99';
        const payload = new Payload();

        payload.domain = params.domain || '';
        payload.address = this.SolanaConfig.address.toString();
        payload.uri = this.SolanaConfig.origin;
        payload.statement = params.message;
        payload.version = '1';
        payload.chainId = 3;
        payload.nonce = params.nonce || '';
        payload.expirationTime = exp.toISOString();
        payload.issuedAt = new Date().toISOString();

        const message = new SIWS({ header, payload });
        const text = message.prepareMessage();
        const encode = new TextEncoder().encode(text);
        const signature = nacl.sign.detached(encode, this.privateKey);
        const signToBase64 = Buffer.from(signature).toString('base64');

        return {
            message: params.message || '',
            signature: signToBase64,
            address: this.SolanaConfig.address.toString()
        }
    }
}