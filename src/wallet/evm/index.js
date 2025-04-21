// @ts-check

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
    * @arg {Number} [options.chainId] - chain id from connected network
    */
    constructor(options = {}) {
        /** @type {string|undefined} */
        this.serverUrl = options.serverUrl;

        /** @type {string|undefined} */
        this.address = options.address;

        /** @type {string|undefined} */
        this.privateKey = options.privateKey;

        /** @type {number|undefined} */
        this.chainId = options.chainId;
    }

    
}