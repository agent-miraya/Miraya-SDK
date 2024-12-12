import { LitWrapper } from "lit-wrapper-sdk";
import "dotenv/config";

const litWrapper = new LitWrapper("datil-dev")

async function generateSolanaWallet() {
    const response = await litWrapper.createSolanaWK(process.env.ETHEREUM_PRIVATE_KEY);
    console.log("Solana Public Key", response.generatedPublicKey)

    const amount = 0.01 * 10**9 // 0.01 SOL
    const txn = await litWrapper.sendSolanaWKTxn(response, process.env.ETHEREUM_PRIVATE_KEY, amount, false)
    console.log("Signed Transaction", txn)
}
generateSolanaWallet()