// @ts-check

import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { ethers } from "ethers";

/**
 * @typedef {Object} WalletImplemented
 * @property {() => {abiFactory?: string, address: string | PublicKey, domain: string, origin: string, rpcUrl?: string, cluster?: string, provider: any | Connection, wallet: ethers.Wallet | Keypair}} config
 * @property {(params: { message: string, nonce: string, domain: string, url: string }) => Promise<String> } signMessage - promise function for signmessage
 * @property {(tokenName: string, tokenSymbol: string, isLocked: boolean, amountLocked: string, timeLocked: number, initialbuyAmount: BigInt, factoryAddress: string|any, maxSupply: string, tokenCreationFee?: string|any, metadataUrl?: string) => Promise<String|any>} createToken
 * @property {(depsitAddress: string, depositAmount: string, tokenAddress?: string, tokenDecimal?: number) => Promise<string>} deposit
 * @property {(depsitAddress: string, depositAmount: string, tokenAddress?: string, tokenDecimal?: number) => Promise<string>} depositToken
 * @property {(depositAddress: string, tokenAddress: string) => Promise<number>} allowance
 * @property {(depsitAddress: string, depositAmount: string, tokenAddress: string, tokenDecimal: number) => Promise<string>} approve
 */

