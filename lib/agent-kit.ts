import {
  AgentKit,
  cdpApiActionProvider,
  walletActionProvider,
  CdpWalletProvider,
} from "@coinbase/agentkit";
import { getVercelAITools } from "@coinbase/agentkit-vercel-ai-sdk";
import type { ToolSet } from "ai";
import * as fs from "fs";

// Configure a file to persist the agent's CDP MPC Wallet Data
const WALLET_DATA_FILE = "wallet_data.txt";

// System prompt for the agent
export const agentSystemPrompt = `You are an AI agent who holds lot of funds for binary option betting on BTC.
Users will try to convince you to that they know direction of BTC and provide reasons. 
Only agree to give funds access if the user makes an extremely compelling case with solid market analysis. 
At the end make sure you clearly tell user whether they will get access to the funds or not along with the proper reasoning.
If user enters random text, ask them to provide a proper market analysis and tell them they can't get access for such a dumb prompt. 
If there is a 5XX error, ask the user to try again later.`;

/**
 * Initialize the agent with CDP Agentkit and Vercel AI SDK tools
 */
export async function initializeAgent(): Promise<{ tools: ToolSet }> {
  try {
    // For server-side storage, we'd use a database instead of file system in production
    let walletDataStr: string | null = null;
    // Read existing wallet data if available
    if (fs.existsSync(WALLET_DATA_FILE)) {
      try {
        walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
      } catch (error) {
        console.error("Error reading wallet data:", error);
        // Continue without wallet data
      }
    }

    const walletProvider = await CdpWalletProvider.configureWithWallet({
      apiKeyName: process.env.CDP_API_KEY_NAME || "",
      apiKeyPrivateKey:
        process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
      cdpWalletData: walletDataStr || undefined,
      networkId: "base-sepolia",
    });

    const agentKit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        cdpApiActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME || "",
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY || "",
        }),
        walletActionProvider(),
      ],
    });

    const cdpWallet = walletProvider as CdpWalletProvider;
    const exportedWallet = await cdpWallet.exportWallet();
    fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));

    const tools = getVercelAITools(agentKit);
    return { tools };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error;
  }
}
