import { LitWrapper, LitTester } from "../src/index.ts";
import "dotenv/config";

const litWrapper = new LitWrapper("datil-dev");

const ETHEREUM_PRIVATE_KEY = process.env.ETHEREUM_PRIVATE_KEY;

if (!ETHEREUM_PRIVATE_KEY) {
    throw new Error('ETHEREUM_PRIVATE_KEY is required');
}

async function generateSolanaWallet() {
    const response = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    console.log(
        "Fund this address with bonk and gas sol",
        response.wkInfo.generatedPublicKey
    );
}

let res = {
    pkpInfo: {
        tokenId:
            "0xe152d8bcd8761f32ef445e611952172f59cd30ae66daa4309446b3528fe054de",
        publicKey:
            "04e16a1e2a7d6c500bd701418910bb178c5f36509c879d58f87cd1e2248957f4e1121a69fb5faed33c842aae3c482fab976e14d8c29d218dd28932327a9f2dbb78",
        ethAddress: "0xE1B12f284654c080145Fed0f991D1C3B8d493A06",
    },
    wkInfo: {
        pkpAddress: "0xE1B12f284654c080145Fed0f991D1C3B8d493A06",
        id: "e8c3b6e4-6afe-46ee-b8e2-1e19b9c2f425",
        generatedPublicKey: "HPLrMfuyaQeZPiwWygnPcCfLtNEgfBJdcUYEWgDwCBhE",
    },
};

async function sendSolTxn() {
    const signedTx = await litWrapper.sendSolanaWKTxnWithSol({
        amount: 0.0022 * Math.pow(10, 9),
        toAddress: "BTBPKRJQv7mn2kxBBJUpzh3wKN567ZLdXDWcxXFQ4KaV",
        network: "mainnet-beta",
        broadcastTransaction: true,
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        wkResponse: res.wkInfo,
        pkp: res.pkpInfo,
    });
    console.log("Transaction Hash: ", signedTx);
}

async function sendBONKTxn() {
    const signedTx = await litWrapper.sendSolanaWKTxnWithCustomToken({
        tokenMintAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", // BONK MINT TOKEN
        amount: 4 * Math.pow(10, 5),
        toAddress: "BTBPKRJQv7mn2kxBBJUpzh3wKN567ZLdXDWcxXFQ4KaV",
        network: "mainnet-beta",
        broadcastTransaction: true,
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        wkResponse: res.wkInfo,
        pkp: res.pkpInfo,
    });
    console.log("Transaction Hash: ", signedTx);
}

async function generateSolanaWalletAndSendTxn() {
    const res = await litWrapper.createSolanaWK(ETHEREUM_PRIVATE_KEY);
    console.log("Solana Public Key", res.wkInfo.generatedPublicKey);

    const signedTx = await litWrapper.sendSolanaWKTxnWithSol({
        amount: 0.0022 * Math.pow(10, 9),
        toAddress: "BTBPKRJQv7mn2kxBBJUpzh3wKN567ZLdXDWcxXFQ4KaV",
        network: "mainnet-beta",
        broadcastTransaction: true,
        userPrivateKey: ETHEREUM_PRIVATE_KEY,
        wkResponse: res.wkInfo,
        pkp: res.pkpInfo,
    });
    console.log("Transaction Hash: ", signedTx);
}


async function sendBONKTxn22() {
    console.log(res)
    const signedTx = await litWrapper.sendSolanaWKTxnWithCustomToken(
        "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", // BONK MINT TOKEN
        4 * Math.pow(10, 5),
        "BTBPKRJQv7mn2kxBBJUpzh3wKN567ZLdXDWcxXFQ4KaV",
        "mainnet-beta",
        true,
        ETHEREUM_PRIVATE_KEY,
        res.wkInfo,
        res.pkpInfo
    );
    console.log("Transaction Hash: ", signedTx);
}

// generateSolanaWallet()
// sendSolTxn()
// sendBONKTxn();
sendBONKTxn22()
// generateSolanaWalletAndSendTxn()