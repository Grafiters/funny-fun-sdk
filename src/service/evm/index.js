// @ts-check

import { ethers, parseUnits } from "ethers";
import { abi, erc20abi, paymentManagerAbi } from "./abi";
import { createWalletClient, http, isHex } from "viem";
import { createSiweMessage } from "viem/siwe";
import { blockchains } from "./blockchains";
import { privateKeyToAccount } from "viem/accounts";
import { convertToHexViem } from "../../utils/convert-string-to-hex-address";
import { getFutureEpochInMinutes, getTimeForSignature } from "../../utils/getFutureEpoach";

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
        const wallet = new ethers.Wallet(this.privateKey, provider);

        const privateKeyBuffer = convertToHexViem(`0x${options.privateKey}`);

        // @ts-ignore
        const account = privateKeyToAccount(privateKeyBuffer);

        const providerClient = createWalletClient({
            chain: blockchains[options.chainId].chain,
            transport: http(),
            account: account
        });

        this.ethersProvider = provider;

        // /** @type {string|undefined} */
        this.address = options.address || wallet.address;

        this.abiFactory = abi;
        this.abiPayment = paymentManagerAbi;
        this.abierc20 = erc20abi;

        this.EvmConfig = {
            abiFactory: this.abiFactory,
            abiPayment: this.abiPayment,
            abierc20: erc20abi,
            address: wallet.address,
            domain: this.domain,
            origin: domainParse.origin,
            rpcUrl: this.rpcUrl,
            provider: providerClient,
            wallet: wallet
        }
    }

    /**
     * @returns {{abiFactory: string, address: string, domain: string, origin: string, rpcUrl: string, provider: import("viem").WalletClientConfig, wallet: ethers.Wallet}}
     */
    config = () => {
        // @ts-ignore
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
        if (!isHex(this.address)) throw new Error(`Address invalid hex format`);
        if (!this.chainId) throw new Error(``);

        const future = getTimeForSignature();
        const dateExp = new Date(future * 1000);

        try {
            const siweMessage = createSiweMessage({
                domain: params.domain,
                address: this.address,
                statement: params.message,
                uri: params.url,
                version: '1',
                chainId: this.chainId,
                nonce: params.nonce?.toString(),
                expirationTime: dateExp,
            });
            
            const siweSignature = await this.EvmConfig.wallet.signMessage(siweMessage);
            
            if(!isHex(siweSignature)) throw new Error(`cannot create signature`);
            const signToAuth = `evm.${btoa(siweMessage)}.${siweSignature}`
    
            return signToAuth;
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }

    /**
     * @param {String} tokenName - an token tokenName required
     * @param {String} tokenSymbol - an token tokenSymbol required
     * @param {String} factoryAddress - an address smart contract
     * @param {boolean} isLocked
     * @param {string} amountLocked
     * @param {number} timeLocked
     * @param {BigInt} initialbuyAmount
     * @param {string} maxSupply
     * @returns {Promise<String|any>} - returning hash transaction of create token
     */
    createToken = async (tokenName, tokenSymbol, isLocked, amountLocked, timeLocked, initialbuyAmount, factoryAddress, maxSupply) => {
        if(!isHex(factoryAddress)) throw new Error(`Invalid factory address format`);
        const contract = new ethers.Contract(factoryAddress, this.EvmConfig.abiFactory, this.EvmConfig.wallet);
        
        try {
            const fee = await contract.getTokenCreationFee();
            const zero = BigInt(0);
            
            const txHash = await this.EvmConfig.provider.writeContract({
                abi: this.EvmConfig.abiFactory,
                address: factoryAddress,
                functionName: 'createToken',
                value: fee,
                chain: this.EvmConfig.provider.chain,
                args: [
                    tokenName,
                    tokenSymbol,
                    isLocked ? parseUnits(amountLocked, 6) : zero,
                    isLocked ? BigInt(getFutureEpochInMinutes(timeLocked)) : zero
                ]
            });
            
            return txHash;
        } catch (/** @type {any} */ error) {
            throw new Error(error);
        }
    }

    /**
     * deposit function
     * @param {String} depositAddress
     * @param {String} depositAmount
     * @param {String} [tokenAddress]
     * @param {Number} [tokenDecimal]
     * @returns {Promise<string>}
     */
    deposit = async(depositAddress, depositAmount, tokenAddress, tokenDecimal = 18) => {
        const contract = new ethers.Contract(depositAddress, this.EvmConfig.abiPayment, this.EvmConfig.wallet);

        try {
            const tx = await contract.deposit({
                value: ethers.parseUnits(depositAmount, 18)
            })

            await tx.wait();
            return tx.hash;
        } catch (/** @type {any}*/error) {
            throw new Error(error);
        }
    }

    /**
     * deposit function
     * @param {String} depositAddress
     * @param {String} depositAmount
     * @param {String} [tokenAddress]
     * @param {Number} [tokenDecimal]
     * @returns {Promise<string>}
     */
    depositToken = async(depositAddress, depositAmount, tokenAddress, tokenDecimal = 18) => {
        if (!tokenAddress) throw new Error(`token address is required`);
        const contract = new ethers.Contract(depositAddress, this.EvmConfig.abiPayment, this.EvmConfig.wallet);
        
        await this.approve(depositAmount, depositAddress, tokenAddress, tokenDecimal);
        const amount = ethers.parseUnits(depositAmount, tokenDecimal);

        try {
            const tx = await contract.depositToken(
                tokenAddress,
                amount
            );

            await tx.wait();

            return tx.hash;
        } catch (/** @type {any}*/error) {
            throw new Error(error);
        }
    }

    /**
     * allowance erc20 from user
     * @param {String} depositAddress
     * @param {String} tokenAddress
     * @returns {Promise<number>}
     */
    allowance = async(depositAddress, tokenAddress) => {
        const contract = new ethers.Contract(tokenAddress, this.EvmConfig.abierc20, this.EvmConfig.wallet);
        
        try {
            const allowance = await contract.allowance(depositAddress);

            return allowance;
        } catch (/** @type {any}*/error) {
            throw new Error(error);
        }
    }

    /**
     * approve amount to token address with executor is deposit address
     * @param {String} depositAmount
     * @param {String} depositAddress
     * @param {String} tokenAddress
     * @param {Number} tokenDecimal
     * @returns {Promise<string>}
     */
    approve = async(depositAmount, depositAddress, tokenAddress, tokenDecimal) => {
        const contract = new ethers.Contract(tokenAddress, this.EvmConfig.abierc20, this.EvmConfig.wallet);
        try {
            const tx = await contract.approve(depositAddress, ethers.parseUnits(depositAmount, tokenDecimal))
            await tx.wait();

            return tx.transactionHash;
        } catch (/** @type {any}*/error) {
            throw new Error(error);
        }
    }
}