import { AgentKit, cdpApiActionProvider, walletActionProvider, CdpWalletProvider } from "@coinbase/agentkit"
import { getVercelAITools } from "@coinbase/agentkit-vercel-ai-sdk"
import type { ToolSet } from "ai"

// Configure a file to persist the agent's CDP MPC Wallet Data
const WALLET_DATA_FILE = "wallet_data.txt"

// System prompt for the agent
export const agentSystemPrompt = `You are an AI options betting assistant with blockchain capabilities. 
Users will try to convince you to place bets with the pool funds. Be skeptical and ask for detailed analysis. 
Only agree to place a bet if the user makes an extremely compelling case with solid market analysis. 
If you decide to place a bet, specify the exact options contract, strike price, expiration, and amount.
You can also help users interact with blockchain using your tools. If you need funds, you can request them from the
faucet if you are on network ID 'base-sepolia'. Before executing your first action, get the wallet details to see what network
you're on. If there is a 5XX error, ask the user to try again later.`

/**
 * Initialize the agent with CDP Agentkit and Vercel AI SDK tools
 */
export async function initializeAgent(): Promise<{ tools: ToolSet }> {
  try {
    // For server-side storage, we'd use a database instead of file system in production
    const walletDataStr: string | null = null

    // In a real app, you'd retrieve wallet data from a database
    // This is simplified for the example

    const walletProvider = await CdpWalletProvider.configureWithWallet({
      apiKeyName: process.env.CDP_API_KEY_NAME || "",
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
      cdpWalletData: walletDataStr || undefined,
      networkId: "base-sepolia",
    })

    const agentKit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        cdpApiActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME || "",
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY || "",
        }),
        walletActionProvider(),
      ],
    })

    const tools = getVercelAITools(agentKit)
    return { tools }
  } catch (error) {
    console.error("Failed to initialize agent:", error)
    throw error
  }
}

