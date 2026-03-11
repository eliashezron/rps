import { CdpClient } from "@coinbase/cdp-sdk";
import dotenv from "dotenv";
import { wrapFetchWithPayment, decodeXPaymentResponse  } from "x402-fetch";

dotenv.config();

const cdpClient = new CdpClient({
  apiKeyId: process.env.CDP_API_KEY_ID,
  apiKeySecret: process.env.CDP_API_KEY_SECRET,
    walletSecret: process.env.CDP_WALLET_SECRET,
});


const cdpAccount = await cdpClient.evm.getAccount({name:"buyer-account-1"});


const fetchWithPayment = wrapFetchWithPayment(fetch, cdpAccount); 

// await cdpClient.evm.requestFaucet({
//     network: "base-sepolia",
//     address: cdpAccount.address,
//     token: "usdc"
// });

const playRPS = async (playerMove) => {
    try {
        const response = await fetchWithPayment ("https://rpsr.onrender.com/rps/play", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ move: playerMove })
        });
        const data = await response.json();
        console.log("Game result:", data);

        const paymentInfo = decodeXPaymentResponse(response.headers.get("x-payment-response"));
        console.log("Payment info:", paymentInfo);
    } catch (error) {
        console.error("Error playing RPS:", error);
    }
}

await playRPS("paper");