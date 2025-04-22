export const abi = `
[
   'event TokenCreated(address indexed creatorAddress, address indexed tokenAddress, string name, string symbol, uint8 decimals, uint256 initialSupply)',
   'error UnauthorizedError(address expected, address actual)',
   'error InsufficientTokenCreationFeeError(uint256 expected, uint256 actual)',
   'error InvalidPaymentManagerAddressError(address paymentManagerAddress)',
   'function getTokenCreationFee() external view returns (uint256)',
   'function createToken(string memory name, string memory symbol) external payable returns (address)',
]
`