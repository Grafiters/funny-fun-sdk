// @ts-check

import { defineChain } from 'viem';
import { bsc as defaultBsc, holesky as defaultHolesky, bscTestnet as defaultBscTestnet } from 'viem/chains';

export const bsc = defineChain({
  ...defaultBsc,
  rpcUrls: {
    ...defaultBsc.rpcUrls,
    default: {
      ...defaultBsc.rpcUrls.default,
      http: [
        'https://1rpc.io/bnb',
        'https://api.zan.top/bsc-mainnet',
        'https://binance.llamarpc.com',
        'https://bsc-rpc.publicnode.com',
        'https://bsc.blockrazor.xyz',
        'https://bsc.drpc.org',
        'https://rpc.ankr.com/bsc',
        ...defaultBsc.rpcUrls.default.http,
      ].filter(function (rpcUrl, index, rpcUrls) {
        return rpcUrls.indexOf(rpcUrl) === index;
      }),
    },
  },
});

export const bscTestnet = defineChain({
  ...defaultBscTestnet,
  rpcUrls: {
    ...defaultBscTestnet.rpcUrls,
    default: {
      ...defaultBscTestnet.rpcUrls.default,
      http: [
        // 'https://api.zan.top/bsc-testnet',
        'https://bsc-testnet-rpc.publicnode.com',
        'https://bsc-testnet.drpc.org',
        // 'https://bsc-testnet.public.blastapi.io',
        'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
        'https://data-seed-prebsc-1-s2.bnbchain.org:8545',
        'https://data-seed-prebsc-1-s3.bnbchain.org:8545',
        'https://data-seed-prebsc-2-s1.bnbchain.org:8545',
        'https://data-seed-prebsc-2-s2.bnbchain.org:8545',
        'https://data-seed-prebsc-2-s3.bnbchain.org:8545',
        // 'https://endpoints.omniatech.io/v1/bsc/testnet/public',
        ...defaultBscTestnet.rpcUrls.default.http,
      ]
        .filter(function (rpcUrl, index, rpcUrls) {
          return rpcUrls.indexOf(rpcUrl) === index;
        })
        .sort(function (a, z) {
          return Math.random() - 0.5;
        }),
    },
  },
});

export const holesky = defineChain({
  ...defaultHolesky,
  rpcUrls: {
    ...defaultHolesky.rpcUrls,
    default: {
      ...defaultHolesky.rpcUrls.default,
      http: [
        'https://1rpc.io/holesky',
        'https://ethereum-holesky-rpc.publicnode.com',
        'https://holesky.drpc.org',
        // 'https://holesky.gateway.tenderly.co',
        'https://rpc-holesky.rockx.com',
        'https://rpc.holesky.ethpandaops.io',
        ...defaultHolesky.rpcUrls.default.http,
      ].filter(function (rpcUrl, index, rpcUrls) {
        return rpcUrls.indexOf(rpcUrl) === index;
      }),
    },
  },
});

export const peta = defineChain({
  id: 7676,
  name: 'Peta Chain',
  rpcUrls: {
    default: {
      http: [
        'https://rpc.petachain.io',
      ],
    },
  },
  nativeCurrency: {
    decimals: 18,
    name: 'PETA',
    symbol: 'PETA',
  },
});
