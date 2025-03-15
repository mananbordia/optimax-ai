import { parseEther } from "ethers";

export const FEE_RECIPIENT = "0xFe83861B40EE78793b3276329DDfdeC037e1E29A";

// Get the fee amount in wei
export function getEthFee() {
  // 0.001 ETH fee
  return parseEther("0.001");
}
