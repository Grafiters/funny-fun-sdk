// @ts-check

/**
 * @class WalletService
 * @classdesc wallet service to handle some of function interaction with web3 wallet base on evm
 */

export default class WalletService {
    /**
     * @arg {Object} options
     * @arg {String} [options.address] - an evm user address for authentiation
     * @arg {String} [options.privateKey] - an private key to interaction with web3 or smart contract
     * @arg {Number} [options.chainId] - chain id from connected network
     */
    constructor(options = {}){
        this.address = options.address;

        /** @type {string|undefined} */
        this.privateKey = options.privateKey;

        /** @type {number|undefined} */
        this.chainId = options.chainId;
    }

    /**
     * @arg {Object} params
     * @arg {String} [params.message] - some message to sign on wallet
     * @returns {Promise<String>} - returns an signature message
     */
    signMessage = async(params) => {
        
    }
}