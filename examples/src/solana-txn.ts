import { LitWrapper } from "lit-wrapper-sdk";
import "dotenv/config";

const litWrapper = new LitWrapper("datil-dev");

const ETHEREUM_PRIVATE_KEY = process.env.ETHEREUM_PRIVATE_KEY as string;

if (!ETHEREUM_PRIVATE_KEY) {
    throw new Error("ETHEREUM_PRIVATE_KEY is required");
}

async function generateWalletAndSendSolTxn() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    console.log("Solana Public Key", response?.wkInfo.generatedPublicKey);

    const signedTx = await litWrapper.sendSolanaWKTxnWithSol({
        amount: 0.004 * Math.pow(10, 9),
        toAddress: "BTBPKRJQv7mn2kxBBJUpzh3wKN567ZLdXDWcxXFQ4KaV",
        network: "devnet",
        broadcastTransaction: false,
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        wk: response?.wkInfo,
        pkp: response?.pkpInfo,
    });
    console.log("Transaction Hash: ", signedTx);
}

generateWalletAndSendSolTxn();
