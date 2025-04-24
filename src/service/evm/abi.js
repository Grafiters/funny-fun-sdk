import { parseAbi } from "viem";

export const abi = parseAbi([
   'event TokenCreated(address indexed creatorAddress, address indexed tokenAddress, string name, string symbol, uint8 decimals, uint256 initialSupply)',
   'error UnauthorizedError(address expected, address actual)',
   'error InsufficientTokenCreationFeeError(uint256 expected, uint256 actual)',
   'error InvalidPaymentManagerAddressError(address paymentManagerAddress)',
   'function getTokenCreationFee() external view returns (uint256)',
   'function createToken(string memory name, string memory symbol, uint256 lockedAmount, uint256 lockedUntil) external payable returns (address)',
])

export const paymentManagerAbi = [
   {
      inputs: [{ internalType: 'address', name: '_paymentAddress', type: 'address' }],
      stateMutability: 'nonpayable',
      type: 'constructor',
   },
   {
      anonymous: false,
      inputs: [
         { indexed: true, internalType: 'address', name: 'user', type: 'address' },
         { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
         { indexed: false, internalType: 'address', name: 'token', type: 'address' },
         { indexed: false, internalType: 'address', name: 'paymentAddress', type: 'address' },
      ],
      name: 'Deposited',
      type: 'event',
   },
   {
      anonymous: false,
      inputs: [
         { indexed: true, internalType: 'address', name: 'user', type: 'address' },
         { indexed: false, internalType: 'address', name: 'newPaymentAddress', type: 'address' },
      ],
      name: 'PaymentAddressUpdated',
      type: 'event',
   },
   {
      anonymous: false,
      inputs: [
         { indexed: true, internalType: 'address', name: 'user', type: 'address' },
         { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
         { indexed: false, internalType: 'address', name: 'token', type: 'address' },
         { indexed: false, internalType: 'address', name: 'paymentAddress', type: 'address' },
      ],
      name: 'Withdrawn',
      type: 'event',
   },
   {
      inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
      name: 'contractBalance',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
   },
   { inputs: [], name: 'deposit', outputs: [], stateMutability: 'payable', type: 'function' },
   {
      inputs: [
         { internalType: 'address', name: 'token', type: 'address' },
         { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'depositToken',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
   },
   {
      inputs: [],
      name: 'getPaymentAddress',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
   },
   {
      inputs: [],
      name: 'owner',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
   },
   {
      inputs: [],
      name: 'paymentAddress',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
   },
   {
      inputs: [{ internalType: 'address', name: 'newPaymentAddress', type: 'address' }],
      name: 'setPaymentAddress',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
   },
   {
      inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
      name: 'withdraw',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
   },
   {
      inputs: [
         { internalType: 'uint256', name: 'amount', type: 'uint256' },
         { internalType: 'address', name: 'token', type: 'address' },
         { internalType: 'address', name: 'to', type: 'address' },
      ],
      name: 'withdrawToken',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
   },
];

export const erc20abi = [
   {
     "constant": true,
     "inputs": [],
     "name": "name",
     "outputs": [{ "name": "", "type": "string" }],
     "type": "function"
   },
   {
     "constant": false,
     "inputs": [
       { "name": "_spender", "type": "address" },
       { "name": "_value", "type": "uint256" }
     ],
     "name": "approve",
     "outputs": [{ "name": "", "type": "bool" }],
     "type": "function"
   },
   {
     "constant": true,
     "inputs": [],
     "name": "totalSupply",
     "outputs": [{ "name": "", "type": "uint256" }],
     "type": "function"
   },
   {
     "constant": false,
     "inputs": [
       { "name": "_from", "type": "address" },
       { "name": "_to", "type": "address" },
       { "name": "_value", "type": "uint256" }
     ],
     "name": "transferFrom",
     "outputs": [{ "name": "", "type": "bool" }],
     "type": "function"
   },
   {
     "constant": true,
     "inputs": [],
     "name": "decimals",
     "outputs": [{ "name": "", "type": "uint8" }],
     "type": "function"
   },
   {
     "constant": true,
     "inputs": [],
     "name": "symbol",
     "outputs": [{ "name": "", "type": "string" }],
     "type": "function"
   },
   {
     "constant": true,
     "inputs": [
       { "name": "_owner", "type": "address" }
     ],
     "name": "balanceOf",
     "outputs": [{ "name": "balance", "type": "uint256" }],
     "type": "function"
   },
   {
     "constant": false,
     "inputs": [
       { "name": "_to", "type": "address" },
       { "name": "_value", "type": "uint256" }
     ],
     "name": "transfer",
     "outputs": [{ "name": "", "type": "bool" }],
     "type": "function"
   },
   {
     "constant": true,
     "inputs": [
       { "name": "_owner", "type": "address" },
       { "name": "_spender", "type": "address" }
     ],
     "name": "allowance",
     "outputs": [{ "name": "", "type": "uint256" }],
     "type": "function"
   },
   {
     "anonymous": false,
     "inputs": [
       { "indexed": true, "name": "owner", "type": "address" },
       { "indexed": true, "name": "spender", "type": "address" },
       { "indexed": false, "name": "value", "type": "uint256" }
     ],
     "name": "Approval",
     "type": "event"
   },
   {
     "anonymous": false,
     "inputs": [
       { "indexed": true, "name": "from", "type": "address" },
       { "indexed": true, "name": "to", "type": "address" },
       { "indexed": false, "name": "value", "type": "uint256" }
     ],
     "name": "Transfer",
     "type": "event"
   }
]
 