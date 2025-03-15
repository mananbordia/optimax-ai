# AgentKit Integration for Optimax AI

This integration adds blockchain capabilities to the Optimax AI platform using Coinbase's AgentKit.

## Setup Instructions

1. **Create a Coinbase Developer Platform Account**
   - Visit [Coinbase Developer Platform](https://docs.cdp.coinbase.com) to create an account
   - Generate API keys for your application

2. **Configure Environment Variables**
   - Navigate to `/setup` in the application
   - Enter your CDP API Key Name and Private Key
   - Select your preferred network (default: base-sepolia testnet)

3. **Restart the Application**
   - Restart your application to apply the changes

## Using Blockchain Capabilities

The AI assistant can now perform various blockchain operations:

- **Wallet Management**
  - View wallet details
  - Check balances
  - Request testnet funds

- **Token Operations**
  - Transfer tokens
  - Check token prices
  - View token information

- **NFT Interactions**
  - View NFT collections
  - Check NFT ownership
  - Get NFT metadata

- **Price Data**
  - Get real-time price data from Pyth Network
  - View historical price trends

## Example Prompts

- "What's my wallet address?"
- "Can you check the current price of ETH?"
- "Request testnet funds for my wallet"
- "Show me my token balances"
- "What NFTs do I own?"

## Troubleshooting

- If you encounter 5XX errors, the CDP service might be temporarily unavailable. Try again later.
- For wallet-related issues, ensure you're connected to the correct network.
- For API key issues, verify your credentials in the setup page.

## Security Notes

- Your API keys are stored securely and are only used for blockchain interactions.
- The AI will never ask for your private keys or seed phrases.
- All blockchain operations are performed through the Coinbase Developer Platform.

