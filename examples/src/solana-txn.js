import { LitWrapper } from "../lit.js";
import "dotenv/config";

const litWrapper = new LitWrapper("datil-dev")

async function generateSolanaWallet() {
    const response = await litWrapper.createSolanaWK(process.env.ETHEREUM_PRIVATE_KEY);
    console.log("Solana Public Key", response.generatedPublicKey)
    
    const txn = await litWrapper.sendSolanaWKTxn(response, process.env.ETHEREUM_PRIVATE_KEY, false)
    console.log("Signed Transaction", txn)
}
generateSolanaWallet()