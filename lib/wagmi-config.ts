import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { Icon } from "lucide-react"
import { sepolia, baseSepolia, Chain } from "wagmi/chains"

// Your WalletConnect project ID
const projectId = "0584008d32be02877df3c8cfd0b6cafb"

// Define additional testnets
const zircuitTestnet: Chain = {
  id: 48899,
  name: "Zircuit Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://zircuit1-testnet.p2pify.com/"] },
  },
  blockExplorers: {
    default: { name: "ZircuitScan", url: "https://explorer.testnet.zircuit.com" },
  },
  testnet: true,
}

export const config = getDefaultConfig({
  appName: "Optimax AI",
  projectId: projectId,
  chains: [sepolia, baseSepolia, zircuitTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
})

// Chain metadata for UI
export const chainMetadata = {
  [sepolia.id]: {
    name: "Sepolia",
    icon: "/chains/ethereum.svg",
    nativeCurrency: sepolia.nativeCurrency,
  },
  [baseSepolia.id]: {
    name: "Base Sepolia",
    icon: "/chains/base.svg",
    nativeCurrency: baseSepolia.nativeCurrency,
  },
  [zircuitTestnet.id]: {
    name: "Zircuit Testnet",
    icon: "/chains/zircuit.svg",
    nativeCurrency: zircuitTestnet.nativeCurrency,
  },
}

