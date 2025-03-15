import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { sepolia, baseSepolia } from "wagmi/chains"

// Your WalletConnect project ID
const projectId = "0584008d32be02877df3c8cfd0b6cafb"

export const config = getDefaultConfig({
  appName: "Optimax AI",
  projectId: projectId,
  chains: [sepolia, baseSepolia],
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
}

