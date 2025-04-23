// @ts-check

import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Header, Payload, SIWS } from "@web3auth/sign-in-with-solana";
import nacl from "tweetnacl";
import { DEFAULT_TOKEN_SUPPLY, MINT_SIZE } from "../../contsant";
import { parseUnits } from "ethers";
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    AuthorityType,
    createAssociatedTokenAccountIdempotentInstruction,
    createInitializeMint2Instruction,
    createMintToInstruction,
    createSetAuthorityInstruction,
    createTransferCheckedInstruction,
    getAssociatedTokenAddress,
    getAssociatedTokenAddressSync,
    getMintLen,
    TOKEN_PROGRAM_ID 
} from "@solana/spl-token";
import { createCreateMetadataAccountV3Instruction } from "./metaplex";

/**
 * @class SolanaWallet
 * @classdesc the solana walet configration and related with server
 */

    /** @type {import("../../lib/wallet.d.ts").WalletImplemented} */
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
     * @returns {{address: PublicKey, domain: string, origin: string, cluster: string, provider: Connection, wallet: Keypair}}
     */
     config = () => {
        return this.SolanaConfig;
    }

    /**
     * @arg {Object} params
     * @arg {String} [params.message] - message to get signature
     * @arg {String} [params.nonce] - nonce from request platform endpoint
     * @arg {String} [params.domain] - domain of project
     * @arg {String} [params.url] - url of platform project
     * @returns {Promise<String>}>} - return signature of messages
     */
    signMessage = async (params) => {
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

        return signToBase64
    }

    /**
     * @param {String} tokenName - an name of token
     * @param {String} tokenSymbol - an symbol of token
     * @param {String} factoryAddress - an factory address from config
     * @param {String} [metadataUrl] - an token metadata url
     * @param {String} [tokenCreationFee] - an creation fee 
     * @returns {Promise<String|any>} - returning hash transaction of create token
     */
    createToken = async (tokenName, tokenSymbol, factoryAddress, metadataUrl, tokenCreationFee) => {
        if (!metadataUrl){
            throw new Error(`meta data url is required`);
        }

        if (!tokenCreationFee){
            throw new Error(`token creation is required`);
        }
        const tokenKeypair = Keypair.generate();
        const rentExamp = await this.SolanaConfig.provider.getMinimumBalanceForRentExemption(MINT_SIZE);
        const space = getMintLen([]);
        const tokenDecimals = 6;
        const tokenSupply = DEFAULT_TOKEN_SUPPLY * 10 ** tokenDecimals;
        const transferAddress = factoryAddress;
        const feeAmount = parseUnits(tokenCreationFee, tokenDecimals);
        const tokenAddress = tokenKeypair.publicKey.toString();
        const toWallet = new PublicKey(transferAddress);
        const mint = new PublicKey(transferAddress);
        const fromTokenAddress = await getAssociatedTokenAddress(mint, this.SolanaConfig.address);
        const toTokenAddress = await getAssociatedTokenAddress(mint, toWallet);

        const ata = getAssociatedTokenAddressSync(
            tokenKeypair.publicKey,
            this.SolanaConfig.address,
            false,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        )

        const tx = new Transaction();
        // create account token
        tx.add(
            SystemProgram.createAccount({
                fromPubkey: this.SolanaConfig.address,
                newAccountPubkey: tokenKeypair.publicKey,
                lamports: rentExamp,
                space: space,
                programId: TOKEN_PROGRAM_ID
            })
        );

        // initsialisasi mint
        tx.add(
            createInitializeMint2Instruction(
               tokenKeypair.publicKey,
               tokenDecimals,
               this.SolanaConfig.address,
               this.SolanaConfig.address,
               TOKEN_PROGRAM_ID,
            ),
        );

        // Buat ATA
        tx.add(
            createAssociatedTokenAccountIdempotentInstruction(
               this.SolanaConfig.address,
               ata,
               this.SolanaConfig.address,
               tokenKeypair.publicKey,
               TOKEN_PROGRAM_ID,
               ASSOCIATED_TOKEN_PROGRAM_ID,
            ),
        );

        // Mint token ke ATA
        tx.add(
            createMintToInstruction(
                tokenKeypair.publicKey,
                ata,
                this.SolanaConfig.address,
                tokenSupply,
                [],
                TOKEN_PROGRAM_ID,
            ),
        );

        // Buat metadata        
        tx.add(
            createCreateMetadataAccountV3Instruction({
                mint: tokenKeypair.publicKey,
                authority: this.SolanaConfig.address,
                payer: this.SolanaConfig.address,
                name: tokenName,
                symbol: tokenSymbol,
                uri: metadataUrl,
                sellerFeeBasisPoints: 0,
            })
        );

         // Remove mint authority
        tx.add(
            createSetAuthorityInstruction(
               tokenKeypair.publicKey,
               this.SolanaConfig.address,
               AuthorityType.MintTokens,
               null,
               [],
               TOKEN_PROGRAM_ID,
            ),
        );

        // Remove freeze authority
        tx.add(
            createSetAuthorityInstruction(
               tokenKeypair.publicKey,
               this.SolanaConfig.address,
               AuthorityType.FreezeAccount,
               null,
               [],
               TOKEN_PROGRAM_ID,
            ),
        );

        // Transfer fee to token factory contract address
        const transferFee = SystemProgram.transfer({
            fromPubkey: this.SolanaConfig.address,
            toPubkey: toWallet,
            lamports: feeAmount,
        });
        tx.add(transferFee);

        // Create associated token account for the user and transfer the token supply
        tx.add(
            createAssociatedTokenAccountIdempotentInstruction(
               this.SolanaConfig.address,
               fromTokenAddress,
               this.SolanaConfig.address,
               mint,
               TOKEN_PROGRAM_ID,
               ASSOCIATED_TOKEN_PROGRAM_ID,
            ),
        );

        tx.add(
            createAssociatedTokenAccountIdempotentInstruction(
               this.SolanaConfig.address,
               toTokenAddress,
               toWallet,
               mint,
               TOKEN_PROGRAM_ID,
               ASSOCIATED_TOKEN_PROGRAM_ID,
            ),
        );

        const transferSupplyToken = createTransferCheckedInstruction(
            fromTokenAddress,
            mint,
            toTokenAddress,
            this.SolanaConfig.address,
            Number(tokenSupply),
            tokenDecimals,
        );
        tx.add(transferSupplyToken);

        // 8. Sign and send
        const blockhash = await this.SolanaConfig.provider.getLatestBlockhash('finalized');
        tx.recentBlockhash = blockhash.blockhash;
        tx.feePayer = this.SolanaConfig.address;

        tx.sign(this.SolanaConfig.wallet, tokenKeypair);

        const signature = await this.SolanaConfig.provider.sendRawTransaction(tx.serialize());
        await this.SolanaConfig.provider.confirmTransaction(signature, 'confirmed');

        return tokenAddress;
    }

    /**
     * deposit function
     * @param {String} depositAddress
     * @param {String} depositAmount
     * @param {String} [tokenAddress]
     * @param {Number} [tokenDecimal]
     * @returns {Promise<string>}
     */
    deposit = async (depositAddress, depositAmount, tokenAddress, tokenDecimal = 6) => {
        const toWallet = new PublicKey(depositAddress);
        const exactDepositAmount = Math.floor(parseFloat(depositAmount) * LAMPORTS_PER_SOL);
        const tx = new Transaction();

        try {
            tx.add(
                SystemProgram.transfer({
                    fromPubkey: this.SolanaConfig.address,
                    toPubkey: toWallet,
                    lamports: exactDepositAmount
                })
            )
    
            const { blockhash, lastValidBlockHeight } = await this.SolanaConfig.provider.getLatestBlockhash();
            tx.recentBlockhash = blockhash;
            tx.feePayer = this.SolanaConfig.address;
    
            // Send
            const signature = await this.SolanaConfig.provider.sendRawTransaction(tx.serialize());
            const confirmation = await this.SolanaConfig.provider.confirmTransaction(
                { signature, blockhash, lastValidBlockHeight },
                'confirmed',
            );
    
            if (confirmation.value.err) {
                const err = confirmation.value.err;
                const msg = `Deposit failed. Please try again.`;
    
                throw new Error(err ? JSON.stringify(err) : msg);
            }
    
            return signature;
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
     * @returns {Promise<String>}
     */
    depositToken = async(depositAddress, depositAmount, tokenAddress, tokenDecimal = 6) => {
        if (!tokenAddress) throw new Error(`token address is required`);

        const toWallet = new PublicKey(depositAddress);
        const tx = new Transaction();

        const mint = new PublicKey(tokenAddress);
        const fromTokenAccount = await getAssociatedTokenAddress(mint, this.SolanaConfig.address);
        const toTokenAccount = await getAssociatedTokenAddress(mint, toWallet);

        try {
            // create ATA sender if it doesn't exist
            tx.add(
                createAssociatedTokenAccountIdempotentInstruction(
                this.SolanaConfig.address,
                fromTokenAccount,
                this.SolanaConfig.address,
                mint,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID,
                ),
            );

            // create ATA receiver if it doesn't exist
            tx.add(
                createAssociatedTokenAccountIdempotentInstruction(
                this.SolanaConfig.address,
                toTokenAccount,
                toWallet,
                mint,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID,
                ),
            );

            // create transfer
            const transferIx = createTransferCheckedInstruction(
                fromTokenAccount,
                mint,
                toTokenAccount,
                this.SolanaConfig.address,
                Number(depositAmount),
                tokenDecimal,
            );
            tx.add(transferIx);

            const { blockhash, lastValidBlockHeight } = await this.SolanaConfig.provider.getLatestBlockhash();
            tx.recentBlockhash = blockhash;
            tx.feePayer = this.SolanaConfig.address;

            // Send
            const signature = await this.SolanaConfig.provider.sendRawTransaction(tx.serialize());
            const confirmation = await this.SolanaConfig.provider.confirmTransaction(
                { signature, blockhash, lastValidBlockHeight },
                'confirmed',
            );

            if (confirmation.value.err) {
                const err = confirmation.value.err;
                const msg = `Deposit failed. Please try again.`;

                throw new Error(err ? JSON.stringify(err) : msg);
            }

            return signature;
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
        return '';
    }

    /**
     * allowance erc20 from user
     * @param {String} depositAddress
     * @param {String} tokenAddress
     * @returns {Promise<number>}
     */
    allowance = async(depositAddress, tokenAddress) => {
        return 0;
    }
}