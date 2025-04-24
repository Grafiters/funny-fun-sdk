// @ts-check

import { describe } from 'node:test';
import FunnyFunSdk from '../index';
import { testingImage } from './token-image';

/**
 * @typedef {"evm" | "solana"} Network
 */


/**
 * @typedef {'devnet' | 'testnet' | 'mainnet-beta'} Cluster
 */

describe(`Funny Fun SDK Integration test`, () => {
    /** @type {FunnyFunSdk} */
    let sdk;

    beforeAll(() => {
        /**
         * @type {{
        *   serverUrl: string;
        *   privateKey: string;
        *   rpcUrl?: string;
        *   chainId?: number;
        *   websocketUrl: string;
        *   network: Network;
        *   solanaNetwork?: Cluster;
        * }}
        */
        const options = {
            serverUrl: `https://api.nusabyte.com`,
            privateKey: 'change with your secret key',
            rpcUrl: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
            websocketUrl: 'wss://api.nusabyte.com/api/v1/realtime',
            chainId: 97,
            network: /**@type {Network} */ "evm", // Ensure 'evm' or 'solana' is passed as a string literal
            solanaNetwork: "devnet"
        }

        sdk = new FunnyFunSdk(options);
    })

    /** test for get token list api */
    test('should fetch token list from API', async () => {
        const tokens = await sdk.tokenLists();
        expect(Array.isArray(tokens)).toBe(true);
    });

    /** test for get all balance user on platform */
    test(`should fetch platform balance user`, async() => {
        const signature = await sdk.signature();
        const balance = await sdk.getAccountBalance(1, 25);
        console.log(balance);

        expect(Array.isArray(balance)).toBe(true);
        
    })

    test('should fetch signature and ser auth from api', async() => { 
        const signature = await sdk.signature();
        console.log('Fetched Signature:');
        console.log('===============');
        console.log(signature);
        console.log('===============');
        expect(typeof signature).toBe('string');
    })

    test('should create deposit token', async () => {
        await sdk.signature();
        const blockchain = await sdk.getBlockchainData();
        const pairToken = 'erc20:0xCf4E54700156e74918EaF77A9ab8C050C8b05890';

        const deposit = await sdk.deployAndRequestCreateToken({
            blockchainKey: blockchain.key,
            quoteTokenId: pairToken,
            initialBuyPrice: '0',
            tokenImage: testingImage,
            tokenSymbol: 'TFK',
            tokenWebsite: 'https://tfk.org',
            tokenTwitter: 'https://x.com/@tfk',
            tokenTelegram: 'https://telegram.org/@tfk',
            tokenDiscord: 'https://discord.com/@tfk',
            tokenName: 'Test Fun Token',
            tokenDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac purus ac eros faucibus commodo commodo eu dui. Maecenas et accumsan odio, interdum ultricies enim. Proin at pharetra quam, eget cursus turpis. Aliquam pharetra nunc vel luctus viverra. Duis ultrices ex quis risus mattis, at scelerisque tellus iaculis. Praesent porta dignissim lorem non tincidunt. Mauris lacus sem, rhoncus sit amet elit at, lacinia commodo tortor. In massa augue, condimentum eu condimentum in, elementum quis nibh. Morbi tempor, diam sit amet vestibulum consectetur, ipsum ligula ultricies libero, ut commodo orci nulla at lorem. Proin sit amet dapibus nisi'
        });

        console.log(deposit);
        expect(typeof deposit).toBe('string');
    }, 25000);

    test('should create deposit with spesific amount', async() => {
        const blockchain = await sdk.getBlockchainData();

        /**@type {import('../service/api/constant').depositsCreation} */
        const depositParam = {
            amount: '0.001',
            blockchainKey: blockchain.key,
            tokenId: 'slip44:714'
        }

        const deposit = await sdk.createDeposit(depositParam);
        console.log(deposit);
        expect(deposit.message).toBe('user deposited success');
        expect(typeof deposit.txHash).toBe('string');
    
    }, 25000);

    test('should create deposit token with spesific amount', async() => {
        const blockchain = await sdk.getBlockchainData();

        /**@type {import('../service/api/constant').depositsCreation} */
        const depositParam = {
            amount: '1',
            blockchainKey: blockchain.key,
            tokenId: 'erc20:0xCf4E54700156e74918EaF77A9ab8C050C8b05890'
        }

        const deposit = await sdk.createDepositToken(depositParam);
        console.log(deposit);
        expect(deposit.message).toBe('user deposited success');
        expect(typeof deposit.txHash).toBe('string');
    }, 40000);

    test(`should return list of deposit`, async () => {
        const sign = await sdk.signature();
        console.log(sign);
        
        const blockchain = await sdk.getBlockchainData();

        /**@type {import('../service/api/constant').depositQuery} */
        const query = {
            page: 1,
            limit: 25,
            blockchainKey: blockchain.key,
            userAddress: '0x97F3222Bb839D54cf033b5393C700EC28ECc14cD'
        }

        const depositList = await sdk.getDeposit(query);
        console.log(depositList);
        
        expect(Array.isArray(depositList)).toBe(true);
    })

    test(`should get trade history`, async () => {
        const sign = await sdk.signature();
        const blockchain = await sdk.getBlockchainData();
        /**
         * @type {import('../service/api/constant').tradeQuery}
         */
        const query = {
            blockchainKey: blockchain.key,
            userAddress: '0x97F3222Bb839D54cf033b5393C700EC28ECc14cD'
        };
        const trade = await sdk.getTradeHistory(query);
        console.log(trade);
        expect(Array.isArray(trade)).toBe(true);
    })

    test(`get all market data on platform`, async () => {
        const sign = await sdk.signature();
        const blockchain = await sdk.getBlockchainData();

        /**
         * @type {import('../service/api/constant').marketFilterQuery}
         */
        const query = {
            page: 1,
            limit: 25,
            orderBy: 'creationTimeAsc',
            blockchainKey: blockchain.key
        }

        const market = await sdk.getMarketList(query);
        console.log(market);
        expect(Array.isArray(market)).toBe(true);
    })

    test('create order trade and get estimate price or amount with spesific blockchainKey and market', async() => {
        const sign = await sdk.signature();
        const blockchain = await sdk.getBlockchainData();
        const getEstimateAmount = await sdk.getEstimateAmountMarkets({
            baseTokenId: 'erc20:0x1737eFBa9e477c6a9ae8d7F47332604eEcc2a567',
            quoteTokenId: 'erc20:0xCf4E54700156e74918EaF77A9ab8C050C8b05890',
            side: 'buy',
            marketType: 'price',
            amount: '0.1',
            blockchainKey: blockchain.key
        })

        console.log(getEstimateAmount);
                
        /**
         * @type {import('../service/api/constant').tokenOrder}
         */
        const body = {
            baseTokenId: "erc20:0x1737eFBa9e477c6a9ae8d7F47332604eEcc2a567",
            amount: "17411.608737",
            deadline: 1745503686,
            blockchainKey: blockchain.key,
            orderType: "buy",
            price: "0.1",
            quoteTokenId: "erc20:0xCf4E54700156e74918EaF77A9ab8C050C8b05890",
            slippage: "1"
        }

        const order = await sdk.createOrder(body);
        console.log(order);
        expect(typeof order.message).toBe('string')
        expect(typeof order.orderUid).toBe('string')
    })

    test(`create withdrawals`, async() => {
        const sign = await sdk.signature();
        const blockchain = await sdk.getBlockchainData();

        /**
         * @type {import('../service/api/constant').withdrawalRequest}
         */
        const body = {
            tokenId: 'erc20:0xCf4E54700156e74918EaF77A9ab8C050C8b05890',
            userAddress: '0x97F3222Bb839D54cf033b5393C700EC28ECc14cD',
            requestAmount: '0.2'
        }

        const withdraw = await sdk.createWithdraw(body);

        console.log(withdraw);

        expect(typeof withdraw.message).toBe('string')
        expect(typeof withdraw.withdrawalUid.uid).toBe('string');
    })

    test(`get withdrawal list`, async()=>{
        const sign = await sdk.signature();
        const blockchain = await sdk.getBlockchainData();

        /**
         * @type {import('../service/api/constant').withdrawalQuery}
         */
        const query = {
            userAddress: '0x97F3222Bb839D54cf033b5393C700EC28ECc14cD',
            page: 1,
            limit: 25
        }
        const withdraw = await sdk.getWithdrawals(query)
        console.log(withdraw);
        expect(Array.isArray(withdraw)).toBe(true);
    })
});