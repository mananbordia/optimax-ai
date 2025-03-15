import { parseEther } from "ethers";
import { useSendTransaction } from "wagmi";

export const FEE_RECIPIENT = "0xFe83861B40EE78793b3276329DDfdeC037e1E29A";

// Get the fee amount in wei
export function getPromptFee() {
  // 0.001 ETH fee
  return parseEther("0.001");
}

// Send the fee to the fee recipient
export function useSendPromptFee() {
  const { isPending, sendTransactionAsync } = useSendTransaction();
  const sendPromptFee = async () => {
    try {
      const result = await sendTransactionAsync(
        {
          to: FEE_RECIPIENT,
          value: getPromptFee(),
        },
        {
          onSuccess: (txHash) => {
            console.log("Transaction successful: ", txHash);
          },
          onError: (error) => {
            console.error("Transaction error: ", error);
          },
        }
      );
      return true;
    } catch (error) {
      console.error("error", error);
      return false;
    }
  };

  return { sendPromptFee, isPending };
}
