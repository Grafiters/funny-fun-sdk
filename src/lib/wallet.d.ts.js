// @ts-check

import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { ethers } from "ethers";

/**
 * @typedef {Object} WalletImplemented
 * @property {() => {abiFactory?: string, address: string | PublicKey, domain: string, origin: string, rpcUrl?: string, cluster?: string, provider: ethers.JsonRpcProvider | Connection, wallet: ethers.Wallet | Keypair}} config
 * @property {(params: { message: string, nonce: string, domain: string, url: string }) => Promise<String> } signMessage - promise function for signmessage
 * @property {(tokenName: string, tokenSymbol: string, factoryAddress?: string|any, tokenCreationFee?: string|any, metadataUrl?: string) => Promise<String|any>} createToken
 */

