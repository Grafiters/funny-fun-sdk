
[![node-current](https://img.shields.io/node/v/dropbox)](https://www.npmjs.com/package/dropbox)
[![npm](https://img.shields.io/npm/v/dropbox)](https://www.npmjs.com/package/dropbox)
[![codecov](https://codecov.io/gh/dropbox/dropbox-sdk-js/branch/main/graph/badge.svg)](https://codecov.io/gh/dropbox/dropbox-sdk-js)

The offical Dropbox SDK for Javascript
# FunnyFun SDK

FunnyFun SDK is a modern JavaScript library for managing tokens, accounts, metadata, deposits, and withdrawals on the Solana blockchain.
It builds on top of @solana/web3.js and @solana/spl-token, providing an easy-to-use interface for blockchain interactions.

## ✨ Key Features
    - Create new token mints
    - Trade Tokens
    - Deposit and withdraw tokens from vaults
    - Simple integration for Node.js backend or frontend applications

## 📦 Installation
```
npm install

# or

yarn install
```
## 🚀 Getting Started
When initializing the SDK, you must provide an options object with the following parameters:
| Parameters | Type | Requried | Description |
| ---------- | ---- | -------- | ----------- |
| Server Url | String | Yes | Server URL provided by the platform for API communication. |
| Private Key | String | Yes | Secret private key of the user's wallet (for signing transactions). |
| websocketUrl | String | Yes | WebSocket server URL for receiving real-time updates. |
| rpcUrl | String | Yes | RPC endpoint URL of the blockchain network. If not provided, a default may be used based on the network. |
| chainId | Number(optional) | No | Chain ID for EVM-compatible wallets (e.g., Ethereum, BNB Chain). Only applicable to EVM chains. |
| solanaNetwork | Cluster(optional) | No | Solana cluster environment ('devnet', 'testnet', 'mainnet-beta'). Only required when working with Solana. |
| network | keyof typeof DEFAULT_NETWORK_WALLET | Yes | Network type key from DEFAULT_NETWORK_WALLET (e.g., 'evm', 'solana', etc.). Determines which blockchain implementation to use. |

there's how to usage the configuration
```javascript
const options = {
    serverUrl: `https://api.nusabyte.com`,
    privateKey: 'change with your private key',
    rpcUrl: 'https://devnet.helius-rpc.com/?api-key=8e3821c4-4a7f-4876-b3d1-e1f95721569b',
    websocketUrl: 'wss://api.nusabyte.com/api/v1/realtime',
    chainId: 97,
    network: /**@type {Network} */ "solana", // Ensure 'evm' or 'solana' is passed as a string literal
    solanaNetwork: "devnet"
}

const sdk = new FunnyFunSdk(options);
```

## 📚 Function Reference
### Core Function
```javascript
/**
 * get signature message from wallet
 */
signature: () => Promise<string>;
/**
 * deploy and create token with same action
 * @param {import("./service/api/constant").tokens} params token data
 * @returns {Promise<any>}
 */
deployAndRequestCreateToken: (params: import("./service/api/constant").tokens) => Promise<any>;
/**
 * make a deposit spesified blockchain network and wallet
 * @param {import("./service/api/constant").depositsCreation} body
 * @returns {Promise<{message: string, txHash: string, time: number}>}
 */
createDeposit: (body: import("./service/api/constant").depositsCreation) => Promise<{
    message: string;
    txHash: string;
    time: number;
}>;
getDeposit: (query: import("./service/api/constant").depositQuery) => Promise<import("./service/api/constant").deposits[]>;
/**
 * make a deposit token spesified blockchain network and wallet
 * @param {import("./service/api/constant").depositsCreation} body
 * @returns {Promise<{message: string, txHash: string, time: number}>}
 */
createDepositToken: (body: import("./service/api/constant").depositsCreation) => Promise<{
    message: string;
    txHash: string;
    time: number;
}>;
/**
 * get deposit data
 * @param {import("./service/api/constant").depositQuery} query - query from deposit data
 * @returns {Promise<import("./service/api/constant").deposits[]>}
 */
getDeposit: (query: import("./service/api/constant").depositQuery) => Promise<import("./service/api/constant").deposits[]>;
/**
 * get withdrawal data
 * @param {import("./service/api/constant").withdrawalQuery} query
 * @returns {Promise<import("./service/api/constant").withdrawals[]>}
 */
getWithdrawals: (query: import("./service/api/constant").withdrawalQuery) => Promise<import("./service/api/constant").withdrawals[]>;
/**
 * create withdrawal request creation
 * @param {import("./service/api/constant").withdrawalRequest} body
 * @returns {Promise<{message: string, withdrawalUid: {uid: string}}>}
 */
createWithdraw: (body: import("./service/api/constant").withdrawalRequest) => Promise<{
    message: string;
    withdrawalUid: {
        uid: string;
    };
}>;
/**
 * get all order creation request
 * @param {import("./service/api/constant").tokenOrder} body
 * @returns {Promise<{message: string, orderUid: string}>}
 */
createOrder: (body: import("./service/api/constant").tokenOrder) => Promise<{
    message: string;
    orderUid: string;
}>;
```

Other Functions
```javascript
/**
 * get lis of all token from spesified network
 * @returns {Promise<import("./service/api/constant").tokenLists[]>}
 */
tokenLists: () => Promise<import("./service/api/constant").tokenLists[]>;
getBlockchainData: () => Promise<import("./service/api/constant").NetworkInfo>;
blockchain: import("./service/api/constant").NetworkInfo | undefined;
/**
 * update token data to platform
 * @param {String} factoryAddress
 * @param {import("./service/api/constant").tokens} [params]
 * @returns {Promise<any>}
 */
listener: (factoryAddress: string, params?: import("./service/api/constant").tokens) => Promise<any>;
/**
 * upload metadata token only for solana config
 * @param {import("./service/api/constant").tokenMetaData} params - parameter for token meta data but for solana only
 * @returns {Promise<String>}
 */
uplaodMetaData: (params: import("./service/api/constant").tokenMetaData) => Promise<string>;
/**
 * deploy token with smart contract spesified by network blockchains
 * @param {String} tokenName
 * @param {String} tokenSymbol
 * @param {boolean} isLocked
 * @param {string} amountLocked
 * @param {number} timeLocked
 * @param {String} [metadataUrl]
 * @returns {Promise<String>}
 */
deployToken: (tokenName: string, tokenSymbol: string, isLocked: boolean, amountLocked: string, timeLocked: number, metadataUrl?: string) => Promise<string>;
/**
 * update token data to platform
 * @param {import("./service/api/constant").tokens} params
 * @returns {Promise<any>}
 */
createToken: (params: import("./service/api/constant").tokens) => Promise<any>;
/**
 * update token data to platform
 * @param {String} factoryAddress
 * @param {import("./service/api/constant").tokens} [params]
 * @returns {Promise<any>}
 */
listener: (factoryAddress: string, params?: import("./service/api/constant").tokens) => Promise<any>;
/**
 * get account detail from platform
 * @param {number} [page]
 * @param {number} [limit]
 * @returns {Promise<import("./service/api/constant").tokenBalanceInfo[]>}
 */
getAccountBalance: (page?: number, limit?: number) => Promise<import("./service/api/constant").tokenBalanceInfo[]>;
/**
 * get all list of existing market
 * @param {import("./service/api/constant").marketFilterQuery} query
 * @returns {Promise<import("./service/api/constant").markets[]>}
 */
getMarketList: (query: import("./service/api/constant").marketFilterQuery) => Promise<import("./service/api/constant").markets[]>;
/**
 * get all trade transaction
 * @param {import("./service/api/constant").tradeQuery} query
 * @returns {Promise<import("./service/api/constant").trades[]>}
 */
getTradeHistory: (query: import("./service/api/constant").tradeQuery) => Promise<import("./service/api/constant").trades[]>;
/**
 * get estimate amount or price by side e.g (buy or sell)
 * @param {import("./service/api/constant").marketRequest} body
 * @returns {Promise<import("./service/api/constant").amountData>}
 */
getEstimateAmountMarkets: (body: import("./service/api/constant").marketRequest) => Promise<import("./service/api/constant").amountData>;
```

## 🛠️ Usage
Example usage of that function can access on [funny-fun-sdk-test](./src/test/funny-fun.test.js)
## 📋 Best Practice
### Create Token
create token has 2 method has been implement int different network blockchain ('evm', 'solana')
#### EVM
EVM blockchain like (bsc, eth, fantom) there's has a simple method just read the factory smart contract then upload data to backend platform, cause the all logic of smart contract there is can be handle on smart contract

#### Solana
Integration deploy token for solana network to platform it's not same as evm network, cause the solana in this platform doesn't have any smart contract token factory, so we have to deploy manual, with several step

1. upload metadata data token solana token to ipfs on with function ```uploadMetaData()```
2. listen websocket platform to get message about deploy token
3. deploy the token to function ```deployToken()``` with metadataurl is response from ```uploadMetaData()```
4. getMessage from websocket with response about the token has been deploy and registered in to platform but doesn't complete
5. upload the data completed data with txHash is return from ```deployToken()```

cause on deploy token is more complex on different network there's a simple function to handle about that 2 method on ```deployAndRequestCreateToken()```, on that function has been handled deploy token with logic same as platform implemented

example can be found on file [funny-fun.test.js](./src/test/funny-fun.test.js), In this file, all the functions used have been implemented, with execution that is appropriate for the user to the platform.

## 📄 License
This SDK is distributed under the MIT license, please see [LICENSE](./LICENSE) for more information